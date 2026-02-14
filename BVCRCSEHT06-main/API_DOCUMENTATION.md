# GyanGuru 2.0 - Complete API Documentation

**Base URL**: `http://localhost:5000/api`

---

## 🔐 Authentication API

### Register User
**Endpoint**: `POST /auth/register`

**Request**:
```json
{
  "email": "user@example.com",
  "username": "username",
  "password": "SecurePassword123",
  "first_name": "John",
  "last_name": "Doe",
  "role": "student",
  "institution_id": "inst-123",
  "roll_number": "2024001"
}
```

**Response** (201):
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "username": "username",
    "role": "student"
  }
}
```

**Validation Rules**:
- Email must be valid format
- Password ≥ 8 characters, 1 uppercase, 1 digit
- Role must be: student, teacher, parent, admin
- Email & username must be unique

---

### Login
**Endpoint**: `POST /auth/login`

**Request**:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

**Response** (200):
```json
{
  "message": "Login successful",
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc...",
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "username": "username",
    "first_name": "John",
    "last_name": "Doe",
    "role": "student"
  }
}
```

---

### Refresh Token
**Endpoint**: `POST /auth/refresh`

**Headers**:
```
Authorization: Bearer <refresh_token>
```

**Response** (200):
```json
{
  "access_token": "eyJhbGc..."
}
```

---

### Get Profile
**Endpoint**: `GET /auth/profile`

**Headers**:
```
Authorization: Bearer <access_token>
```

**Response** (200):
```json
{
  "id": "user-123",
  "email": "user@example.com",
  "username": "username",
  "first_name": "John",
  "last_name": "Doe",
  "role": "student",
  "created_at": "2026-02-14T10:00:00Z"
}
```

---

### Update Profile
**Endpoint**: `PUT /auth/profile`

**Headers**:
```
Authorization: Bearer <access_token>
```

**Request**:
```json
{
  "first_name": "Jonathan",
  "last_name": "Smith",
  "profile_picture": "https://..."
}
```

**Response** (200):
```json
{
  "message": "Profile updated successfully"
}
```

---

## 📤 Upload & Analysis API

### Upload Essay
**Endpoint**: `POST /upload/essay`

**Headers**:
```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Form Data**:
- `file`: PDF/DOCX/TXT file (required)
- `mode`: student|teacher|parent (optional, default: student)

**Response** (200):
```json
{
  "message": "Essay analyzed successfully",
  "analysis": {
    "grammar_errors": [
      {
        "error": "Subject-verb agreement",
        "correction": "...",
        "line": 2
      }
    ],
    "structure_feedback": "...",
    "clarity_feedback": "...",
    "tone_analysis": "...",
    "estimated_grade": 85,
    "recommendations": [...]
  },
  "file_path": "./uploads/essay_123.pdf"
}
```

---

### Upload Code
**Endpoint**: `POST /upload/code`

**Headers**:
```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Form Data**:
- `file`: Python file (.py)

**Response** (200):
```json
{
  "message": "Code analyzed successfully",
  "analysis": {
    "syntax_errors": [...],
    "logic_bugs": [
      {
        "line": 15,
        "issue": "Off-by-one error",
        "explanation": "..."
      }
    ],
    "performance_issues": [...],
    "security_concerns": [...],
    "style_improvements": [...],
    "refactoring": "...",
    "corrected_code": "...",
    "explanations": {...}
  },
  "file_path": "./uploads/code_123.py"
}
```

---

### Upload Audio
**Endpoint**: `POST /upload/audio`

**Headers**:
```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Form Data**:
- `file`: MP3/WAV/M4A file

**Response** (200):
```json
{
  "message": "Audio analyzed successfully",
  "transcription": "Hello, this is a test of speech recognition...",
  "analysis": {
    "clarity": 8.5,
    "grammar": {
      "issues": [],
      "score": 95
    },
    "pronunciation": "Good",
    "effectiveness": "Clear communication",
    "suggestions": [
      "Speak more slowly for clarity"
    ],
    "confidence": 0.92
  },
  "file_path": "./uploads/audio_123.mp3"
}
```

---

### Upload Image
**Endpoint**: `POST /upload/image`

**Headers**:
```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Form Data**:
- `file`: JPG/PNG/GIF image

**Response** (200):
```json
{
  "message": "Image analyzed successfully",
  "extracted_text": "Extracted text from image...",
  "analysis": {
    "description": "Handwritten notes about photosynthesis",
    "concepts": ["photosynthesis", "chlorophyll", "energy conversion"],
    "misconceptions": [
      {
        "incorrect": "...",
        "correct": "..."
      }
    ],
    "educational_value": "High",
    "explanations": {...}
  },
  "file_path": "./uploads/image_123.jpg"
}
```

---

### PDF Intelligent Read
**Endpoint**: `POST /upload/pdf/read`

**Headers**:
```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Form Data**:
- `file`: PDF file

