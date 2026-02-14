# GyanGuru 2.0 - AI-Powered Multi-Modal Learning Ecosystem

## 🎯 Overview

GyanGuru 2.0 is an advanced AI-driven educational platform that combines:
- **AI-powered content analysis** (Essays, Code, Audio, Images)
- **Role-based access control** (Student, Teacher, Parent, Admin)
- **Hybrid learning system** (AI + Human collaboration)
- **Performance analytics** (Personalized insights & recommendations)
- **Interactive quiz system** (Auto-evaluation & retakes)

## 📋 Features

### 1. Media Upload & AI Analysis
- **Essay Analysis**: Grammar, structure, tone, feedback modes (student/teacher/parent)
- **Code Analysis**: Bug detection, optimization, error explanation
- **Audio Analysis**: Speech-to-text, pronunciation feedback, communication assessment
- **Image Analysis**: OCR, handwritten note extraction, content analysis
- **PDF Reading**: Intelligent text selection, word definitions, pronunciation

### 2. Role-Based Ecosystem

#### Student Features
- Submit assignments & essays
- Receive AI feedback
- Attempt quizzes with retake options
- Create temporary doubt rooms
- View performance analytics
- Track learning streaks

#### Teacher Features
- Create & publish quizzes
- Grade assignments
- Create temporary doubt sessions
- Monitor class analytics
- Manage section performance
- Override AI grading

#### Parent Features
- Monitor child performance
- View strengths & weaknesses
- Receive learning summaries
- Get improvement suggestions
- Track progress over time

#### Admin Features
- Manage institutions & departments
- User activation/deactivation
- System statistics
- Access control management

### 3. Doubt Room System
- Temporary discussion rooms with expiration
- Peer voting & community feedback
- Teacher escalation option
- Hybrid AI + human responses
- "Best answer" marking system

### 4. Quiz & Learning System
- MCQ (Multiple Choice)
- Coding challenges
- Descriptive answers
- Auto-evaluation
- Difficulty scaling
- Retake mechanism with limits

### 5. Analytics Engine
- Student performance dashboard
- Teacher class insights
- Parent child progress tracking
- Weak concept detection
- Leaderboards
- Learning behavior analysis

## 🏗️ Architecture

```
GyanGuru 2.0/
├── back/                    # Flask Backend
│   ├── app/
│   │   ├── blueprints/     # API Endpoints
│   │   │   ├── auth.py
│   │   │   ├── upload.py
│   │   │   ├── quiz.py
│   │   │   ├── doubt_room.py
│   │   │   ├── analytics.py
│   │   │   └── admin.py
│   │   ├── models/         # Database Models
│   │   │   └── __init__.py (All Models)
│   │   ├── services/       # Business Logic
│   │   │   ├── ai_service.py
│   │   │   └── file_processor.py
│   │   ├── utils/          # Utilities
│   │   │   └── decorators.py
│   │   ├── middleware/     # Middleware
│   │   └── __init__.py
│   ├── uploads/            # File Storage
│   ├── logs/               # Application Logs
│   ├── app.py              # Entry Point
│   ├── config.py           # Configuration
│   ├── requirements.txt    # Dependencies
│   └── .env.example        # Environment Template
│
└── front/                  # React Frontend
    ├── src/
    │   ├── pages/          # Page Components
    │   ├── components/     # Reusable Components
    │   ├── services/       # API Services
    │   ├── utils/          # Utilities
    │   ├── styles/         # CSS
    │   └── App.tsx
    └── public/
```

## 🗄️ Database Schema

### Core Tables
- **users**: Authentication & base user data
- **students, teachers, parents**: Role-specific profiles
- **institutions, departments, years, sections**: Academic hierarchy

### Academic Tables
- **quizzes, questions, question_options**: Quiz management
- **quiz_attempts, student_answers**: Student performance
- **assignments, submissions**: Assignment management

### Interaction Tables
- **doubt_rooms, doubt_messages**: Discussion forums
- **performances**: Student metrics

## 🔐 Security Features

