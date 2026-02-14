from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app import db
from app.models import User, Institution, Department, Teacher, Student, Section, Year
from app.utils.decorators import require_role

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/institutions', methods=['GET', 'POST'])
@jwt_required()
@require_role(['admin'])
def manage_institutions():
    """Get or create institutions"""
    if request.method == 'GET':
        institutions = Institution.query.all()
        return jsonify([{
            'id': i.id,
            'name': i.name,
            'code': i.code,
            'email': i.email
        } for i in institutions]), 200
    
    else:
        data = request.get_json()
        try:
            institution = Institution(
                name=data['name'],
                code=data.get('code'),
                address=data.get('address'),
                email=data.get('email')
            )
            db.session.add(institution)
            db.session.commit()
            
            return jsonify({
                'message': 'Institution created',
                'id': institution.id
            }), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500

@admin_bp.route('/departments/<institution_id>', methods=['POST'])
@jwt_required()
@require_role(['admin'])
def create_department(institution_id):
    """Create department"""
    data = request.get_json()
    
    try:
        dept = Department(
            institution_id=institution_id,
            name=data['name'],
            code=data.get('code')
        )
        db.session.add(dept)
        db.session.commit()
        
        return jsonify({
            'message': 'Department created',
            'id': dept.id
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/users/<user_id>/activate', methods=['PUT'])
@jwt_required()
@require_role(['admin'])
def activate_user(user_id):
    """Activate/deactivate user"""
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    data = request.get_json()
    user.is_active = data.get('is_active', True)
    
    try:
        db.session.commit()
        return jsonify({'message': 'User status updated'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/stats', methods=['GET'])
@jwt_required()
@require_role(['admin'])
def get_system_stats():
    """Get system statistics"""
    total_users = User.query.count()
    total_students = Student.query.count()
    total_teachers = Teacher.query.count()
    total_institutions = Institution.query.count()
    
    return jsonify({
        'total_users': total_users,
        'total_students': total_students,
        'total_teachers': total_teachers,
        'total_institutions': total_institutions
    }), 200