**Response** (200):
```json
{
  "message": "PDF loaded successfully",
  "pdf_data": {
    "total_pages": 25,
    "pages": [
      {
        "page_number": 1,
        "text": "Page content...",
        "word_count": 450
      }
    ],
    "file_path": "./uploads/pdf_123.pdf"
  }
}
```

**Frontend Usage**:
- User selects text
- Click for definition
- Drag text for explanation
- Hover for pronunciation

---

### Word Definition
**Endpoint**: `POST /upload/word-definition`

**Headers**:
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request**:
```json
{
  "word": "photosynthesis",
  "context": "Plants use photosynthesis to convert light into energy"
}
```

**Response** (200):
```json
{
  "word": "photosynthesis",
  "definition": "The process by which plants...",
  "part_of_speech": "noun",
  "pronunciation": "fō-tō-'sin-thə-səs",
  "examples": [
    "Photosynthesis is essential for plant growth",
    "Algae also perform photosynthesis"
  ],
  "synonyms": ["carbon fixation"],
  "etymology": "From Greek 'photo' (light) + 'synthesis' (putting together)"
}
```

---

### Submit Assignment
**Endpoint**: `POST /upload/submission/<assignment_id>`

**Headers**:
```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Form Data**:
- `file`: Assignment file (optional)
- `text`: Submission text (optional)

**Response** (201):
```json
{
  "message": "Assignment submitted successfully",
  "submission_id": "sub-123",
  "ai_feedback": {
    "grammar_errors": [...],
    "structure_feedback": "...",
    "estimated_grade": 78,
    "recommendations": [...]
  }
}
```

---

## 🎯 Quiz API

### Get Quizzes
**Endpoint**: `GET /quiz`

**Headers**:
```
Authorization: Bearer <access_token>
```

**Query Parameters**:
- `subject`: Filter by subject (optional)
- `difficulty`: easy|medium|hard (optional)

**Response** (200):
```json
[
  {
    "id": "quiz-123",
    "title": "Introduction to Python",
    "description": "Basic Python concepts",
    "subject": "Programming",
    "difficulty": "easy",
    "total_points": 100,
    "duration": 60
  }
]
```

---

### Get Quiz Details
**Endpoint**: `GET /quiz/<quiz_id>`

**Headers**:
```
Authorization: Bearer <access_token>
```

**Response** (200):
```json
{
  "id": "quiz-123",
  "title": "Introduction to Python",
  "description": "...",
  "questions": [
    {
      "id": "q-1",
      "type": "mcq",
      "text": "What is a variable?",
      "points": 5,
      "options": [
        {"id": "opt-1", "text": "Option A"},
        {"id": "opt-2", "text": "Option B"}
      ]
    }
  ]
}
```

---

### Start Quiz Attempt
**Endpoint**: `POST /quiz/<quiz_id>/attempt`

**Headers**:
```
Authorization: Bearer <access_token>
```

**Response** (201):
```json
{
  "attempt_id": "attempt-123",
  "attempt_number": 1,
  "quiz_id": "quiz-123"
}
```

---

### Submit Quiz
**Endpoint**: `POST /quiz/attempt/<attempt_id>/submit`

**Headers**:
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request**:
```json
{
  "answers": [
    {
      "question_id": "q-1",
      "option_id": "opt-2",
      "text": null
    },
    {
      "question_id": "q-2",
      "option_id": null,
      "text": "My answer to descriptive question"
    }
  ]
}
```

**Response** (200):
```json
{
  "message": "Quiz submitted successfully",
  "score": 85,
  "total": 100,
  "percentage": 85.0,
  "feedback": {...}
}
```

---

### Get Attempt History
**Endpoint**: `GET /quiz/attempts/<student_id>`

**Headers**:
```
Authorization: Bearer <access_token>
```

**Response** (200):
```json
[
  {
    "id": "attempt-123",
    "quiz_title": "Python Basics",
    "attempt_number": 1,
    "score": 85,
    "percentage": 85.0,
    "completed_at": "2026-02-14T10:30:00Z"
  }
]
```

---

## 💬 Doubt Room API

### Create Doubt Room
**Endpoint**: `POST /doubt`

**Headers**:
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request**:
```json
{
  "topic": "How to use loops in Python?",
  "description": "I don't understand the for loop syntax",
  "expiry_hours": 2
}
```

**Response** (201):
```json
{
  "message": "Doubt room created",
  "room_id": "room-123",
  "expiry_time": "2026-02-14T14:00:00Z"
}
```

---

### Get Doubt Room
**Endpoint**: `GET /doubt/<room_id>`

**Headers**:
```
Authorization: Bearer <access_token>
```

**Response** (200):
```json
{
  "id": "room-123",
  "topic": "How to use loops in Python?",
  "description": "...",
  "status": "active",
  "created_at": "2026-02-14T12:00:00Z",
  "expiry_time": "2026-02-14T14:00:00Z",
  "messages": [
    {
      "id": "msg-1",
      "user": "john_doe",
      "message": "I can help with this...",
      "is_best_answer": true,
      "votes": 5,
      "created_at": "2026-02-14T12:05:00Z"
    }
  ]
}
```

---

### Add Message
**Endpoint**: `POST /doubt/<room_id>/message`

**Headers**:
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request**:
```json
{
  "message": "Here's how loops work in Python...",
  "type": "text"
}
```

**Response** (201):
```json
{
  "message_id": "msg-2",
  "created_at": "2026-02-14T12:10:00Z"
}
```

---

### Vote on Message
**Endpoint**: `POST /doubt/<room_id>/message/<message_id>/vote`

**Headers**:
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request**:
```json
{
  "vote_type": "up"
}
```

**Response** (200):
```json
{
  "message": "Vote recorded",
  "votes": 6
}
```

---

### Escalate to Teacher
**Endpoint**: `POST /doubt/<room_id>/escalate`

**Headers**:
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request**:
```json
{
  "teacher_id": "teacher-123"
}
```

**Response** (200):
```json
{
  "message": "Escalated to teacher"
}
```

---

## 📊 Analytics API

### Student Dashboard
**Endpoint**: `GET /analytics/student/dashboard`

**Headers**:
```
Authorization: Bearer <access_token>
```

**Response** (200):
```json
{
  "student_name": "John Doe",
  "quiz_average": 82.5,
  "assignment_average": 78.0,
  "overall_score": 80.25,
  "total_quizzes_taken": 5,
  "total_assignments_submitted": 3,
  "weak_concepts": ["Recursion", "File I/O"],
  "strong_concepts": ["Loops", "Conditionals"],
  "improvement_suggestions": [
    "Practice recursion with simple examples",
    "Review file handling operations"
  ],
  "learning_streak": 7
}
```

---

### Class Analytics
**Endpoint**: `GET /analytics/teacher/class-analytics/<section_id>`

**Headers**:
```
Authorization: Bearer <access_token>
```

**Response** (200):
```json
{
  "section": "A",
  "total_students": 30,
  "class_average": 75.5,
  "students": [
    {
      "student_name": "John Doe",
      "roll_number": "2024001",
      "avg_quiz_score": 82.5,
      "avg_assignment_score": 78.0,
      "overall_score": 80.25,
      "quizzes_taken": 5,
      "assignments_submitted": 3
    }
  ]
}
```

---

### Parent Child Progress
**Endpoint**: `GET /analytics/parent/child-progress/<student_id>`

**Headers**:
```
Authorization: Bearer <access_token>
```

**Response** (200):
```json
{
  "student_name": "John Doe",
  "roll_number": "2024001",
  "overall_performance": 80.25,
  "strengths": ["Loops", "Conditionals", "Functions"],
  "weaknesses": ["Recursion", "File I/O"],
  "suggestions": [
    "Practice recursion with simple examples",
    "Work on file handling skills"
  ],
  "quiz_score_trend": [
    {"quiz_num": 1, "score": 75},
    {"quiz_num": 2, "score": 80},
    {"quiz_num": 3, "score": 82}
  ],
  "recent_assignments": [
    {
      "title": "Python Basics Assignment",
      "grade": 78,
      "feedback": "Good work on loops..."
    }
  ]
}
```

---

## 🔧 Admin API

### List Institutions
**Endpoint**: `GET /admin/institutions`

**Headers**:
```
Authorization: Bearer <admin_token>
```

**Response** (200):
```json
[
  {
    "id": "inst-1",
    "name": "BVCRCSEHT06",
    "code": "BVC06",
    "email": "admin@bvc.edu"
  }
]
```

---

### Create Institution
**Endpoint**: `POST /admin/institutions`

**Headers**:
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Request**:
```json
{
  "name": "New College",
  "code": "NC01",
  "address": "Address",
  "email": "admin@college.edu"
}
```

**Response** (201):
```json
{
  "message": "Institution created",
  "id": "inst-2"
}
```

---

### System Statistics
**Endpoint**: `GET /admin/stats`

**Headers**:
```
Authorization: Bearer <admin_token>
```

**Response** (200):
```json
{
  "total_users": 150,
  "total_students": 100,
  "total_teachers": 40,
  "total_institutions": 5
}
```

---

## ❌ Error Responses

### 400 Bad Request
```json
{
  "error": "Missing required fields"
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid credentials"
}
```

### 403 Forbidden
```json
{
  "error": "Access denied. Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "An error occurred while processing your request"
}
```

---

## 📋 Authentication Headers

All protected endpoints require:
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Token Expiration**: 1 hour
**Refresh Token Expiration**: 30 days

---

**API Version**: 1.0
**Last Updated**: February 14, 2026