- **JWT Authentication**: Token-based access
- **Role-Based Access Control (RBAC)**: Fine-grained permissions
- **Input Validation**: File type & size checks
- **Password Hashing**: Secure password storage
- **CORS Protection**: Cross-origin request handling
- **OWASP Compliance**: Security best practices

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/register       - Register new user
POST   /api/auth/login          - User login
POST   /api/auth/refresh        - Refresh token
GET    /api/auth/profile        - Get user profile
PUT    /api/auth/profile        - Update profile
POST   /api/auth/logout         - Logout
```

### Upload & Analysis
```
POST   /api/upload/essay         - Upload & analyze essay
POST   /api/upload/code          - Upload & analyze code
POST   /api/upload/audio         - Upload & analyze audio
POST   /api/upload/image         - Upload & analyze image
POST   /api/upload/pdf/read      - Upload PDF for intelligent reading
POST   /api/upload/word-definition - Get word definition
POST   /api/upload/submission/<id> - Submit assignment
```

### Quiz
```
GET    /api/quiz                 - Get available quizzes
GET    /api/quiz/<id>            - Get quiz details
POST   /api/quiz/<id>/attempt    - Start quiz attempt
POST   /api/quiz/attempt/<id>/submit - Submit answers
GET    /api/quiz/attempts/<student_id> - Get attempt history
```

### Doubt Rooms
```
POST   /api/doubt                - Create doubt room
GET    /api/doubt/<id>           - Get room details
POST   /api/doubt/<id>/message   - Add message
POST   /api/doubt/<id>/message/<msg_id>/vote - Vote message
POST   /api/doubt/<id>/escalate  - Escalate to teacher
GET    /api/doubt/open           - Get open rooms
```

### Analytics
```
GET    /api/analytics/student/dashboard - Student dashboard
GET    /api/analytics/teacher/class-analytics/<section_id> - Class analytics
GET    /api/analytics/parent/child-progress/<student_id> - Parent view
GET    /api/analytics/weak-concepts/<student_id> - Weak areas
GET    /api/analytics/leaderboard/<section_id> - Class leaderboard
```

### Admin
```
GET    /api/admin/institutions   - List institutions
POST   /api/admin/institutions   - Create institution
POST   /api/admin/departments/<inst_id> - Create department
PUT    /api/admin/users/<id>/activate - Activate user
GET    /api/admin/stats          - System statistics
```

## ⚙️ Setup & Installation

### Backend Setup

1. **Clone Repository**
```bash
git clone <repo-url>
cd BVCRCSEHT06-main/back
```

2. **Create Virtual Environment**
```bash
python -m venv venv
source venv/Scripts/activate  # Windows
source venv/bin/activate      # Linux/Mac
```

3. **Install Dependencies**
```bash
pip install -r requirements.txt
```

4. **Configure Environment**
```bash
cp .env.example .env
# Edit .env with your settings:
# - GEMINI_API_KEY
# - DATABASE_URL
# - JWT_SECRET_KEY
```

5. **Initialize Database**
```bash
python app.py
# Database tables will be created automatically
```

6. **Run Application**
```bash
python app.py
# Server runs on http://localhost:5000
```

### Frontend Setup

1. **Install Dependencies**
```bash
cd ../front
npm install
```

2. **Start Development Server**
```bash
npm run dev
# Server runs on http://localhost:3000
```

3. **Build for Production**
```bash
npm run build
```

## 📊 User Workflows

### Student Workflow
1. Register/Login
2. Upload assignment or essay
3. Receive AI feedback
4. Review feedback and iterate
5. Attempt quiz
6. View performance analytics
7. Create doubt room for help
8. Request teacher assistance

### Teacher Workflow
1. Login to dashboard
2. Create quiz with questions
3. Publish quiz to section
4. Review student submissions
5. Grade assignments
6. Provide feedback
7. View class analytics
8. Monitor doubt rooms
9. Track student progress

### Parent Workflow
1. Login to parent portal
2. View child's performance summary
3. Check strengths and weaknesses
4. Read AI-generated insights
5. Track improvement over time
6. Receive alerts for low performance
7. View learning recommendations

## 🧪 Testing

### Test Student Workflow
```bash
# Register student
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"student@example.com",
    "username":"student1",
    "password":"Password123",
    "first_name":"John",
    "last_name":"Doe",
    "role":"student"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"student@example.com",
    "password":"Password123"
  }'
```

## 🚀 Deployment

### Using Gunicorn
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Using Docker
```bash
docker build -t gyanguru-backend .
docker run -p 5000:5000 gyanguru-backend
```

## 📚 Technologies Used

### Backend
- **Flask**: Web framework
- **SQLAlchemy**: ORM
- **Flask-JWT-Extended**: Authentication
- **Google Gemini 2.0**: AI analysis
- **PyPDF2**: PDF processing
- **pytesseract**: OCR
- **librosa**: Audio processing

### Frontend
- **React 19.1**: UI framework
- **Vite**: Build tool
- **React DOM**: Component rendering
- **TypeScript**: Type safety

### Database
- **PostgreSQL** (production) / **SQLite** (development)

## 📝 Environment Variables

```env
# Flask Configuration
FLASK_APP=app.py
FLASK_ENV=development
SECRET_KEY=your-secret-key-here
DEBUG=True

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/gyanguru_db

# JWT
JWT_SECRET_KEY=your-jwt-secret-key

# Google Gemini API
GEMINI_API_KEY=your-gemini-api-key-here

# File Upload
UPLOAD_FOLDER=./uploads
MAX_CONTENT_LENGTH=104857600
ALLOWED_EXTENSIONS=pdf,docx,txt,mp3,wav,jpg,jpeg,png,py,csv
```

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 🎓 Project Information

**Institution**: BVCRCSEHT06
**Project Type**: Final Year Major Project / Hackathon
**Status**: Development

---

**Last Updated**: February 14, 2026
**Version**: 2.0.0
