from app import db
from datetime import datetime
from enum import Enum
import uuid

class UserRole(Enum):
    """User role enumeration"""
    STUDENT = 'student'
    TEACHER = 'teacher'
    PARENT = 'parent'
    ADMIN = 'admin'

class User(db.Model):
    """Base User model with role-based access"""
    __tablename__ = 'users'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(80), nullable=False)
    last_name = db.Column(db.String(80), nullable=False)
    role = db.Column(db.Enum(UserRole), nullable=False, default=UserRole.STUDENT)
    profile_picture = db.Column(db.String(255))
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    
    # Relationships
    student_profile = db.relationship('Student', uselist=False, backref='user')
    teacher_profile = db.relationship('Teacher', uselist=False, backref='user')
    parent_profile = db.relationship('Parent', uselist=False, backref='user')
    
    def __repr__(self):
        return f'<User {self.username}>'

class Institution(db.Model):
    """Institution/College model"""
    __tablename__ = 'institutions'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(255), nullable=False, unique=True)
    code = db.Column(db.String(20), unique=True)
    address = db.Column(db.Text)
    phone = db.Column(db.String(20))
    email = db.Column(db.String(120))
    website = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    departments = db.relationship('Department', backref='institution', cascade='all, delete-orphan')
    students = db.relationship('Student', backref='institution', cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<Institution {self.name}>'

class Department(db.Model):
    """Department model (CSE, ECE, etc.)"""
    __tablename__ = 'departments'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    institution_id = db.Column(db.String(36), db.ForeignKey('institutions.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    code = db.Column(db.String(20))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    years = db.relationship('Year', backref='department', cascade='all, delete-orphan')
    teachers = db.relationship('Teacher', backref='department')
    
    __table_args__ = (db.UniqueConstraint('institution_id', 'code', name='unique_dept_code'),)
    
    def __repr__(self):
        return f'<Department {self.name}>'

class Year(db.Model):
    """Academic year (1st, 2nd, 3rd, 4th year)"""
    __tablename__ = 'years'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    department_id = db.Column(db.String(36), db.ForeignKey('departments.id'), nullable=False)
    year_number = db.Column(db.Integer, nullable=False)  # 1, 2, 3, 4
    academic_year = db.Column(db.String(20))  # 2024-2025
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    sections = db.relationship('Section', backref='year', cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<Year {self.year_number}>'

class Section(db.Model):
    """Class/Section (A, B, C, etc.)"""
    __tablename__ = 'sections'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    year_id = db.Column(db.String(36), db.ForeignKey('years.id'), nullable=False)
    name = db.Column(db.String(50), nullable=False)  # A, B, C
    capacity = db.Column(db.Integer, default=60)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    students = db.relationship('Student', backref='section')
    assignments = db.relationship('Assignment', backref='section')
    
    def __repr__(self):
        return f'<Section {self.name}>'

class Student(db.Model):
    """Student profile"""
    __tablename__ = 'students'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), unique=True, nullable=False)
    institution_id = db.Column(db.String(36), db.ForeignKey('institutions.id'), nullable=False)
    section_id = db.Column(db.String(36), db.ForeignKey('sections.id'))
    roll_number = db.Column(db.String(50))
    parent_id = db.Column(db.String(36), db.ForeignKey('parents.id'))
    registration_number = db.Column(db.String(100), unique=True)
    enrollment_date = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    submissions = db.relationship('Submission', backref='student', cascade='all, delete-orphan')
    quiz_attempts = db.relationship('QuizAttempt', backref='student', cascade='all, delete-orphan')
    performances = db.relationship('Performance', backref='student', cascade='all, delete-orphan')
    doubt_rooms = db.relationship('DoubtRoom', secondary='doubt_room_members', backref='student_members')
    
    def __repr__(self):
        return f'<Student {self.roll_number}>'

class Teacher(db.Model):
    """Teacher profile"""
    __tablename__ = 'teachers'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), unique=True, nullable=False)
    department_id = db.Column(db.String(36), db.ForeignKey('departments.id'), nullable=False)
    employee_id = db.Column(db.String(100), unique=True)
    qualification = db.Column(db.String(255))
    specialization = db.Column(db.String(255))
    experience_years = db.Column(db.Integer, default=0)
    office_hours = db.Column(db.Text)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    quizzes = db.relationship('Quiz', backref='teacher', cascade='all, delete-orphan')
    assignments = db.relationship('Assignment', backref='teacher', cascade='all, delete-orphan')
    doubt_rooms = db.relationship('DoubtRoom', backref='teacher')
    
    def __repr__(self):
        return f'<Teacher {self.user.username}>'

