from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import Student, Teacher, Performance, QuizAttempt, Submission, Assignment
from app.utils.decorators import require_role
from sqlalchemy import func

analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route('/student/dashboard', methods=['GET'])
@jwt_required()
@require_role(['student'])
def student_dashboard():
    """Get student analytics dashboard"""
    user_id = get_jwt_identity()
    student = Student.query.filter_by(user_id=user_id).first()
    
    if not student:
        return jsonify({'error': 'Student not found'}), 404
    
    # Get performance data
    performance = Performance.query.filter_by(student_id=student.id).first()
    
    # Calculate quiz statistics
    quiz_attempts = QuizAttempt.query.filter_by(
        student_id=student.id,
        status='completed'
    ).all()
    
    avg_quiz_score = sum(a.percentage for a in quiz_attempts) / len(quiz_attempts) if quiz_attempts else 0
    
    # Calculate assignment statistics
    submissions = Submission.query.filter_by(
        student_id=student.id,
        status='graded'
    ).all()
    
    avg_assignment_score = sum(s.grade for s in submissions) / len(submissions) if submissions else 0
    
    return jsonify({
        'student_name': student.user.first_name + ' ' + student.user.last_name,
        'quiz_average': avg_quiz_score,
        'assignment_average': avg_assignment_score,
        'overall_score': (avg_quiz_score + avg_assignment_score) / 2,
        'total_quizzes_taken': len(quiz_attempts),
        'total_assignments_submitted': len(submissions),
        'weak_concepts': performance.weak_concepts if performance else [],
        'strong_concepts': performance.strong_concepts if performance else [],
        'improvement_suggestions': performance.improvement_suggestions if performance else [],
        'learning_streak': performance.learning_streak if performance else 0
    }), 200

@analytics_bp.route('/teacher/class-analytics/<section_id>', methods=['GET'])
@jwt_required()
@require_role(['teacher'])
def teacher_class_analytics(section_id):
    """Get class analytics for teacher"""
    from app.models import Section
    
    section = Section.query.get(section_id)
    if not section:
        return jsonify({'error': 'Section not found'}), 404
    
    students = Student.query.filter_by(section_id=section_id).all()
    
    analytics_data = []
    for student in students:
        quiz_attempts = QuizAttempt.query.filter_by(student_id=student.id).all()
        submissions = Submission.query.filter_by(student_id=student.id).all()
        
        avg_quiz = sum(a.percentage for a in quiz_attempts) / len(quiz_attempts) if quiz_attempts else 0
        avg_assignment = sum(s.grade for s in submissions if s.grade) / len([s for s in submissions if s.grade]) if submissions else 0
        
        analytics_data.append({
            'student_name': student.user.first_name + ' ' + student.user.last_name,
            'roll_number': student.roll_number,
            'avg_quiz_score': avg_quiz,
            'avg_assignment_score': avg_assignment,
            'overall_score': (avg_quiz + avg_assignment) / 2,
            'quizzes_taken': len(quiz_attempts),
            'assignments_submitted': len(submissions)
        })
    
    return jsonify({
        'section': section.name,
        'total_students': len(students),
        'class_average': sum(a['overall_score'] for a in analytics_data) / len(analytics_data) if analytics_data else 0,
        'students': analytics_data
    }), 200

@analytics_bp.route('/parent/child-progress/<student_id>', methods=['GET'])
@jwt_required()
@require_role(['parent'])
def parent_child_progress(student_id):
    """Get child progress for parent"""
    student = Student.query.get(student_id)
    
    if not student:
        return jsonify({'error': 'Student not found'}), 404
    
    performance = Performance.query.filter_by(student_id=student_id).first()
    
    quiz_attempts = QuizAttempt.query.filter_by(student_id=student_id).all()
    submissions = Submission.query.filter_by(student_id=student_id).all()
    
    return jsonify({
        'student_name': student.user.first_name + ' ' + student.user.last_name,
        'roll_number': student.roll_number,
        'overall_performance': (performance.overall_score if performance else 0),
        'strengths': performance.strong_concepts if performance else [],
        'weaknesses': performance.weak_concepts if performance else [],
        'suggestions': performance.improvement_suggestions if performance else [],
        'quiz_score_trend': [{'quiz_num': i+1, 'score': a.percentage} for i, a in enumerate(quiz_attempts[-5:])],
        'recent_assignments': [{
            'title': s.assignment.title,
            'grade': s.grade,
            'feedback': s.ai_feedback
        } for s in submissions[-5:]]
    }), 200

@analytics_bp.route('/weak-concepts/<student_id>', methods=['GET'])
@jwt_required()
def get_weak_concepts(student_id):
    """Identify weak concepts for a student"""
    student = Student.query.get(student_id)
    
    if not student:
        return jsonify({'error': 'Student not found'}), 404
    
    # Find questions where student answered wrong
    from app.models import StudentAnswer, Question
    
    wrong_answers = db.session.query(Question.subject, func.count(StudentAnswer.id)).join(
        StudentAnswer
    ).filter(
        StudentAnswer.is_correct == False,
        QuizAttempt.student_id == student_id
    ).group_by(Question.subject).all()
    
    return jsonify({
        'weak_concepts': [{'subject': w[0], 'error_count': w[1]} for w in wrong_answers]
    }), 200

@analytics_bp.route('/leaderboard/<section_id>', methods=['GET'])
@jwt_required()
def section_leaderboard(section_id):
    """Get section leaderboard"""
    students = Student.query.filter_by(section_id=section_id).all()
    
    leaderboard_data = []
    for student in students:
        quiz_attempts = QuizAttempt.query.filter_by(student_id=student.id).all()
        avg_score = sum(a.percentage for a in quiz_attempts) / len(quiz_attempts) if quiz_attempts else 0
        
        leaderboard_data.append({
            'rank': 0,
            'student_name': student.user.first_name + ' ' + student.user.last_name,
            'score': avg_score,
            'quizzes_taken': len(quiz_attempts)
        })
    
    # Sort by score
    leaderboard_data.sort(key=lambda x: x['score'], reverse=True)
    
    # Assign ranks
    for i, item in enumerate(leaderboard_data):
        item['rank'] = i + 1
    
    return jsonify(leaderboard_data), 200
