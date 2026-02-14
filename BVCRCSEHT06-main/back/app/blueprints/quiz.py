from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import Quiz, Question, QuestionOption, QuizAttempt, StudentAnswer, Student
from app.utils.decorators import require_role
from datetime import datetime

quiz_bp = Blueprint('quiz', __name__)

@quiz_bp.route('', methods=['GET'])
@jwt_required()
def get_quizzes():
    """Get all available quizzes"""
    quizzes = Quiz.query.filter_by(is_published=True).all()
    return jsonify([{
        'id': q.id,
        'title': q.title,
        'description': q.description,
        'subject': q.subject,
        'difficulty': q.difficulty_level,
        'total_points': q.total_points,
        'duration': q.duration_minutes
    } for q in quizzes]), 200

@quiz_bp.route('/<quiz_id>', methods=['GET'])
@jwt_required()
def get_quiz(quiz_id):
    """Get quiz details"""
    quiz = Quiz.query.get(quiz_id)
    if not quiz:
        return jsonify({'error': 'Quiz not found'}), 404
    
    return jsonify({
        'id': quiz.id,
        'title': quiz.title,
        'description': quiz.description,
        'questions': [{
            'id': q.id,
            'type': q.question_type,
            'text': q.question_text,
            'points': q.points,
            'options': [{
                'id': o.id,
                'text': o.option_text
            } for o in q.options] if q.question_type == 'mcq' else []
        } for q in quiz.questions]
    }), 200

@quiz_bp.route('/<quiz_id>/attempt', methods=['POST'])
@jwt_required()
@require_role(['student'])
def start_quiz_attempt(quiz_id):
    """Start a quiz attempt"""
    user_id = get_jwt_identity()
    student = Student.query.filter_by(user_id=user_id).first()
    
    if not student:
        return jsonify({'error': 'Student not found'}), 404
    
    quiz = Quiz.query.get(quiz_id)
    if not quiz:
        return jsonify({'error': 'Quiz not found'}), 404
    
    # Check previous attempts
    previous_attempts = QuizAttempt.query.filter_by(
        quiz_id=quiz_id,
        student_id=student.id
    ).count()
    
    if previous_attempts >= quiz.max_retakes:
        return jsonify({'error': 'Maximum attempts exceeded'}), 403
    
    try:
        attempt = QuizAttempt(
            quiz_id=quiz_id,
            student_id=student.id,
            attempt_number=previous_attempts + 1,
            status='in_progress'
        )
        db.session.add(attempt)
        db.session.commit()
        
        return jsonify({
            'attempt_id': attempt.id,
            'attempt_number': attempt.attempt_number,
            'quiz_id': quiz_id
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@quiz_bp.route('/attempt/<attempt_id>/submit', methods=['POST'])
@jwt_required()
def submit_quiz_attempt(attempt_id):
    """Submit quiz answers"""
    data = request.get_json()
    
    attempt = QuizAttempt.query.get(attempt_id)
    if not attempt:
        return jsonify({'error': 'Attempt not found'}), 404
    
    try:
        answers = data.get('answers', [])
        total_score = 0
        
        for answer_data in answers:
            question = Question.query.get(answer_data['question_id'])
            
            answer = StudentAnswer(
                attempt_id=attempt_id,
                question_id=answer_data['question_id'],
                selected_option_id=answer_data.get('option_id'),
                answer_text=answer_data.get('text')
            )
            
            if question.question_type == 'mcq':
                correct_option = QuestionOption.query.filter_by(
                    question_id=question.id,
                    is_correct=True
                ).first()
                
                if answer.selected_option_id == correct_option.id:
                    answer.is_correct = True
                    answer.points_earned = question.points
                    total_score += question.points
                else:
                    answer.is_correct = False
                    answer.points_earned = 0
            
            db.session.add(answer)
        
        attempt.status = 'completed'
        attempt.score = total_score
        attempt.total_points = sum(q.points for q in attempt.quiz.questions)
        attempt.percentage = (total_score / attempt.total_points * 100) if attempt.total_points > 0 else 0
        attempt.completed_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'message': 'Quiz submitted successfully',
            'score': attempt.score,
            'total': attempt.total_points,
            'percentage': attempt.percentage
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@quiz_bp.route('/attempts/<student_id>', methods=['GET'])
@jwt_required()
@require_role(['teacher', 'admin'])
def get_student_attempts(student_id):
    """Get student's quiz attempts"""
    attempts = QuizAttempt.query.filter_by(student_id=student_id).all()
    
    return jsonify([{
        'id': a.id,
        'quiz_title': a.quiz.title,
        'attempt_number': a.attempt_number,
        'score': a.score,
        'percentage': a.percentage,
        'completed_at': a.completed_at.isoformat() if a.completed_at else None
    } for a in attempts]), 200
