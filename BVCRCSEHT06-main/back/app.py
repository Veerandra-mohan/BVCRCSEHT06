import os
from app import create_app, db
from app.models import (
    User, Student, Teacher, Parent, Institution, 
    Department, Year, Section, Quiz, Question,
    Assignment, Submission, DoubtRoom, Performance
)

# Create application
app = create_app(os.getenv('FLASK_ENV', 'development'))

@app.shell_context_processor
def make_shell_context():
    """Create application context for Flask shell"""
    return {
        'db': db,
        'User': User,
        'Student': Student,
        'Teacher': Teacher,
        'Parent': Parent,
        'Institution': Institution,
        'Department': Department,
        'Year': Year,
        'Section': Section,
        'Quiz': Quiz,
        'Question': Question,
        'Assignment': Assignment,
        'Submission': Submission,
        'DoubtRoom': DoubtRoom,
        'Performance': Performance
    }

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
