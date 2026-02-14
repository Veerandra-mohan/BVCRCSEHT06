# GyanGuru 2.0 - Quick Start Guide

## ⚡ 5-Minute Setup

### Backend Setup

```bash
# 1. Navigate to backend
cd BVCRCSEHT06-main/back

# 2. Create virtual environment
python -m venv venv

# 3. Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Configure environment
cp .env.example .env
# Edit .env and add:
# - GEMINI_API_KEY (from Google Cloud)
# - DATABASE_URL (optional, uses SQLite by default)

# 6. Run application
python app.py
# Server starts on http://localhost:5000
```

### Frontend Setup

```bash
# 1. Navigate to frontend
cd front

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
# Server starts on http://localhost:3000

# 4. Build for production
npm run build
```

---

## 🧪 Test the API

### 1. Register a Student
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "username": "student1",
    "password": "SecurePassword123",
    "first_name": "John",
    "last_name": "Doe",
    "role": "student"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "SecurePassword123"
  }'
```

Copy the `access_token` from response.

### 3. Upload Essay for Analysis
```bash
curl -X POST http://localhost:5000/api/upload/essay \
  -H "Authorization: Bearer <access_token>" \
  -F "file=@essay.pdf" \
  -F "mode=student"
```

### 4. Get Word Definition
```bash
curl -X POST http://localhost:5000/api/upload/word-definition \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "word": "photosynthesis",
    "context": "Plants perform photosynthesis"
  }'
```

### 5. Health Check
```bash
curl http://localhost:5000/api/health
```

---

## 📁 Project Structure Overview

```
BVCRCSEHT06-main/
│
├── back/                          # Backend (Flask)
│   ├── app/
│   │   ├── blueprints/           # API Routes
│   │   ├── models/               # Database Models
│   │   ├── services/             # Business Logic
│   │   └── utils/                # Utilities
│   ├── uploads/                  # File Storage
│   ├── app.py                    # Entry Point
│   ├── config.py                 # Configuration
│   └── requirements.txt          # Dependencies
│
├── front/                         # Frontend (React)
│   ├── src/
│   │   ├── pages/                # Page Components
│   │   ├── components/           # Reusable Components
│   │   └── services/             # API Integration
│   ├── index.html
│   └── package.json
│
├── README.md                     # Project Overview
├── API_DOCUMENTATION.md          # API Reference
├── IMPLEMENTATION_GUIDE.md       # Development Guide
└── ARCHITECTURE.md               # System Architecture
```

---

## 🔑 Key Features to Try

### 1. Essay Analysis
- Upload an essay (PDF/DOCX/TXT)
- Get AI-powered feedback
- Grammar, structure, tone analysis
- Grade prediction

### 2. Code Analysis
- Upload a Python file
- Get bug detection
- Error explanation
- Code improvement suggestions

### 3. Mini Explainer (Frontend)
- Select any text
- Click to get definition
- Pronunciation support
- Example usage

### 4. Quiz System
- Take available quizzes
- Auto-grading
- Review answers
- Retake if allowed

### 5. Doubt Room
- Create a discussion room
- Invite peers & teachers
- Voting system
- AI responses

### 6. Analytics
- View your performance
- Track progress
- See weak concepts
- Get recommendations

---

## 🛠️ Common Issues & Solutions

### Issue: ModuleNotFoundError
**Solution**: Make sure virtual environment is activated and all dependencies are installed
```bash
pip install -r requirements.txt
```

### Issue: GEMINI_API_KEY not found
**Solution**: Add your API key to .env file
```bash
GEMINI_API_KEY=your-key-here
```

### Issue: Port already in use
**Solution**: Change port in config.py or kill existing process
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux
lsof -i :5000
kill -9 <PID>
```

### Issue: Database not found
**Solution**: Create tables automatically by running app
```bash
python app.py
# With Flask app context, tables will be created
```

---

## 📊 API Base URLs

| Component | URL |
|-----------|-----|
| Backend API | http://localhost:5000/api |
| Frontend App | http://localhost:3000 |
| Health Check | http://localhost:5000/api/health |

---

## 🚀 Useful Commands

### Backend
```bash
# Run server
python app.py

# Run with Gunicorn (production)
gunicorn -w 4 -b 0.0.0.0:5000 app:app

# Database shell
python app.py shell

# Run tests (when available)
pytest
```

### Frontend
```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview build
npm run preview

# Run tests (when available)
npm test
```

---

## 📚 Documentation

- **API Documentation**: See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- **Architecture**: See [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Implementation**: See [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)

---

## 🔐 Default Test Credentials

Since this is a new installation, create test users:

```bash
# Create via API (see Test the API section above)
Email: student@example.com
Password: SecurePassword123
Role: student
```

---

## 📝 Environment Variables

Required for `.env` file:

```env
# Required
GEMINI_API_KEY=your-gemini-api-key

# Optional (defaults provided)
FLASK_ENV=development
SECRET_KEY=dev-secret-key
JWT_SECRET_KEY=jwt-secret-key
DATABASE_URL=sqlite:///gyanguru.db
UPLOAD_FOLDER=./uploads
```

---

## 🎯 Next Steps

1. ✅ Backend is ready to use
2. 🔄 Build frontend components (React)
3. 🔗 Connect frontend to backend API
4. 🧪 Run comprehensive tests
5. 🚀 Deploy to production

---

## 📞 Support

If you encounter issues:

1. Check documentation files
2. Review API responses
3. Check console logs
4. Verify configuration
5. Check Flask/npm error messages

---

**Happy Coding! 🎉**

Version 2.0.0 | Last Updated: February 14, 2026
