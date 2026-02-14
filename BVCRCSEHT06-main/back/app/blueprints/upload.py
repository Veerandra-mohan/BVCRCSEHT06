from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from app import db
from app.models import User, Submission, Assignment, Student
from app.services.ai_service import AIAnalysisService
from app.services.file_processor import FileProcessor
from app.utils.decorators import require_role
from datetime import datetime
import os

upload_bp = Blueprint('upload', __name__)

ALLOWED_EXTENSIONS = {'pdf', 'docx', 'txt', 'mp3', 'wav', 'jpg', 'jpeg', 'png', 'py', 'csv'}

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@upload_bp.route('/essay', methods=['POST'])
@jwt_required()
@require_role(['student'])
def upload_essay():
    """Upload and analyze essay"""
    user_id = get_jwt_identity()
    student = Student.query.filter_by(user_id=user_id).first()
    
    if not student:
        return jsonify({'error': 'Student profile not found'}), 404
    
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({'error': 'File type not allowed'}), 400
    
    try:
        # Save file
        filename = secure_filename(file.filename)
        upload_folder = current_app.config['UPLOAD_FOLDER']
        os.makedirs(upload_folder, exist_ok=True)
        
        filepath = os.path.join(upload_folder, filename)
        file.save(filepath)
        
        # Process file
        file_processor = FileProcessor()
        essay_text = file_processor.extract_text(filepath)
        
        # AI Analysis
        ai_service = AIAnalysisService()
        analysis = ai_service.analyze_essay(
            essay_text,
            student.user.first_name,
            request.args.get('mode', 'student')  # student, teacher, parent
        )
        
        return jsonify({
            'message': 'Essay analyzed successfully',
            'analysis': analysis,
            'file_path': filepath
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@upload_bp.route('/code', methods=['POST'])
@jwt_required()
@require_role(['student'])
def upload_code():
    """Upload and analyze code"""
    user_id = get_jwt_identity()
    student = Student.query.filter_by(user_id=user_id).first()
    
    if not student:
        return jsonify({'error': 'Student profile not found'}), 404
    
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    
    if not file.filename.endswith('.py'):
        return jsonify({'error': 'Only Python files allowed'}), 400
    
    try:
        # Save file
        filename = secure_filename(file.filename)
        upload_folder = current_app.config['UPLOAD_FOLDER']
        filepath = os.path.join(upload_folder, filename)
        file.save(filepath)
        
        # Read code
        with open(filepath, 'r') as f:
            code_text = f.read()
        
        # AI Analysis
        ai_service = AIAnalysisService()
        analysis = ai_service.analyze_code(code_text)
        
        return jsonify({
            'message': 'Code analyzed successfully',
            'analysis': analysis,
            'file_path': filepath
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@upload_bp.route('/audio', methods=['POST'])
@jwt_required()
@require_role(['student'])
def upload_audio():
    """Upload and analyze audio"""
    user_id = get_jwt_identity()
    
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    
    if not file.filename.lower().endswith(('.mp3', '.wav', '.m4a')):
        return jsonify({'error': 'Only audio files allowed'}), 400
    
    try:
        filename = secure_filename(file.filename)
        upload_folder = current_app.config['UPLOAD_FOLDER']
        filepath = os.path.join(upload_folder, filename)
        file.save(filepath)
        
        # Process audio
        file_processor = FileProcessor()
        transcription = file_processor.speech_to_text(filepath)
        
        # AI Analysis
        ai_service = AIAnalysisService()
        analysis = ai_service.analyze_audio(transcription, filepath)
        
        return jsonify({
            'message': 'Audio analyzed successfully',
            'transcription': transcription,
            'analysis': analysis,
            'file_path': filepath
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@upload_bp.route('/image', methods=['POST'])
@jwt_required()
def upload_image():
    """Upload and analyze image"""
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    
    if not file.filename.lower().endswith(('.jpg', '.jpeg', '.png', '.gif')):
        return jsonify({'error': 'Only image files allowed'}), 400
    
    try:
        filename = secure_filename(file.filename)
        upload_folder = current_app.config['UPLOAD_FOLDER']
        filepath = os.path.join(upload_folder, filename)
        file.save(filepath)
        
        # Process image
        file_processor = FileProcessor()
        text_extracted = file_processor.ocr_image(filepath)
        
        # AI Analysis
        ai_service = AIAnalysisService()
        analysis = ai_service.analyze_image(filepath, text_extracted)
        
        return jsonify({
            'message': 'Image analyzed successfully',
            'extracted_text': text_extracted,
            'analysis': analysis,
            'file_path': filepath
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@upload_bp.route('/pdf/read', methods=['POST'])
@jwt_required()
def pdf_intelligent_read():
    """Upload PDF and get intelligent reading support"""
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    
    if not file.filename.lower().endswith('.pdf'):
        return jsonify({'error': 'Only PDF files allowed'}), 400
    
    try:
        filename = secure_filename(file.filename)
        upload_folder = current_app.config['UPLOAD_FOLDER']
        filepath = os.path.join(upload_folder, filename)
        file.save(filepath)
        
        # Extract PDF text and metadata
        file_processor = FileProcessor()
        pdf_content = file_processor.extract_pdf_content(filepath)
        
        return jsonify({
            'message': 'PDF loaded successfully',
            'pdf_data': pdf_content,
            'file_path': filepath
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@upload_bp.route('/word-definition', methods=['POST'])
@jwt_required()
def get_word_definition():
    """Get instant definition and pronunciation for a word"""
    data = request.get_json()
    
    if not data or 'word' not in data:
        return jsonify({'error': 'Word required'}), 400
    
    word = data['word']
    context = data.get('context', '')
    
    try:
        ai_service = AIAnalysisService()
        definition = ai_service.get_word_definition(word, context)
        
        return jsonify({
            'word': word,
            'definition': definition
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@upload_bp.route('/submission/<assignment_id>', methods=['POST'])
@jwt_required()
@require_role(['student'])
def submit_assignment(assignment_id):
    """Submit assignment with file"""
    user_id = get_jwt_identity()
    student = Student.query.filter_by(user_id=user_id).first()
    
    if not student:
        return jsonify({'error': 'Student profile not found'}), 404
    
    assignment = Assignment.query.get(assignment_id)
    if not assignment:
        return jsonify({'error': 'Assignment not found'}), 404
    
    # Check if student has already submitted
    existing = Submission.query.filter_by(
        assignment_id=assignment_id,
        student_id=student.id
    ).first()
    
    if existing and existing.status != 'draft':
        return jsonify({'error': 'Assignment already submitted'}), 409
    
    try:
        if 'file' in request.files:
            file = request.files['file']
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                upload_folder = current_app.config['UPLOAD_FOLDER']
                filepath = os.path.join(upload_folder, filename)
                file.save(filepath)
            else:
                return jsonify({'error': 'Invalid file'}), 400
        else:
            filepath = None
        
        submission_text = request.form.get('text', '')
        
        if not filepath and not submission_text:
            return jsonify({'error': 'No content provided'}), 400
        
        if existing:
            existing.file_path = filepath
            existing.submission_text = submission_text
            existing.submission_date = datetime.utcnow()
            existing.status = 'submitted'
            submission = existing
        else:
            submission = Submission(
                assignment_id=assignment_id,
                student_id=student.id,
                file_path=filepath,
                submission_text=submission_text,
                status='submitted',
                submission_date=datetime.utcnow()
            )
            db.session.add(submission)
        
        db.session.commit()
        
        # Generate AI feedback
        ai_service = AIAnalysisService()
        if filepath:
            file_processor = FileProcessor()
            content = file_processor.extract_text(filepath)
        else:
            content = submission_text
        
        feedback = ai_service.analyze_essay(content, 'Assignment')
        submission.ai_feedback = str(feedback)
        db.session.commit()
        
        return jsonify({
            'message': 'Assignment submitted successfully',
            'submission_id': submission.id,
            'ai_feedback': feedback
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
