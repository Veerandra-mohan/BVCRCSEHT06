from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from app import db
from app.models import User, Student, Teacher, Parent, UserRole
from datetime import datetime
import re
import random
import time
from flask import current_app

auth_bp = Blueprint('auth', __name__)

# Simple in-memory OTP store: {identifier: {'otp': str, 'expires': int, 'method': 'email'|'phone'}}
otps = {}

# Pending registration store: {email: {'otp': str, 'expires': int, 'data': {...registration data...}}}
pending_registrations = {}

def _generate_otp():
    return f"{random.randint(0, 999999):06d}"

def _send_email_mock(to_email, otp):
    # For demo: log OTP to app logger and return True
    current_app.logger.info(f"[OTP EMAIL] To: {to_email} OTP: {otp}")
    return True

def _send_sms_mock(to_phone, otp):
    # For demo: log OTP to app logger and return True
    current_app.logger.info(f"[OTP SMS] To: {to_phone} OTP: {otp}")
    return True

def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_password(password):
    """Validate password strength"""
    if len(password) < 8:
        return False, 'Password must be at least 8 characters long'
    if not any(c.isupper() for c in password):
        return False, 'Password must contain at least one uppercase letter'
    if not any(c.isdigit() for c in password):
        return False, 'Password must contain at least one digit'
    return True, 'Valid'

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user"""
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['email', 'username', 'password', 'first_name', 'last_name', 'role']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Validate email format
    if not validate_email(data['email']):
        return jsonify({'error': 'Invalid email format'}), 400
    
    # Check if email already exists
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already registered'}), 409
    
    # Check if username already exists
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already taken'}), 409
    
    # Validate password strength
    is_valid, msg = validate_password(data['password'])
    if not is_valid:
        return jsonify({'error': msg}), 400
    
    # Validate role
    try:
        role = UserRole[data['role'].upper()]
    except KeyError:
        return jsonify({'error': 'Invalid role'}), 400
    
    try:
        # Create user
        user = User(
            email=data['email'],
            username=data['username'],
            password_hash=generate_password_hash(data['password']),
            first_name=data['first_name'],
            last_name=data['last_name'],
            role=role
        )
        
        db.session.add(user)
        db.session.flush()
        
        # Create role-specific profile
        if role == UserRole.STUDENT:
            student = Student(
                user_id=user.id,
                institution_id=data.get('institution_id'),
                roll_number=data.get('roll_number')
            )
            db.session.add(student)
        
        elif role == UserRole.TEACHER:
            teacher = Teacher(
                user_id=user.id,
                department_id=data.get('department_id'),
                employee_id=data.get('employee_id')
            )
            db.session.add(teacher)
        
        elif role == UserRole.PARENT:
            parent = Parent(
                user_id=user.id,
                phone=data.get('phone'),
                relationship_to_student=data.get('relationship')
            )
            db.session.add(parent)
        
        db.session.commit()
        
        return jsonify({
            'message': 'User registered successfully',
            'user': {
                'id': user.id,
                'email': user.email,
                'username': user.username,
                'role': user.role.value
            }
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """User login"""
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email and password required'}), 400
    
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not check_password_hash(user.password_hash, data['password']):
        return jsonify({'error': 'Invalid email or password'}), 401
    
    if not user.is_active:
        return jsonify({'error': 'User account is inactive'}), 403
    
    try:
        # Update last login
        user.last_login = datetime.utcnow()
        db.session.commit()
        
        # Create tokens
        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)
        
        return jsonify({
            'message': 'Login successful',
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user': {
                'id': user.id,
                'email': user.email,
                'username': user.username,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'role': user.role.value
            }
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """Refresh access token"""
    user_id = get_jwt_identity()
    access_token = create_access_token(identity=user_id)
    return jsonify({'access_token': access_token}), 200

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Get current user profile"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    profile_data = {
        'id': user.id,
        'email': user.email,
        'username': user.username,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'role': user.role.value,
        'created_at': user.created_at.isoformat()
    }
    
    return jsonify(profile_data), 200

@auth_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """Update user profile"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    data = request.get_json()
    
    if 'first_name' in data:
        user.first_name = data['first_name']
    if 'last_name' in data:
        user.last_name = data['last_name']
    if 'profile_picture' in data:
        user.profile_picture = data['profile_picture']
    
    user.updated_at = datetime.utcnow()
    
    try:
        db.session.commit()
        return jsonify({'message': 'Profile updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    """User logout (token invalidation handled on frontend)"""
    return jsonify({'message': 'Logged out successfully'}), 200


@auth_bp.route('/register-initiate', methods=['POST'])
def register_initiate():
    """Initiate registration by sending OTP to email. 
    Expects: {email, username, first_name, last_name, role, password, password_confirm, phone (optional)}"""
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['email', 'username', 'first_name', 'last_name', 'role', 'password', 'password_confirm']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Validate email format
    if not validate_email(data['email']):
        return jsonify({'error': 'Invalid email format'}), 400
    
    # Check if email already exists
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already registered'}), 409
    
    # Check if username already exists
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already taken'}), 409
    
    # Validate passwords match
    if data['password'] != data['password_confirm']:
        return jsonify({'error': 'Passwords do not match'}), 400
    
    # Validate password strength
    is_valid, msg = validate_password(data['password'])
    if not is_valid:
        return jsonify({'error': msg}), 400
    
    # Validate role
    try:
        role = UserRole[data['role'].upper()]
    except KeyError:
        return jsonify({'error': 'Invalid role'}), 400
    
    try:
        # Generate and send OTP
        otp = _generate_otp()
        expires = int(time.time()) + 600  # 10 minutes for registration
        
        # Store pending registration data
        pending_registrations[data['email']] = {
            'otp': otp,
            'expires': expires,
            'data': {
                'email': data['email'],
                'username': data['username'],
                'password': data['password'],
                'first_name': data['first_name'],
                'last_name': data['last_name'],
                'role': data['role'],
                'institution_id': data.get('institution_id'),
                'roll_number': data.get('roll_number'),
                'department_id': data.get('department_id'),
                'employee_id': data.get('employee_id'),
                'phone': data.get('phone'),
                'relationship': data.get('relationship')
            }
        }
        
        # Send OTP via email
        sent = _send_email_mock(data['email'], otp)
        
        if sent:
            return jsonify({
                'message': f'OTP sent to {data["email"]}. Please verify your email.',
                'expires_in': 600
            }), 200
        else:
            # Clean up if sending failed
            del pending_registrations[data['email']]
            return jsonify({'error': 'Failed to send OTP'}), 500
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@auth_bp.route('/register-verify', methods=['POST'])
def register_verify():
    """Verify OTP and complete registration.
    Expects: {email, otp}"""
    data = request.get_json()
    
    email = data.get('email')
    otp = data.get('otp')
    
    if not email or not otp:
        return jsonify({'error': 'Email and OTP required'}), 400
    
    # Check if pending registration exists
    if email not in pending_registrations:
        return jsonify({'error': 'No pending registration found. Please register again.'}), 404
    
    pending = pending_registrations[email]
    now = int(time.time())
    
    # Verify OTP
    if pending.get('expires', 0) < now:
        del pending_registrations[email]
        return jsonify({'error': 'OTP expired. Please register again.'}), 401
    
    if pending.get('otp') != otp:
        return jsonify({'error': 'Invalid OTP'}), 401
    
    try:
        reg_data = pending['data']
        role = UserRole[reg_data['role'].upper()]
        
        # Create user
        user = User(
            email=reg_data['email'],
            username=reg_data['username'],
            password_hash=generate_password_hash(reg_data['password']),
            first_name=reg_data['first_name'],
            last_name=reg_data['last_name'],
            role=role
        )
        
        db.session.add(user)
        db.session.flush()
        
        # Create role-specific profile
        if role == UserRole.STUDENT:
            student = Student(
                user_id=user.id,
                institution_id=reg_data.get('institution_id'),
                roll_number=reg_data.get('roll_number')
            )
            db.session.add(student)
        
        elif role == UserRole.TEACHER:
            teacher = Teacher(
                user_id=user.id,
                department_id=reg_data.get('department_id'),
                employee_id=reg_data.get('employee_id')
            )
            db.session.add(teacher)
        
        elif role == UserRole.PARENT:
            parent = Parent(
                user_id=user.id,
                phone=reg_data.get('phone'),
                relationship_to_student=reg_data.get('relationship')
            )
            db.session.add(parent)
        
        db.session.commit()
        
        # Remove pending registration
        del pending_registrations[email]
        
        # Create tokens
        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)
        
        return jsonify({
            'message': 'Email verified! Account created successfully.',
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user': {
                'id': user.id,
                'email': user.email,
                'username': user.username,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'role': user.role.value
            }
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@auth_bp.route('/send-otp', methods=['POST'])
def send_otp():
    """Send OTP to email or phone. Expects JSON: {identifier: str, method: 'email'|'phone'}"""
    data = request.get_json() or {}
    identifier = data.get('identifier')
    method = data.get('method', 'email')
    if not identifier:
        return jsonify({'error': 'Identifier required'}), 400

    otp = _generate_otp()
    expires = int(time.time()) + 300  # 5 minutes
    otps[identifier] = {'otp': otp, 'expires': expires, 'method': method}

    sent = False
    if method == 'email':
        sent = _send_email_mock(identifier, otp)
    else:
        sent = _send_sms_mock(identifier, otp)

    if sent:
        return jsonify({'message': f'OTP sent to {identifier} (demo).'}), 200
    return jsonify({'error': 'Failed to send OTP'}), 500


@auth_bp.route('/verify-otp', methods=['POST'])
def verify_otp():
    """Verify OTP and return tokens. JSON: {identifier, otp, role (optional)}"""
    data = request.get_json() or {}
    identifier = data.get('identifier')
    otp = data.get('otp')
    role = data.get('role', 'student')
    if not identifier or not otp:
        return jsonify({'error': 'Identifier and otp required'}), 400

    record = otps.get(identifier)
    now = int(time.time())
    if not record or record.get('expires', 0) < now or record.get('otp') != otp:
        return jsonify({'error': 'Invalid or expired OTP'}), 401

    # OTP is valid -- find or create user
    user = None
    if record.get('method') == 'email':
        user = User.query.filter_by(email=identifier).first()
    else:
        # phone stored in Parent model or in User.profile via parent phone; for demo, search Parent
        parent = Parent.query.filter_by(phone=identifier).first()
        if parent:
            user = User.query.get(parent.user_id)

    if not user:
        # create minimal user (email OTP uses email as username; phone uses phone as username)
        try:
            try:
                role_enum = UserRole[role.upper()]
            except Exception:
                role_enum = UserRole.STUDENT

            username = identifier.split('@')[0] if '@' in identifier else f'user_{identifier[-6:]}'
            user = User(email=identifier if '@' in identifier else f'{username}@example.com',
                        username=username,
                        password_hash=generate_password_hash(''),
                        first_name='Demo',
                        last_name=role_enum.value.capitalize(),
                        role=role_enum)
            db.session.add(user)
            db.session.flush()
            # create role profile if parent
            if role_enum == UserRole.PARENT:
                parent = Parent(user_id=user.id, phone=identifier)
                db.session.add(parent)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500

    # consume OTP
    try:
        del otps[identifier]
    except KeyError:
        pass

    # create tokens
    try:
        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)
        return jsonify({'message': 'OTP verified', 'access_token': access_token, 'refresh_token': refresh_token,
                        'user': {'id': user.id, 'email': user.email, 'username': user.username, 'first_name': user.first_name, 'last_name': user.last_name, 'role': user.role.value}}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
