# Blueprint module initialization
from app.blueprints.auth import auth_bp
from app.blueprints.upload import upload_bp
from app.blueprints.quiz import quiz_bp
from app.blueprints.doubt_room import doubt_bp
from app.blueprints.analytics import analytics_bp
from app.blueprints.admin import admin_bp

__all__ = ['auth_bp', 'upload_bp', 'quiz_bp', 'doubt_bp', 'analytics_bp', 'admin_bp']
