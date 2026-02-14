from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import DoubtRoom, DoubtMessage, Student, Teacher, User, doubt_room_members
from app.utils.decorators import require_role
from datetime import datetime, timedelta

doubt_bp = Blueprint('doubt', __name__)

@doubt_bp.route('', methods=['POST'])
@jwt_required()
@require_role(['student'])
def create_doubt_room():
    """Create a temporary doubt room"""
    user_id = get_jwt_identity()
    student = Student.query.filter_by(user_id=user_id).first()
    
    if not student:
        return jsonify({'error': 'Student not found'}), 404
    
    data = request.get_json()
    
    if not data or 'topic' not in data:
        return jsonify({'error': 'Topic required'}), 400
    
    try:
        expiry_duration = int(data.get('expiry_hours', 2))
        expiry_time = datetime.utcnow() + timedelta(hours=expiry_duration)
        
        room = DoubtRoom(
            creator_student_id=student.id,
            topic=data['topic'],
            description=data.get('description'),
            expiry_time=expiry_time
        )
        
        db.session.add(room)
        db.session.commit()
        
        return jsonify({
            'message': 'Doubt room created',
            'room_id': room.id,
            'expiry_time': expiry_time.isoformat()
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@doubt_bp.route('/<room_id>', methods=['GET'])
@jwt_required()
def get_doubt_room(room_id):
    """Get doubt room details"""
    room = DoubtRoom.query.get(room_id)
    
    if not room:
        return jsonify({'error': 'Room not found'}), 404
    
    # Check if room is expired
    if datetime.utcnow() > room.expiry_time and room.status == 'active':
        room.status = 'closed'
        room.closed_at = datetime.utcnow()
        db.session.commit()
    
    return jsonify({
        'id': room.id,
        'topic': room.topic,
        'description': room.description,
        'status': room.status,
        'created_at': room.created_at.isoformat(),
        'expiry_time': room.expiry_time.isoformat(),
        'messages': [{
            'id': m.id,
            'user': m.user.username,
            'message': m.message_text,
            'is_best_answer': m.is_best_answer,
            'votes': m.votes,
            'created_at': m.created_at.isoformat()
        } for m in room.messages]
    }), 200

@doubt_bp.route('/<room_id>/message', methods=['POST'])
@jwt_required()
def add_message_to_doubt_room(room_id):
    """Add a message to doubt room"""
    user_id = get_jwt_identity()
    room = DoubtRoom.query.get(room_id)
    
    if not room:
        return jsonify({'error': 'Room not found'}), 404
    
    data = request.get_json()
    
    if not data or 'message' not in data:
        return jsonify({'error': 'Message required'}), 400
    
    try:
        message = DoubtMessage(
            room_id=room_id,
            user_id=user_id,
            message_type=data.get('type', 'text'),
            message_text=data['message']
        )
        
        db.session.add(message)
        db.session.commit()
        
        return jsonify({
            'message_id': message.id,
            'created_at': message.created_at.isoformat()
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@doubt_bp.route('/<room_id>/message/<message_id>/vote', methods=['POST'])
@jwt_required()
def vote_message(room_id, message_id):
    """Vote on a message (helpful/unhelpful)"""
    message = DoubtMessage.query.get(message_id)
    
    if not message:
        return jsonify({'error': 'Message not found'}), 404
    
    data = request.get_json()
    vote_type = data.get('vote_type', 'up')  # up or down
    
    try:
        if vote_type == 'up':
            message.votes += 1
        else:
            message.votes = max(0, message.votes - 1)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Vote recorded',
            'votes': message.votes
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@doubt_bp.route('/<room_id>/escalate', methods=['POST'])
@jwt_required()
@require_role(['student'])
def escalate_to_teacher(room_id):
    """Escalate doubt to teacher"""
    user_id = get_jwt_identity()
    student = Student.query.filter_by(user_id=user_id).first()
    room = DoubtRoom.query.get(room_id)
    
    if not room:
        return jsonify({'error': 'Room not found'}), 404
    
    if room.creator_student_id != student.id:
        return jsonify({'error': 'Only creator can escalate'}), 403
    
    data = request.get_json()
    teacher_id = data.get('teacher_id')
    
    try:
        room.teacher_id = teacher_id
        db.session.commit()
        
        return jsonify({'message': 'Escalated to teacher'}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@doubt_bp.route('/open', methods=['GET'])
@jwt_required()
def get_open_doubt_rooms():
    """Get all open doubt rooms"""
    rooms = DoubtRoom.query.filter_by(status='active').all()
    
    # Filter expired rooms
    active_rooms = [r for r in rooms if datetime.utcnow() <= r.expiry_time]
    
    return jsonify([{
        'id': r.id,
        'topic': r.topic,
        'creator': r.student_members[0].user.username if r.student_members else 'Unknown',
        'created_at': r.created_at.isoformat(),
        'message_count': len(r.messages)
    } for r in active_rooms]), 200