class Parent(db.Model):
    """Parent/Guardian profile"""
    __tablename__ = 'parents'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), unique=True, nullable=False)
    phone = db.Column(db.String(20))
    occupation = db.Column(db.String(255))
    relationship_to_student = db.Column(db.String(50))  # Father, Mother, Guardian
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    students = db.relationship('Student', backref='parent_obj')
    
    def __repr__(self):
        return f'<Parent {self.user.username}>'

class Quiz(db.Model):
    """Quiz/Test model"""
    __tablename__ = 'quizzes'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    teacher_id = db.Column(db.String(36), db.ForeignKey('teachers.id'), nullable=False)
    section_id = db.Column(db.String(36), db.ForeignKey('sections.id'))
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    subject = db.Column(db.String(100))
    difficulty_level = db.Column(db.String(20), default='medium')  # easy, medium, hard
    total_points = db.Column(db.Integer, default=100)
    duration_minutes = db.Column(db.Integer)
    passing_score = db.Column(db.Integer, default=40)
    is_published = db.Column(db.Boolean, default=False)
    allow_retake = db.Column(db.Boolean, default=True)
    max_retakes = db.Column(db.Integer, default=3)
    show_answers_after = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    questions = db.relationship('Question', backref='quiz', cascade='all, delete-orphan')
    attempts = db.relationship('QuizAttempt', backref='quiz', cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<Quiz {self.title}>'

class Question(db.Model):
    """Quiz question model"""
    __tablename__ = 'questions'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    quiz_id = db.Column(db.String(36), db.ForeignKey('quizzes.id'), nullable=False)
    question_type = db.Column(db.String(20))  # mcq, multiple_select, coding, descriptive
    question_text = db.Column(db.Text, nullable=False)
    question_image = db.Column(db.String(255))
    points = db.Column(db.Integer, default=1)
    order = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    options = db.relationship('QuestionOption', backref='question', cascade='all, delete-orphan')
    answers = db.relationship('StudentAnswer', backref='question', cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<Question {self.id}>'

class QuestionOption(db.Model):
    """Multiple choice options"""
    __tablename__ = 'question_options'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    question_id = db.Column(db.String(36), db.ForeignKey('questions.id'), nullable=False)
    option_text = db.Column(db.Text, nullable=False)
    option_image = db.Column(db.String(255))
    is_correct = db.Column(db.Boolean, default=False)
    order = db.Column(db.Integer)
    explanation = db.Column(db.Text)
    
    def __repr__(self):
        return f'<QuestionOption {self.id}>'

class QuizAttempt(db.Model):
    """Student's quiz attempt record"""
    __tablename__ = 'quiz_attempts'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    quiz_id = db.Column(db.String(36), db.ForeignKey('quizzes.id'), nullable=False)
    student_id = db.Column(db.String(36), db.ForeignKey('students.id'), nullable=False)
    attempt_number = db.Column(db.Integer, default=1)
    score = db.Column(db.Integer)
    total_points = db.Column(db.Integer)
    percentage = db.Column(db.Float)
    status = db.Column(db.String(20), default='in_progress')  # in_progress, completed, submitted
    started_at = db.Column(db.DateTime, default=datetime.utcnow)
    completed_at = db.Column(db.DateTime)
    time_taken_minutes = db.Column(db.Integer)
    
    # Relationships
    answers = db.relationship('StudentAnswer', backref='attempt', cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<QuizAttempt quiz={self.quiz_id} student={self.student_id}>'

class StudentAnswer(db.Model):
    """Student's answer to a question"""
    __tablename__ = 'student_answers'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    attempt_id = db.Column(db.String(36), db.ForeignKey('quiz_attempts.id'), nullable=False)
    question_id = db.Column(db.String(36), db.ForeignKey('questions.id'), nullable=False)
    selected_option_id = db.Column(db.String(36), db.ForeignKey('question_options.id'))
    answer_text = db.Column(db.Text)  # For descriptive/coding answers
    points_earned = db.Column(db.Integer, default=0)
    is_correct = db.Column(db.Boolean)
    ai_feedback = db.Column(db.Text)
    answered_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<StudentAnswer question={self.question_id}>'

class Assignment(db.Model):
    """Assignment/Homework model"""
    __tablename__ = 'assignments'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    teacher_id = db.Column(db.String(36), db.ForeignKey('teachers.id'), nullable=False)
    section_id = db.Column(db.String(36), db.ForeignKey('sections.id'))
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    subject = db.Column(db.String(100))
    assignment_type = db.Column(db.String(50))  # essay, coding, project, presentation
    max_points = db.Column(db.Integer, default=100)
    due_date = db.Column(db.DateTime, nullable=False)
    instructions = db.Column(db.Text)
    rubric = db.Column(db.JSON)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    submissions = db.relationship('Submission', backref='assignment', cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<Assignment {self.title}>'

class Submission(db.Model):
    """Student assignment submission"""
    __tablename__ = 'submissions'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    assignment_id = db.Column(db.String(36), db.ForeignKey('assignments.id'), nullable=False)
    student_id = db.Column(db.String(36), db.ForeignKey('students.id'), nullable=False)
    file_path = db.Column(db.String(255))
    submission_text = db.Column(db.Text)
    status = db.Column(db.String(20), default='draft')  # draft, submitted, graded, returned
    submission_date = db.Column(db.DateTime, default=datetime.utcnow)
    grade = db.Column(db.Integer)
    ai_feedback = db.Column(db.Text)
    teacher_feedback = db.Column(db.Text)
    graded_by = db.Column(db.String(36), db.ForeignKey('users.id'))
    graded_date = db.Column(db.DateTime)
    
    def __repr__(self):
        return f'<Submission assignment={self.assignment_id} student={self.student_id}>'

class DoubtRoom(db.Model):
    """Temporary doubt/discussion room"""
    __tablename__ = 'doubt_rooms'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    creator_student_id = db.Column(db.String(36), db.ForeignKey('students.id'), nullable=False)
    teacher_id = db.Column(db.String(36), db.ForeignKey('teachers.id'))
    topic = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    status = db.Column(db.String(20), default='active')  # active, resolved, closed
    expiry_time = db.Column(db.DateTime, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    closed_at = db.Column(db.DateTime)
    
    # Relationships
    messages = db.relationship('DoubtMessage', backref='room', cascade='all, delete-orphan')
    members = db.relationship('Student', secondary='doubt_room_members', backref='doubt_rooms_created')
    
    def __repr__(self):
        return f'<DoubtRoom {self.topic}>'

class DoubtMessage(db.Model):
    """Messages in doubt room"""
    __tablename__ = 'doubt_messages'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    room_id = db.Column(db.String(36), db.ForeignKey('doubt_rooms.id'), nullable=False)
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    message_type = db.Column(db.String(20), default='text')  # text, ai_response, code
    message_text = db.Column(db.Text, nullable=False)
    is_best_answer = db.Column(db.Boolean, default=False)
    votes = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationship
    user = db.relationship('User', backref='doubt_messages')
    
    def __repr__(self):
        return f'<DoubtMessage room={self.room_id}>'

# Association table for doubt room members
doubt_room_members = db.Table(
    'doubt_room_members',
    db.Column('room_id', db.String(36), db.ForeignKey('doubt_rooms.id'), primary_key=True),
    db.Column('student_id', db.String(36), db.ForeignKey('students.id'), primary_key=True)
)

class Performance(db.Model):
    """Student performance tracking"""
    __tablename__ = 'performances'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    student_id = db.Column(db.String(36), db.ForeignKey('students.id'), nullable=False)
    subject = db.Column(db.String(100))
    quiz_average = db.Column(db.Float)
    assignment_average = db.Column(db.Float)
    overall_score = db.Column(db.Float)
    weak_concepts = db.Column(db.JSON)  # List of weak areas
    strong_concepts = db.Column(db.JSON)  # List of strong areas
    improvement_suggestions = db.Column(db.JSON)
    total_learning_hours = db.Column(db.Float, default=0)
    learning_streak = db.Column(db.Integer, default=0)
    last_updated = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<Performance student={self.student_id}>'
