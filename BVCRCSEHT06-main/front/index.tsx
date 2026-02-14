import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI, Type, Chat } from "@google/genai";

// --- Notification System ---
const NotificationContext = createContext(null);

const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const timers = useRef({});

    useEffect(() => {
        // Cleanup timers on unmount
        return () => Object.values(timers.current).forEach(clearTimeout);
    }, []);

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
        if (timers.current[id]) {
            clearTimeout(timers.current[id]);
            delete timers.current[id];
        }
    };
    
    const addNotification = (message, type = 'info') => {
        const id = Date.now() + Math.random();
        setNotifications(prev => [...prev, { id, message, type }]);

        const timer = setTimeout(() => {
            removeNotification(id);
        }, 5000);
        timers.current[id] = timer;
    };


    return (
        <NotificationContext.Provider value={{ addNotification }}>
            {children}
            <NotificationContainer notifications={notifications} removeNotification={removeNotification} />
        </NotificationContext.Provider>
    );
};

const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

const NotificationContainer = ({ notifications, removeNotification }) => {
    const getIcon = (type) => {
        switch (type) {
            case 'warning': return '⚠️';
            case 'info':
            default: return 'ℹ️';
        }
    }
    
    return (
        <div className="notification-container">
            {notifications.map(n => (
                <div key={n.id} className={`toast-notification toast-${n.type}`}>
                    <span className="toast-icon">{getIcon(n.type)}</span>
                    <p className="toast-message">{n.message}</p>
                    <button onClick={() => removeNotification(n.id)} className="toast-close-button">&times;</button>
                </div>
            ))}
        </div>
    );
};

// --- MOCK DATA ---

const mockUsers = {
  student: {
    name: 'Sripadam Veerendra Mohan',
    role: 'Student',
    initials: 'SV'
  },
  teacher: {
    name: 'Dr. Evelyn Reed',
    role: 'Teacher',
    initials: 'ER'
  },
  parent: {
    name: 'Sarah Johnson',
    role: 'Parent',
    initials: 'SJ'
  }
}

const studentData = {
  name: 'Sripadam Veerendra Mohan',
  studyHours: 127,
  lastLogin: '2024-07-28T10:30:00Z',
  courses: [
     {
        id: 1,
        title: "Advanced JavaScript & React",
        description: "Master modern web development with React.",
        instructor: "Dr. Michael Chen",
        duration: "12 weeks",
        progress: 75,
        status: "In Progress",
        lessons: 24,
        completedLessons: 18,
        difficulty: "Advanced",
         modules: [ { id: 'm1', title: 'Module 1', lessons: ['Intro', 'Setup'] } ],
      },
      {
        id: 2,
        title: "UI/UX Design Fundamentals",
        description: "Learn the principles of user-centric design.",
        instructor: "Sarah Williams",
        duration: "8 weeks",
        progress: 100,
        status: "Completed",
        lessons: 16,
        completedLessons: 16,
        difficulty: "Beginner",
        modules: [ { id: 'm1', title: 'Module 1', lessons: ['Intro', 'Figma Basics'] } ],
      },
      {
        id: 3,
        title: "Data Science with Python",
        description: "Unlock insights from data with Python.",
        instructor: "Prof. David Kumar",
        duration: "16 weeks",
        progress: 45,
        status: "In Progress",
        lessons: 32,
        completedLessons: 14,
        difficulty: "Intermediate",
        modules: [ { id: 'm1', title: 'Module 1', lessons: ['Intro', 'Pandas'] } ],
      },
       {
        id: 4,
        title: "Machine Learning Basics",
        description: "Introduction to ML concepts.",
        instructor: "Prof. Williams",
        duration: "10 weeks",
        progress: 40,
        status: "In Progress",
        lessons: 20,
        completedLessons: 8,
        difficulty: "Intermediate",
        modules: [ { id: 'm1', title: 'Module 1', lessons: ['Intro', 'Supervised Learning'] } ],
      },
  ],
  recentActivity: [
    { type: 'Quiz', title: 'Pandas DataFrame Quiz', score: '2/3', date: '2024-07-28' },
    { type: 'Assignment', title: 'Python Data Analysis', grade: 'A-', date: '2024-07-27' },
    { type: 'Course', title: 'UI/UX Design Fundamentals', status: 'Completed', date: '2024-07-26' },
  ]
};

const upcomingDueDate = new Date();
upcomingDueDate.setDate(upcomingDueDate.getDate() + 3);

const studentAssignments = [
    { id: 1, title: 'React Hooks Essay', course: 'Advanced JavaScript & React', status: 'Graded', grade: 'B+', dueDate: '2024-08-10' },
    { id: 2, title: 'Figma Prototyping', course: 'UI/UX Design Fundamentals', status: 'Submitted', dueDate: '2024-08-15' },
    { id: 3, title: 'Pandas Data Cleaning', course: 'Data Science with Python', status: 'Not Submitted', dueDate: upcomingDueDate.toISOString().split('T')[0] },
];

const profileData = {
    name: "Sripadam Veerendra Mohan",
    major: "Computer Science Major • Junior Year",
    role: "Student",
    initials: "SV",
    tags: ["JavaScript", "Python", "Web Development", "Data Science"],
    social: { github: "#", linkedin: "#" },
    stats: {
        completed: 12,
        gpa: 4.2,
        studyHours: 156,
        certificates: 8,
    },
    about: "Passionate computer science student with a strong interest in web development and artificial intelligence. I enjoy building innovative solutions and learning new technologies. Currently focusing on full-stack development and machine learning applications. Always eager to collaborate on exciting projects and contribute to open-source communities.",
    interests: {
        technical: ["AI & ML", "Web Dev", "Mobile Apps", "Cloud Computing"],
        hobbies: ["Gaming", "Reading", "Music", "Running", "Photography"],
        activities: ["Hackathon Participant (3x winner)", "Computer Science Club Member", "Tech Conference Speaker"]
    },
    education: [
        { title: "Bachelor of Science in Computer Science", school: "Stanford University", duration: "2022 - Present", details: "Current GPA: 4.2/4.0 • Junior Year", awards: ["Dean's List", "Honors Program"], type: "university" },
        { title: "High School Diploma", school: "Lincoln High School", duration: "2018 - 2022", details: "GPA: 4.0/4.0 • Valedictorian", awards: ["Valedictorian", "National Honor Society"], type: "school" },
        { title: "Online Certifications", school: "Various Platforms", duration: "2020 - Present", details: ["Full Stack Web Development - freeCodeCamp", "Machine Learning - Coursera (Stanford)", "AWS Cloud Practitioner - Amazon"], type: "certs" }
    ],
    certificatesList: [
        { title: "AWS Cloud Practitioner", issuer: "Amazon Web Services", year: "2024", icon: "🏅" },
        { title: "Full Stack Web Development", issuer: "freeCodeCamp", year: "2023", icon: "📜" },
        { title: "Machine Learning", issuer: "Stanford Online", year: "2023", icon: "🤖" },
        { title: "Cybersecurity Fundamentals", issuer: "Cisco Networking Academy", year: "2023", icon: "🔐" }
    ],
    badges: ["Hackathon Winner", "Top Contributor", "Goal Crusher", "Study Master", "30-Day Streak", "Innovator", "Fast Learner", "Creative Coder", "Rising Star"],
    goals: {
        month: [
            { label: "Complete 3 courses", current: 2, total: 3 },
            { label: "Study 40 hours", current: 32, total: 40 }
        ],
        semester: [
            { label: "Maintain 4.0+ GPA", current: 4.2, total: 4.0 },
            { label: "Earn 5 certificates", current: 3, total: 5 }
        ]
    }
};

const forumArticlesData = [
  { id: 'js-guide', title: 'Complete JavaScript Guide: From Basics to Advanced Concepts', author: 'Sarah Chen', date: '2 days ago', readTime: '15 min read', likes: 245, views: '1.2k', content: 'This is the full content for the JavaScript guide. It covers variables, functions, objects, arrays, and modern ES6+ features like Promises and async/await. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat.', comments: [{author: 'John Doe', text: 'Great article! Very helpful.'}] },
  { id: 'react-patterns', title: 'Advanced React Patterns: Hooks, Context, and Performance Optimization', author: 'Mike Rodriguez', date: '1 day ago', readTime: '22 min read', likes: 387, views: '2.1k', content: 'This article dives deep into advanced React patterns. We will explore how to create powerful custom hooks, optimize context API usage, and leverage memoization techniques for building high-performance React applications. Understanding these patterns is crucial for any serious React developer.', comments: [] },
  { id: 'nodejs-microservices', title: 'Building Scalable Microservices with Node.js and Docker', author: 'Alex Liu', date: '3 days ago', readTime: '28 min read', likes: 512, views: '3.4k', content: 'Microservices architecture is a powerful pattern for building scalable and maintainable applications. In this guide, we will walk through building a microservices-based application using Node.js, Express, and Docker. We cover service discovery, containerization, and communication patterns.', comments: [] },
];

const forumPostsData = [
  { id: 'post1', type: 'Help', tags: ['JavaScript'], title: 'Why is my async function not waiting for the Promise to resolve?', content: "I'm having trouble with async/await in JavaScript. My function returns undefined instead of the expected data. I've tried using .then() but it's not working as expected. Here's my code...", codeSnippet: `async function fetchData() {\n  const response = await fetch(url);\n  const data = response.json(); // Forgot await here!\n  return data;\n}`, author: 'John Doe', authorInitials: 'JD', time: '2 hours ago', answers: 8, views: 156, votes: 42, replies: [{author: 'Jane Smith', authorInitials: 'JS', time:'1h ago', text: 'You forgot to `await` the `response.json()` call. It should be `await response.json()`.'}] },
  { id: 'post2', type: 'Question', tags: ['React'], title: 'Best practices for state management in large React applications?', content: "I'm working on a large React app and struggling with state management. Should I use Redux, Zustand, or stick with Context API? What are the pros and cons of each approach?", author: 'Sarah Miller', authorInitials: 'SM', time: '4 hours ago', answers: 12, views: 234, votes: 28, replies: [] },
  { id: 'post3', type: 'Discussion', tags: ['Career'], title: 'How to transition from junior to senior developer?', content: "I've been a junior developer for 2 years now. What skills and experiences should I focus on to make the jump to senior level? Looking for practical advice from those who've made this transition.", author: 'Mike Johnson', authorInitials: 'MJ', time: '6 hours ago', answers: 24, views: 445, votes: 67, hot: true, replies: [] },
  { id: 'post4', type: 'Help', tags: ['CSS'], title: 'CSS Grid vs Flexbox: When to use which?', content: "I'm confused about when to use CSS Grid versus Flexbox. I understand the basics of both, but I'm not sure which one to choose for different layout scenarios. Any guidance?", author: 'Lisa Wang', authorInitials: 'LW', time: '8 hours ago', answers: 6, views: 89, votes: 15, replies: [] },
  { id: 'post5', type: 'Question', tags: ['Database'], title: 'Database optimization: SQL vs NoSQL for high-traffic applications', content: "Building an app that expects high traffic. Trying to decide between PostgreSQL and MongoDB. What factors should I consider? Performance, scalability, and maintenance are my main concerns.", author: 'David Kim', authorInitials: 'DK', time: '1 day ago', answers: 18, views: 567, votes: 93, featured: true, replies: [] },
];

const technicalChatsData = {
    frontend: { name: "Frontend Development", messages: [{ sender: "Jane", text: "Anyone here good with CSS animations?" }, { sender: "You", text: "I can help, what's up?" }] },
    backend: { name: "Backend Development", messages: [{ sender: "Mike", text: "Is Express still the go-to for Node.js?" }] },
    mobile: { name: "Mobile Development", messages: [] },
    devops: { name: "DevOps & Cloud", messages: [] },
    data: { name: "Data Science & AI", messages: [] },
    security: { name: "Cybersecurity", messages: [] }
};

const mainChatsData = {
  'Dr. Evelyn Reed': {
    initials: 'ER',
    messages: [
      { sender: 'Dr. Evelyn Reed', text: 'Hi Sripadam, just checking in on your final project. Let me know if you need any help.' },
      { sender: 'You', text: 'Thanks, Dr. Reed! I think I\'m on track. I should have the final report submitted by tomorrow.' }
    ]
  },
  'Sarah Miller': {
    initials: 'SM',
    messages: [
      { sender: 'Sarah Miller', text: 'Hey! Did you manage to solve that React state issue we talked about?' }
    ]
  },
  'Study Group': {
    initials: 'SG',
    messages: [
      { sender: 'John Doe', text: 'Is anyone free to review the Data Science material tonight at 7?' }
    ]
  }
};

const upcomingQuizDueDate = new Date();
upcomingQuizDueDate.setDate(upcomingQuizDueDate.getDate() + 1);

const quizData = [
  {
    id: 'q1',
    course: 'Advanced JavaScript & React',
    title: 'React Hooks Basics',
    dueDate: upcomingQuizDueDate.toISOString().split('T')[0],
    questions: [
      { q: 'What is useState?', options: ['A state hook', 'A side-effect hook', 'A context hook'], answer: 'A state hook' },
      { q: 'Which hook is used for side effects?', options: ['useState', 'useEffect', 'useReducer'], answer: 'useEffect' },
    ],
    taken: false,
    score: null,
  },
  {
    id: 'q2',
    course: 'Data Science with Python',
    title: 'Pandas DataFrame Quiz',
    dueDate: '2024-08-05',
    questions: [
      { q: 'Which function reads a CSV file?', options: ['pd.read_csv', 'pd.open_csv', 'pd.load_csv'], answer: 'pd.read_csv' },
      { q: 'How do you select a column named "age"?', options: ["df['age']", 'df.get("age")', 'df.column("age")'], answer: "df['age']" },
      { q: 'What does df.head() do?', options: ['Shows the last 5 rows', 'Shows summary stats', 'Shows the first 5 rows'], answer: 'Shows the first 5 rows' },
    ],
    taken: true,
    score: 2,
  }
];

const submissionsData = [
    { id: 1, studentName: 'Sripadam Veerendra Mohan', assignment: 'React Components Essay', status: 'Submitted', grade: null },
    { id: 2, studentName: 'Jane Doe', assignment: 'UX Case Study', status: 'Submitted', grade: null },
    { id: 3, studentName: 'John Smith', assignment: 'Python Data Analysis', status: 'Graded', grade: 'A-' },
]

const teacherDetailedStudents = {
    'csm': [
        { id: 1, name: 'Sripadam Veerendra Mohan', studentId: 'STU001', avatar: 'SV', courseProgress: 75, overallGrade: 'B+', course: 'Data Structures', lastActive: '1h ago', status: 'Active', detailedGrades: [ { type: 'Quiz', name: 'Arrays & Lists', score: 85, date: '2024-07-28', status: 'completed' }, { type: 'Project', name: 'Todo List App', score: 92, date: '2024-07-25', status: 'completed' } ], attendance: 95, email: 'mohan@example.com', phone: '+1 123 456 0001', quizzes: { completed: 8, total: 10, average: 89 }, projects: { completed: 5, total: 6, average: 94 }, assignments: { completed: 12, total: 15, average: 87 } },
        { id: 2, name: 'John Smith', studentId: 'STU002', avatar: 'JS', courseProgress: 85, overallGrade: 'A-', course: 'React Development', lastActive: '3h ago', status: 'Active', detailedGrades: [ { type: 'Project', name: 'Portfolio Website', score: 90, date: '2024-07-27', status: 'completed' }], attendance: 98, email: 'john.s@example.com', phone: '+1 123 456 0002', quizzes: { completed: 7, total: 8, average: 86 }, projects: { completed: 4, total: 4, average: 88 }, assignments: { completed: 10, total: 12, average: 85 } },
    ],
    'cse-a': [
        { id: 3, name: 'Jane Doe', studentId: 'STU003', avatar: 'JD', courseProgress: 72, overallGrade: 'B', course: 'Python Programming', lastActive: 'Yesterday', status: 'Active', detailedGrades: [ { type: 'Assignment', name: 'Data Cleaning', score: 75, date: '2024-07-26', status: 'completed' } ], attendance: 91, email: 'jane.d@example.com', phone: '+1 123 456 0003', quizzes: { completed: 5, total: 9, average: 68 }, projects: { completed: 2, total: 5, average: 72 }, assignments: { completed: 8, total: 12, average: 65 } },
        { id: 4, name: 'Peter Jones', studentId: 'STU004', avatar: 'PJ', courseProgress: 55, overallGrade: 'C+', course: 'Machine Learning', lastActive: '3 days ago', status: 'Needs Attention', detailedGrades: [ { type: 'Quiz', name: 'Linear Regression', score: 60, date: '2024-07-25', status: 'completed' }, { type: 'Assignment', name: 'Feature Engineering', score: 0, date: '2024-07-20', status: 'missing' } ], attendance: 85, email: 'peter.j@example.com', phone: '+1 123 456 0004', quizzes: { completed: 3, total: 8, average: 52 }, projects: { completed: 1, total: 4, average: 48 }, assignments: { completed: 5, total: 10, average: 43 } },
    ],
    'cse-b': [
         { id: 5, name: 'Lisa Wang', studentId: 'STU005', avatar: 'LW', courseProgress: 92, overallGrade: 'A', course: 'Web Development', lastActive: '5h ago', status: 'Active', detailedGrades: [ { type: 'Project', name: 'E-commerce Site', score: 95, date: '2024-07-28', status: 'completed' } ], attendance: 97, email: 'lisa.w@example.com', phone: '+1 123 456 0005', quizzes: { completed: 9, total: 10, average: 93 }, projects: { completed: 6, total: 6, average: 96 }, assignments: { completed: 14, total: 15, average: 92 } },
    ]
};

const teacherGroupsData = [
    { id: 'csm', name: 'CSM', members: teacherDetailedStudents['csm'].length, icon: '💻' },
    { id: 'cse-a', name: 'CSE-A', members: teacherDetailedStudents['cse-a'].length, icon: '🚀' },
    { id: 'cse-b', name: 'CSE-B', members: teacherDetailedStudents['cse-b'].length, icon: '🧪' },
];

const teacherChatData = {
    'Sarah Johnson (Parent)': {
        initials: 'SJ',
        messages: [{ sender: 'Sarah Johnson (Parent)', text: "Hi Dr. Reed, I wanted to check on Alex's progress in your class." }, { sender: 'You', text: "Hello Sarah, Alex is doing great. He's one of the top performers in the class." }]
    },
    'Sripadam Veerendra Mohan (Student)': {
        initials: 'SV',
        messages: [{ sender: 'You', text: 'Sripadam, your last submission was excellent. Keep up the good work!' }]
    }
}

const parentPortalData = {
    parentName: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    phone: '+1 123 456 7890',
    address: '456 Oak Avenue, Springfield',
    children: [
        {
            id: 'alex',
            name: 'Alex Smith',
            initials: 'AS',
            grade: 'Grade 10',
            track: 'Computer Science Track',
            gpa: 4.2,
            attendance: 95,
            assignments: 8,
            progressStatus: 'Excellent',
            progressPercent: 88,
            courses: [
                { name: 'Advanced JavaScript', grade: 'A', percent: 92 },
                { name: 'Data Structures', grade: 'B+', percent: 87 },
                { name: 'Mathematics', grade: 'A-', percent: 90 },
            ]
        },
        {
            id: 'emma',
            name: 'Emma Smith',
            initials: 'ES',
            grade: 'Grade 8',
            track: 'General Studies',
            gpa: 3.8,
            attendance: 92,
            assignments: 6,
            progressStatus: 'Good',
            progressPercent: 76,
            courses: [
                { name: 'English Literature', grade: 'A-', percent: 89 },
                { name: 'Algebra', grade: 'B', percent: 82 },
                { name: 'Biology', grade: 'A', percent: 91 },
            ]
        }
    ],
    stats: {
        activeStudents: 2,
        totalCourses: 14,
        avgAttendance: '93%',
        newMessages: 3,
    },
    recentActivity: [
        { type: 'submission', icon: '✓', color: 'green', title: 'Assignment Submitted', description: 'Alex submitted "JavaScript Project" - Grade: A', time: '2 hours ago' },
        { type: 'course', icon: '📚', color: 'blue', title: 'Course Completed', description: 'Emma completed "Algebra Fundamentals"', time: '1 day ago' },
        { type: 'due', icon: '⚠', color: 'yellow', title: 'Assignment Due Soon', description: 'Emma has "History Essay" due tomorrow', time: '3 days ago' },
        { type: 'achievement', icon: '🏆', color: 'purple', title: 'Achievement Unlocked', description: 'Alex earned "JavaScript Master" badge', time: '1 week ago' },
    ],
    events: [
        { color: 'red', title: 'Parent-Teacher Conference', description: 'Scheduled for Friday, Dec 15th at 3:00 PM', meta: "With Ms. Johnson (Alex's Math Teacher)" },
        { color: 'blue', title: 'New Message from Teacher', description: '"Alex is showing excellent progress in Computer Science..."', meta: 'From Prof. Williams • 2 days ago' },
        { color: 'green', title: 'School Event', description: 'Science Fair - December 20th, 2024', meta: 'Emma is participating in the Biology category' },
        { color: 'purple', title: 'Grade Report Available', description: 'Mid-semester grades are now available for review', meta: 'Click to view detailed report' },
    ],
    chats: {
        'Dr. Evelyn Reed (CS)': {
            initials: 'ER',
            messages: [{ sender: 'You', text: "Hi Dr. Reed, I wanted to check on Alex's progress in your class." }, { sender: 'Dr. Evelyn Reed (CS)', text: "Hello Sarah, Alex is doing great. He's one of the top performers in the class." }]
        },
        'Mr. Davis (History)': {
            initials: 'MD',
            messages: [{ sender: 'Mr. Davis (History)', text: "Hi Sarah, just a reminder that Emma's history essay is due tomorrow. She's been doing very well in class!" }]
        }
    }
};

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- SVG ICONS ---
const IconMyCourse = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 3H4C3.44772 3 3 3.44772 3 4V10C3 10.5523 3.44772 11 4 11H10C10.5523 11 11 10.5523 11 10V4C11 3.44772 10.5523 3 10 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M20 3H14C13.4477 3 13 3.44772 13 4V10C13 10.5523 13.4477 11 14 11H20C20.5523 11 21 10.5523 21 10V4C21 3.44772 20.5523 3 20 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M10 13H4C3.44772 13 3 13.4477 3 14V20C3 20.5523 3.44772 21 4 21H10C10.5523 21 11 20.5523 11 20V14C11 13.4477 10.5523 13 10 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M20 13H14C13.4477 13 13 13.4477 13 14V20C13 20.5523 13.4477 21 14 21H20C20.5523 21 21 20.5523 21 20V14C21 13.4477 20.5523 13 20 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const IconAssignments = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M16.04 3.02002L8.16 10.9C7.86 11.2 7.56 11.79 7.5 12.22L7.07 15.23C6.91 16.32 7.68 17.08 8.77 16.93L11.78 16.5C12.21 16.44 12.79 16.14 13.1 15.84L20.98 7.96002C22.34 6.60002 22.98 5.01002 20.98 3.01002C18.98 1.01002 17.39 1.66002 16.04 3.02002Z" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/><path d="M14.91 4.15002C15.58 6.54002 17.45 8.41002 19.85 9.08002" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const IconQuizzes = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.5 2H9.5C7 2 5 4 5 6.5V17.5C5 20 7 22 9.5 22H14.5C17 22 19 20 19 17.5V6.5C19 4 17 2 14.5 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M14.5 14H9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 18H9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M10 6.5C10 7.32843 9.32843 8 8.5 8C7.67157 8 7 7.32843 7 6.5C7 5.67157 7.67157 5 8.5 5C9.32843 5 10 5.67157 10 6.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const IconForum = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 20.25C12 20.25 2.625 17.25 2.625 12C2.625 6.75 6.875 2.75 12 2.75C17.125 2.75 21.375 6.75 21.375 12C21.375 15.75 18.25 18.5 15.375 19.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 20.25C12 20.25 12.875 17.375 12.875 15.75C12.875 14.125 12 11.25 12 11.25C12 11.25 11.125 14.125 11.125 15.75C11.125 17.375 12 20.25 12 20.25Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M9.75 11.875C9.75 11.875 7.625 12.75 7.625 14.25C7.625 15.75 9 16.375 9.75 16.375" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M14.25 11.875C14.25 11.875 16.375 12.75 16.375 14.25C16.375 15.75 15 16.375 14.25 16.375" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const IconChat = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 9H17.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 9H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M7 9H7.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 14.0901 3.68201 16.0124 4.83482 17.5451L3 21L6.45492 19.1652C7.98757 20.318 9.90992 21 12 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const IconProfile = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const IconGroups = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 20.5H7C4 20.5 2 19 2 15.5V8.5C2 5 4 3.5 7 3.5H17C20 3.5 22 5 22 8.5V15.5C22 19 20 20.5 17 20.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M17 9L12 12.5L7 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const IconAIAssistant = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 4L13.8284 8.17157L18 10L13.8284 11.8284L12 16L10.1716 11.8284L6 10L10.1716 8.17157L12 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 19L6 17L7 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M17 19L18 17L19 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;

const IconTheme = ({ theme }) => theme === 'light' ? (
    <svg className="nav-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 2V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 20V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M4.92993 4.92993L6.33993 6.33993" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M17.6599 17.66L19.0699 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 12H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M20 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M4.92993 19.07L6.33993 17.66" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M17.6599 6.33993L19.0699 4.92993" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
) : (
    <svg className="nav-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 12.79C21 17.21 17.21 21 12.79 21C9.28 21 6.2 18.99 4.5 16.29C4.16 15.75 4.83 15.23 5.29 15.54C7.38 16.99 10.23 17.58 12.93 16.65C15.63 15.72 17.58 13.43 17.94 10.64C18.3 7.85 16.99 5.17 14.49 3.73C11.99 2.29 8.89 2.51 6.53 4.29C6.08 4.6 5.56 3.93 5.86 3.49C8.66 1.11 12.44 0.99 15.74 2.94C19.04 4.89 21 8.67 21 12.79Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
const IconLogout = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;


// --- MAIN APP COMPONENTS ---

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleLogout = () => {
      setCurrentUser(null);
  }

  const MainContent = () => {
      if (!currentUser) {
        return <Login onLogin={setCurrentUser} />;
      }
      if (currentUser.role === 'Teacher') {
          return <TeacherLayout user={currentUser} onLogout={handleLogout} theme={theme} toggleTheme={toggleTheme} />;
      }
      return <MainAppLayout user={currentUser} onLogout={handleLogout} theme={theme} toggleTheme={toggleTheme} />;
  }

  return (
    <NotificationProvider>
        <MainContent />
    </NotificationProvider>
  );
};

const MainAppLayout = ({ user, onLogout, theme, toggleTheme }) => {
  const [currentView, setCurrentView] = useState('dashboard');
  const { addNotification } = useNotification();
  const notificationsFired = useRef(false);

  useEffect(() => {
    if (user.role === 'Student' && !notificationsFired.current) {
        const checkDueDates = () => {
            const now = new Date();
            now.setHours(0, 0, 0, 0); // Compare dates only
            const upcoming = [];

            const isUpcoming = (dueDateStr) => {
                if (!dueDateStr) return false;
                const due = new Date(dueDateStr);
                due.setHours(0, 0, 0, 0);
                const diffTime = due.getTime() - now.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return diffDays >= 0 && diffDays <= 3;
            };

            studentAssignments.forEach(assignment => {
                if (assignment.status === 'Not Submitted' && isUpcoming(assignment.dueDate)) {
                    upcoming.push({ message: `Assignment due soon: "${assignment.title}"`, type: 'warning' });
                }
            });

            quizData.forEach(quiz => {
                if (!quiz.taken && isUpcoming(quiz.dueDate)) {
                   upcoming.push({ message: `Quiz due soon: "${quiz.title}"`, type: 'warning' });
                }
            });

            upcoming.forEach((notification, index) => {
                setTimeout(() => {
                    addNotification(notification.message, notification.type);
                }, index * 700); // Stagger notifications
            });
            
            notificationsFired.current = true;
        };

        // Run after a short delay to allow the app to render first
        setTimeout(checkDueDates, 1000);
    }
  }, [user, addNotification]);

  const renderContent = () => {
      switch (user.role) {
        case 'Student':
          return <StudentViews currentView={currentView} user={user}/>;
        case 'Parent':
            return <ParentViews currentView={currentView} />;
        default:
          return <div>Unknown user role</div>;
      }
  };
  
  const isParentView = user.role === 'Parent';

  return (
    <div className="app-container">
      <Sidebar user={user} onNavigate={setCurrentView} currentView={currentView} onLogout={onLogout} theme={theme} toggleTheme={toggleTheme} />
      <main className={`main-content ${isParentView ? 'parent-view-active' : ''}`}>
        {renderContent()}
      </main>
    </div>
  );
};

const StudentViews = ({ currentView, user }) => {
    switch (currentView) {
        case 'dashboard': // Default for student
        case 'my-course':
          return <MyCourses />;
        case 'assignments':
            return <AssignmentsView />;
        case 'quizzes':
            return <QuizzesView />;
        case 'forum':
            return <ForumView user={user} />;
        case 'chat':
            return <ChatView user={user} chatsData={mainChatsData} />;
        case 'ai-tutor':
            return <AIChatView 
                role="Tutor"
                systemInstruction="You are a friendly and encouraging AI Tutor for a student on the EduPersonalize learning platform. Your goal is to help students understand concepts, solve problems, and learn effectively. Never give away direct answers to assignments. Instead, guide them with leading questions and explain the underlying principles. Your tone should be patient, positive, and supportive. Use analogies and simple examples where possible."
                welcomeMessage="Hello! I'm your AI Tutor. How can I help you with your studies today?"
                promptSuggestions={[
                    "Explain React Hooks like I'm five.",
                    "Give me a practice problem for Python lists.",
                    "What's the difference between CSS Grid and Flexbox?",
                    "Help me debug this JavaScript code."
                ]}
            />;
        case 'profile':
            return <ProfileView />;
        default:
          return <MyCourses />;
      }
}

const TeacherLayout = ({ user, onLogout, theme, toggleTheme }) => {
    const [currentView, setCurrentView] = useState('dashboard');
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: <IconMyCourse /> },
        { id: 'groups', label: 'Groups', icon: <IconGroups /> },
        { id: 'grading', label: 'Grading', icon: <IconAssignments /> },
        { id: 'ai-assistant', label: 'AI Assistant', icon: <IconAIAssistant /> },
        { id: 'chat', label: 'Chat', icon: <IconChat /> }
    ];

    const renderContent = () => {
        return <TeacherViews currentView={currentView} />;
    };

    return (
        <div className="teacher-layout">
            <header className="teacher-header">
                <div className="logo">
                    <div className="logo-icon">🎓</div>
                    <h1>EduPersonalize</h1>
                </div>
                <nav className="teacher-nav">
                    {navItems.map(item => (
                         <button key={item.id} onClick={() => setCurrentView(item.id)} className={`teacher-nav-item ${currentView === item.id ? 'active' : ''}`}>
                            {item.icon}
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>
                 <div className="teacher-header-actions">
                    <button onClick={toggleTheme} className="theme-toggle" aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
                        <IconTheme theme={theme} />
                    </button>
                    <div className="user-profile-sidebar">
                        <div className="user-avatar">{user.initials}</div>
                        <div className="user-details">
                            <span className="user-name">{user.name}</span>
                            <span className="user-role">{user.role}</span>
                        </div>
                    </div>
                     <button onClick={onLogout} className="logout-button">
                        <IconLogout />
                    </button>
                </div>
            </header>
            <main className="main-content">
                {renderContent()}
            </main>
        </div>
    );
};


const TeacherViews = ({ currentView }) => {
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);

    const handleSelectGroup = (group) => {
        setSelectedGroup(group);
        setSelectedStudent(null);
    };

    const handleSelectStudent = (student) => {
        setSelectedStudent(student);
    }
    
    const backToGroups = () => {
        setSelectedGroup(null);
        setSelectedStudent(null);
    }
    
    const backToStudents = () => {
        setSelectedStudent(null);
    }

    if (currentView === 'groups' && selectedStudent) {
        return <TeacherStudentDetailView student={selectedStudent} onBack={backToStudents} />;
    }

    if (currentView === 'groups' && selectedGroup) {
        return <TeacherStudentsView 
            group={selectedGroup} 
            students={teacherDetailedStudents[selectedGroup.id]} 
            onSelectStudent={handleSelectStudent} 
            onBack={backToGroups} 
        />;
    }
    
    switch (currentView) {
        case 'grading':
            return <GradingView />;
        case 'groups':
            return <TeacherGroupsView onSelectGroup={handleSelectGroup} />;
        case 'ai-assistant':
            return <AIChatView 
                role="Assistant"
                systemInstruction="You are a helpful AI Assistant for a teacher on the EduPersonalize learning platform. Your role is to support teachers with their professional tasks. You can help brainstorm lesson plans, create quiz questions, suggest engaging classroom activities, or provide explanations on pedagogical strategies. Your tone should be professional, knowledgeable, and collaborative."
                welcomeMessage="Hello! I'm your AI Assistant. How can I help you with your work today?"
                promptSuggestions={[
                    "Generate 5 multiple-choice questions about React state management.",
                    "Suggest a fun project idea for an intro to Python class.",
                    "Create a lesson plan outline for a class on CSS Flexbox.",
                    "Explain the concept of 'scope' in JavaScript simply."
                ]}
            />;
        case 'chat':
            return <ChatView user={mockUsers.teacher} chatsData={teacherChatData} />;
        case 'dashboard':
        default:
            return <TeacherDashboard />;
    }
}

const ParentViews = ({ currentView }) => {
    switch(currentView) {
        case 'messages':
            return <ChatView user={mockUsers.parent} chatsData={parentPortalData.chats} />;
        case 'profile':
            return <ParentProfileView />;
        case 'dashboard':
        default:
            return <ParentDashboard />;
    }
}


// --- AUTHENTICATION ---
const Login = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState('student');
  const [isSignUp, setIsSignUp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addNotification } = useNotification();
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        addNotification('Login successful!', 'success');
        // Store token for future requests
        localStorage.setItem('access_token', data.access_token);
        
        // Call onLogin with user data
        onLogin({
          id: data.user.id,
          email: data.user.email,
          username: data.user.username,
          role: data.user.role.charAt(0).toUpperCase() + data.user.role.slice(1),
          first_name: data.user.first_name,
          last_name: data.user.last_name,
        });
      } else {
        addNotification(data.message || 'Login failed', 'error');
      }
    } catch (error) {
      addNotification('Connection error: ' + error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    
    if (!email) {
      addNotification('Please enter your email', 'error');
      return;
    }
    
    if (!fullName) {
      addNotification('Please enter your full name', 'error');
      return;
    }
    
    if (password !== confirmPassword) {
      addNotification('Passwords do not match', 'error');
      return;
    }

    setIsLoading(true);
    
    try {
      const [firstName, lastName] = fullName.split(' ');
      const response = await fetch('http://localhost:5000/api/auth/register-initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          username: email.split('@')[0],
          password: password,
          password_confirm: confirmPassword,
          first_name: firstName || fullName,
          last_name: lastName || '',
          role: selectedRole,
          phone: phone || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        addNotification('OTP sent to your email! Please verify.', 'success');
        setOtpSent(true);
      } else {
        addNotification(data.error || 'Failed to send OTP', 'error');
      }
    } catch (error) {
      addNotification('Connection error: ' + error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    
    if (!otp) {
      addNotification('Please enter the OTP', 'error');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/register-verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          otp: otp,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        addNotification('Account created! Logging you in...', 'success');
        localStorage.setItem('access_token', data.access_token);
        
        // Call onLogin with user data
        onLogin({
          id: data.user.id,
          email: data.user.email,
          username: data.user.username,
          role: data.user.role.charAt(0).toUpperCase() + data.user.role.slice(1),
          first_name: data.user.first_name,
          last_name: data.user.last_name,
        });
        
        // Reset signup form
        setIsSignUp(false);
        setEmail('');
        setPassword('');
        setFullName('');
        setConfirmPassword('');
        setOtp('');
        setOtpSent(false);
        setPhone('');
      } else {
        addNotification(data.error || 'OTP verification failed', 'error');
      }
    } catch (error) {
      addNotification('Connection error: ' + error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = () => {
    addNotification(`Signing in with Google as ${selectedRole}...`, 'info');
    // TODO: Implement Google OAuth
  };

  const resetSignUp = () => {
    setIsSignUp(false);
    setOtpSent(false);
    setEmail('');
    setPassword('');
    setFullName('');
    setConfirmPassword('');
    setOtp('');
    setPhone('');
  };

  return (
    <div className="login-container">
        <div className="login-floating-shapes">
            <div className="shape s1"></div>
            <div className="shape s2"></div>
            <div className="shape s3"></div>
        </div>
        <div className="login-card">
            <div className="login-header">
                <h1>GyanGuru 2.0</h1>
                <p>AI-Powered Learning Platform</p>
            </div>

            <div className="login-role-selector">
                <p>Select your role:</p>
                <div className="login-role-grid">
                    <div className={`login-role-card ${selectedRole === 'student' ? 'selected' : ''}`} onClick={() => setSelectedRole('student')}>
                        <div className="role-icon">🎓</div>
                        <div className="role-label">Student</div>
                    </div>
                     <div className={`login-role-card ${selectedRole === 'teacher' ? 'selected' : ''}`} onClick={() => setSelectedRole('teacher')}>
                        <div className="role-icon">👨‍🏫</div>
                        <div className="role-label">Teacher</div>
                    </div>
                    <div className={`login-role-card ${selectedRole === 'parent' ? 'selected' : ''}`} onClick={() => setSelectedRole('parent')}>
                        <div className="role-icon">👨‍👩‍👧</div>
                        <div className="role-label">Parent</div>
                    </div>
                </div>
            </div>

            <form className="login-form" onSubmit={!isSignUp ? handleLogin : (otpSent ? handleVerifyOTP : handleSendOTP)}>
                {isSignUp && !otpSent && (
                    <>
                        <div className="input-group">
                            <label htmlFor="fullName">Full Name</label>
                            <input 
                              type="text" 
                              id="fullName" 
                              placeholder="Enter your full name" 
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              required 
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="email">Email Address</label>
                            <input 
                                type="email" 
                                id="email" 
                                placeholder="e.g., student@example.com" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        {selectedRole === 'parent' && (
                            <div className="input-group">
                                <label htmlFor="phone">Phone Number</label>
                                <input 
                                    type="tel" 
                                    id="phone" 
                                    placeholder="e.g., +1234567890" 
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                        )}

                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <input 
                                type="password" 
                                id="password" 
                                placeholder="Enter your password (min 8 chars, 1 uppercase, 1 digit)" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required 
                            />
                        </div>
                   
                        <div className="input-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input 
                              type="password" 
                              id="confirmPassword" 
                              placeholder="Confirm your password" 
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              required 
                            />
                        </div>
                    </>
                )}

                {isSignUp && otpSent && (
                    <div className="input-group">
                        <label htmlFor="otp">✉️ Enter OTP sent to {email}</label>
                        <input 
                            type="text" 
                            id="otp" 
                            placeholder="Enter 6-digit OTP" 
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            maxLength="6"
                            required
                        />
                        <small style={{marginTop: '0.25rem', color: '#666'}}>Check your email for the OTP code</small>
                    </div>
                )}

                {!isSignUp && (
                    <>
                        <div className="input-group">
                            <label htmlFor="email">Email Address</label>
                            <input 
                                type="email" 
                                id="email" 
                                placeholder="e.g., student@example.com" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <input 
                                type="password" 
                                id="password" 
                                placeholder="Enter your password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required 
                            />
                        </div>
                    </>
                )}
                
                <button 
                  type="submit" 
                  className="button button-full" 
                  style={{marginTop: '1rem'}}
                  disabled={isLoading}
                >
                    {isLoading ? 'Loading...' : (
                        !isSignUp ? 'Sign In' : (
                            otpSent ? 'Verify OTP & Create Account' : 'Send OTP to Email'
                        )
                    )}
                </button>
            </form>

            <button 
              type="button"
              onClick={() => {
                const demoEmail = `demo${selectedRole}@example.com`;
                setEmail(demoEmail);
                setPassword('demo123');
              }}
              className="button button-secondary"
              style={{marginTop: '0.5rem', fontSize: '0.85rem'}}
            >
              🚀 Quick Demo Login
            </button>
            
            <div className="login-divider"><span>Or</span></div>

            <button onClick={handleSocialLogin} className="button button-secondary button-full button-social">
                <svg className="social-icon" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Sign In with Google
            </button>
            <div className="demo-creds">
                <p>Demo: Use any email and password to test</p>
                <p>Or sign up for a new account</p>
            </div>

            <p className="login-toggle-text">
                {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                <a onClick={() => resetSignUp()}>
                    {isSignUp ? 'Sign in here' : 'Sign up here'}
                </a>
            </p>
        </div>
    </div>
  );
};

// --- STUDENT VIEWS ---

const MyCourses = () => {
    const [filter, setFilter] = useState('All');
    const courses = studentData.courses;

    const completedCoursesCount = courses.filter(c => c.status === 'Completed').length;
    const stats = {
        enrolled: courses.length,
        completed: completedCoursesCount,
        hours: 127,
        certificates: completedCoursesCount,
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'Completed': return 'tag-completed';
            case 'In Progress': return 'tag-in-progress';
            default: return 'tag-not-started';
        }
    };

    const getDifficultyClass = (difficulty) => {
        switch (difficulty) {
            case 'Beginner': return 'tag-beginner';
            case 'Intermediate': return 'tag-intermediate';
            case 'Advanced': return 'tag-advanced';
            default: return '';
        }
    };
    
    const filteredCourses = courses.filter(course => {
        if (filter === 'All') return true;
        if (filter === 'Not Started' && course.progress === 0) return true;
        return course.status === filter;
    });

    return (
        <div>
            <div className="view-header">
                <h2 className="view-title">Welcome back, {studentData.name}! 👋</h2>
                <p className="view-subtitle">Continue your learning journey with your enrolled courses</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                     <div className="stat-icon-wrapper enrolled">📚</div>
                    <div>
                        <p className="stat-label">Enrolled Courses</p>
                        <p className="stat-value">{stats.enrolled}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon-wrapper completed">✅</div>
                    <div>
                        <p className="stat-label">Completed</p>
                        <p className="stat-value">{stats.completed}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon-wrapper hours">⏱️</div>
                    <div>
                        <p className="stat-label">Hours Studied</p>
                        <p className="stat-value">{stats.hours}</p>
                    </div>
                </div>
                <div className="stat-card">
                     <div className="stat-icon-wrapper certificates">🏆</div>
                    <div>
                        <p className="stat-label">Certificates</p>
                        <p className="stat-value">{stats.certificates}</p>
                    </div>
                </div>
            </div>

            <div className="course-filters">
                <button onClick={() => setFilter('All')} className={filter === 'All' ? 'active' : ''}>All Courses</button>
                <button onClick={() => setFilter('In Progress')} className={filter === 'In Progress' ? 'active' : ''}>In Progress</button>
                <button onClick={() => setFilter('Completed')} className={filter === 'Completed' ? 'active' : ''}>Completed</button>
                <button onClick={() => setFilter('Not Started')} className={filter === 'Not Started' ? 'active' : ''}>Not Started</button>
            </div>

            <div className="courses-grid">
                {filteredCourses.map(course => (
                    <div key={course.id} className="course-card">
                        <div className="course-card-header">
                            <span className={`tag ${getStatusClass(course.status)}`}>{course.status}</span>
                            <span className={`tag ${getDifficultyClass(course.difficulty)}`}>{course.difficulty}</span>
                        </div>
                        <h3 className="course-title">{course.title}</h3>
                        <p className="course-instructor">by {course.instructor}</p>
                        <div className="course-meta">
                            <span>📅 {course.duration}</span>
                            <span>📚 {course.completedLessons}/{course.lessons} lessons</span>
                        </div>
                        <div className="progress-container">
                             <div className="progress-labels">
                                <span>Progress</span>
                                <span>{course.progress}%</span>
                            </div>
                            <div className="progress-bar-bg">
                                <div className="progress-bar" style={{ width: `${course.progress}%` }}></div>
                            </div>
                        </div>
                        <button className="button button-full">
                            {course.status === 'Not Started' ? 'Start Course' : course.status === 'Completed' ? 'Review Course' : 'Continue Learning'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ProfileView = () => {
    const data = profileData;
    const badgeIcons = {
        "Hackathon Winner": "🏆", "Top Contributor": "⭐", "Goal Crusher": "🎯",
        "Study Master": "📚", "30-Day Streak": "🔥", "Innovator": "💡",
        "Fast Learner": "🚀", "Creative Coder": "🎨", "Rising Star": "🌟"
    };

    const getGoalProgress = (goal) => {
        if (goal.label.includes("GPA")) return 100;
        return (goal.current / goal.total) * 100;
    }
    
    const getGoalValue = (goal) => {
        if (goal.label.includes("GPA")) return goal.current;
        return `${goal.current}/${goal.total}`
    }

    return (
        <div className="profile-container">
            {/* Profile Header */}
            <div className="profile-card profile-header-card">
                <div className="profile-header-main">
                    <div className="profile-picture-container">
                        <div className="profile-picture">{data.initials}</div>
                        <div className="profile-role-badge">🎓 {data.role}</div>
                    </div>
                    <div className="profile-info">
                        <h2 className="profile-name">{data.name}</h2>
                        <p className="profile-major">{data.major}</p>
                        <div className="profile-tags">
                            {data.tags.map((tag, i) => <span key={i} className={`profile-tag tag-${i%4}`}>{tag}</span>)}
                        </div>
                    </div>
                </div>
                <div className="profile-actions">
                    <div className="profile-socials">
                        <a href={data.social.github} target="_blank" rel="noopener noreferrer" className="social-link github">
                           <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                        </a>
                        <a href={data.social.linkedin} target="_blank" rel="noopener noreferrer" className="social-link linkedin">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                        </a>
                    </div>
                    <button className="button">Edit Profile</button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="profile-stats-grid">
                <div className="profile-stat-card"><div className="stat-value">{data.stats.completed}</div><p>Courses Completed</p></div>
                <div className="profile-stat-card"><div className="stat-value">{data.stats.gpa}</div><p>GPA</p></div>
                <div className="profile-stat-card"><div className="stat-value">{data.stats.studyHours}</div><p>Study Hours</p></div>
                <div className="profile-stat-card"><div className="stat-value">{data.stats.certificates}</div><p>Certificates</p></div>
            </div>

            {/* About Section */}
            <div className="profile-card">
                <h3>About Me</h3>
                <p>{data.about}</p>
            </div>

            <div className="profile-grid-2-col">
                {/* Current Courses */}
                <div className="profile-card">
                    <h3>Current Courses</h3>
                    <div className="profile-course-list">
                        {studentData.courses.filter(c => c.status === 'In Progress').map(course => (
                            <div key={course.id} className="profile-course-item">
                                <h4>{course.title}</h4>
                                <p className="course-instructor">{course.instructor}</p>
                                <div className="progress-bar-bg">
                                    <div className="progress-bar" style={{width: `${course.progress}%`}}></div>
                                </div>
                                <p className="progress-percent">{course.progress}% Complete</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Interests & Hobbies */}
                 <div className="profile-card">
                    <h3>Interests & Hobbies</h3>
                    <div className="interests-sections">
                        <h4>Technical Interests</h4>
                        <div className="profile-tags">
                             {data.interests.technical.map((tag, i) => <span key={i} className={`profile-tag-interest tag-${i%4}`}>{tag}</span>)}
                        </div>
                         <h4>Hobbies</h4>
                        <div className="profile-tags">
                            {data.interests.hobbies.map((tag, i) => <span key={i} className={`profile-tag-interest tag-hobby-${i%5}`}>{tag}</span>)}
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Education History */}
            <div className="profile-card">
                <h3>Education History</h3>
                <div className="timeline">
                    {data.education.map((edu, i) => (
                        <div key={i} className="timeline-item">
                            <div className={`timeline-dot dot-${edu.type}`}></div>
                            <h4>{edu.title}</h4>
                            <p className="timeline-subtitle">{edu.school} • {edu.duration}</p>
                            {Array.isArray(edu.details) ? (
                                <ul className="timeline-details-list">
                                    {edu.details.map((d, idx) => <li key={idx}>• {d}</li>)}
                                </ul>
                            ) : <p className="timeline-details">{edu.details}</p>}
                            {edu.awards && <div className="timeline-awards">{edu.awards.map((award, idx) => <span key={idx} className="timeline-award-tag">{award}</span>)}</div>}
                        </div>
                    ))}
                </div>
            </div>

             <div className="profile-grid-2-col">
                {/* Certificates */}
                <div className="profile-card">
                    <h3>Certificates</h3>
                    <div className="certificate-list">
                        {data.certificatesList.map((cert, i) => (
                            <div key={i} className={`certificate-item item-color-${i%4}`}>
                                <div className="cert-icon">{cert.icon}</div>
                                <div className="cert-info">
                                    <h4>{cert.title}</h4>
                                    <p>{cert.issuer} • {cert.year}</p>
                                </div>
                                <div className="cert-verified">Verified</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Badges & Achievements */}
                <div className="profile-card">
                    <h3>Badges & Achievements</h3>
                    <div className="badges-grid">
                        {data.badges.map((badge, i) => (
                            <div key={i} className={`badge-item badge-bg-${i}`}>
                                <div className="badge-icon">{badgeIcons[badge]}</div>
                                <p>{badge}</p>
                            </div>
                        ))}
                    </div>
                </div>
             </div>
             
             {/* Learning Goals */}
            <div className="profile-card">
                <h3>Learning Goals</h3>
                <div className="goals-grid">
                    <div className="goals-column">
                        <h4>This Month</h4>
                        {data.goals.month.map((goal, i) => (
                             <div key={i} className="goal-item">
                                <div className="goal-labels">
                                    <span className="goal-label">{goal.label}</span>
                                    <span className="goal-value">{getGoalValue(goal)}</span>
                                </div>
                                <div className="goal-progress-bar-bg">
                                    <div className="goal-progress-bar" style={{width: `${getGoalProgress(goal)}%`}}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                     <div className="goals-column">
                        <h4>This Semester</h4>
                        {data.goals.semester.map((goal, i) => (
                             <div key={i} className="goal-item">
                                <div className="goal-labels">
                                    <span className="goal-label">{goal.label}</span>
                                    <span className="goal-value">{getGoalValue(goal)}</span>
                                </div>
                                <div className="goal-progress-bar-bg">
                                    <div className="goal-progress-bar" style={{width: `${getGoalProgress(goal)}%`}}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const QuizzesView = () => {
    const [quizzes, setQuizzes] = useState(quizData);
    const [activeQuiz, setActiveQuiz] = useState(null);
    const [answers, setAnswers] = useState({});
    const [showResult, setShowResult] = useState(false);
    const [currentScore, setCurrentScore] = useState(0);

    const startQuiz = (quiz) => {
        setActiveQuiz(quiz);
        setAnswers({});
        setShowResult(false);
        setCurrentScore(0);
    }
    
    const handleAnswer = (qIndex, option) => {
        setAnswers({...answers, [qIndex]: option});
    }

    const submitQuiz = () => {
        let score = 0;
        activeQuiz.questions.forEach((q, index) => {
            if(answers[index] === q.answer) {
                score++;
            }
        });
        const updatedQuizzes = quizzes.map(q => q.id === activeQuiz.id ? {...q, taken: true, score} : q);
        setQuizzes(updatedQuizzes);
        setCurrentScore(score);
        setShowResult(true);
    }

    if(activeQuiz) {
        const percentage = Math.round((currentScore / activeQuiz.questions.length) * 100);
        return (
            <div className="quiz-active-container">
                <h2 className="view-title">{activeQuiz.title}</h2>
                {!showResult ? (
                    <div>
                        {activeQuiz.questions.map((q, index) => (
                            <div key={index} className="quiz-question-card">
                                <p className="quiz-question-text">{index + 1}. {q.q}</p>
                                <div className="quiz-options">
                                    {q.options.map(opt => (
                                        <label key={opt} className={`quiz-option ${answers[index] === opt ? 'selected' : ''}`}>
                                            <input type="radio" name={`q-${index}`} value={opt} onChange={() => handleAnswer(index, opt)} />
                                            {opt}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                        <button className="button" onClick={submitQuiz}>Submit Quiz</button>
                    </div>
                ) : (
                    <div className="quiz-result-card">
                        <h3 className="result-title">Quiz Completed!</h3>
                        <p className="result-score">Your Score: {currentScore} / {activeQuiz.questions.length} ({percentage}%)</p>
                         <div className="progress-container" style={{maxWidth: '300px', margin: '0 auto 1.5rem auto'}}>
                             <div className="progress-labels">
                                <span>Progress</span>
                                <span>{percentage}%</span>
                            </div>
                            <div className="progress-bar-bg">
                                <div className="progress-bar" style={{ width: `${percentage}%` }}></div>
                            </div>
                        </div>
                        <div className="button-group">
                            <button className="button" onClick={() => startQuiz(activeQuiz)}>Retake Quiz</button>
                            <button className="button button-secondary" onClick={() => setActiveQuiz(null)}>Back to Quizzes</button>
                        </div>
                    </div>
                )}
            </div>
        )
    }

    return (
        <div>
            <div className="view-header">
                <h1 className="view-title">Quizzes</h1>
                <p className="view-subtitle">Test your knowledge and prepare for exams.</p>
            </div>
            <div className="quiz-list">
                {quizzes.map(quiz => (
                    <div key={quiz.id} className="quiz-card">
                        <div>
                           <p className="quiz-course-name">{quiz.course}</p>
                           <h3 className="quiz-title">{quiz.title}</h3>
                           <div className="quiz-meta-container">
                                <p className="quiz-meta">{quiz.questions.length} Questions</p>
                                {quiz.dueDate && <p className="assignment-due-date" style={{marginTop: '0.25rem'}}>Due: {quiz.dueDate}</p>}
                           </div>
                        </div>
                        <div className="quiz-card-right">
                           {quiz.taken && <p className="quiz-score">Last Score: {quiz.score}/{quiz.questions.length}</p>}
                           <button className="button" onClick={() => startQuiz(quiz)}>
                                {quiz.taken ? 'Retake Quiz' : 'Start Quiz'}
                           </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

const AssignmentsView = () => {
    const [assignments, setAssignments] = useState(studentAssignments);
    const [assignmentToSubmit, setAssignmentToSubmit] = useState(null);

    const handleOpenConfirm = (assignment) => {
        setAssignmentToSubmit(assignment);
    };

    const handleCloseConfirm = () => {
        setAssignmentToSubmit(null);
    };

    const handleConfirmSubmit = () => {
        if (!assignmentToSubmit) return;

        setAssignments(prevAssignments => 
            prevAssignments.map(a => 
                a.id === assignmentToSubmit.id ? { ...a, status: 'Submitted' } : a
            )
        );
        
        handleCloseConfirm();
    };

    const getStatusBadge = (status) => {
        if (status === 'Graded') return <span className="assignment-status graded">Graded</span>;
        if (status === 'Submitted') return <span className="assignment-status submitted">Submitted</span>;
        return <span className="assignment-status not-submitted">Not Submitted</span>;
    };
    
    return (
        <div>
            <div className="view-header">
                <h1 className="view-title">Assignments</h1>
                <p className="view-subtitle">Submit your work and track your grades.</p>
            </div>
            <div className="assignments-list">
                {assignments.map(assignment => (
                    <div key={assignment.id} className="assignment-card">
                        <div className="assignment-info">
                            <h3 className="assignment-title">{assignment.title}</h3>
                            <p className="assignment-course">{assignment.course}</p>
                             <p className="assignment-due-date">Due: {assignment.dueDate}</p>
                        </div>
                        <div className="assignment-action">
                            {getStatusBadge(assignment.status)}
                            {assignment.status === 'Graded' && <span className="assignment-grade">Grade: {assignment.grade}</span>}
                            {assignment.status === 'Not Submitted' && <button className="button" onClick={() => handleOpenConfirm(assignment)}>Submit Now</button>}
                        </div>
                    </div>
                ))}
            </div>

            {assignmentToSubmit && (
                <div className="modal-overlay" onClick={handleCloseConfirm}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Confirm Submission</h3>
                            <button onClick={handleCloseConfirm} className="close-button">&times;</button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to submit the assignment:</p>
                            <p style={{marginTop: '0.5rem'}}><strong>{assignmentToSubmit.title}</strong> for <strong>{assignmentToSubmit.course}</strong>?</p>
                            <br/>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>This action cannot be undone.</p>
                        </div>
                        <div className="modal-footer">
                            <button className="button button-secondary" onClick={handleCloseConfirm}>Cancel</button>
                            <button className="button" onClick={handleConfirmSubmit}>Confirm & Submit</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const ChatView = ({ user, chatsData }) => {
    const [chats, setChats] = useState(chatsData);
    const [activeContactKey, setActiveContactKey] = useState(Object.keys(chatsData)[0]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chats, activeContactKey]);

    const handleSendMessage = () => {
        if (newMessage.trim() !== '') {
            const message = { sender: 'You', text: newMessage.trim() };
            const updatedChats = { ...chats };
            updatedChats[activeContactKey].messages.push(message);
            setChats(updatedChats);
            setNewMessage('');
        }
    };
    
    const activeChat = chats[activeContactKey];

    return (
        <div className="chat-view-layout">
            <aside className="chat-contact-list">
                <div className="view-header" style={{marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)'}}>
                    <h2 className="view-title" style={{fontSize: '1.5rem'}}>Messages</h2>
                </div>
                {Object.keys(chats).map(key => (
                    <div key={key} className={`chat-contact-item ${key === activeContactKey ? 'active' : ''}`} onClick={() => setActiveContactKey(key)}>
                        <div className="post-author-avatar">{chats[key].initials}</div>
                        <div className="chat-contact-info">
                            <div className="contact-name">{key}</div>
                            <div className="contact-last-message">{chats[key].messages.slice(-1)[0]?.text}</div>
                        </div>
                    </div>
                ))}
            </aside>
            <div className="chat-window">
                 <div className="forum-header" style={{borderRadius: 'var(--border-radius) var(--border-radius) 0 0'}}>
                    <div className="post-author-info">
                         <div className="post-author-avatar">{activeChat.initials}</div>
                         <h2 style={{fontSize: '1.2rem'}}>{activeContactKey}</h2>
                    </div>
                 </div>
                 <div className="chat-container">
                    <div className="chat-messages">
                        {activeChat.messages.map((msg, i) => (
                             <div key={i} className={`chat-bubble ${msg.sender === 'You' ? 'sent' : 'received'}`}>
                                <div className="message-sender">{msg.sender}</div>
                                <div className="message-text">{msg.text}</div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="chat-input-area">
                        <input value={newMessage} onChange={e => setNewMessage(e.target.value)} type="text" placeholder="Type your message..." onKeyPress={e => e.key === 'Enter' && handleSendMessage()} />
                        <button className="button" onClick={handleSendMessage}>Send</button>
                    </div>
                </div>
            </div>
        </div>
    );
};


const ForumView = ({ user }) => {
    const [view, setView] = useState('main'); // 'main', 'community', 'chat', 'post', 'article'
    const [articles, setArticles] = useState(forumArticlesData);
    const [activeChat, setActiveChat] = useState(null);
    const [chats, setChats] = useState(technicalChatsData);
    const [posts, setPosts] = useState(forumPostsData);
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [selectedArticleId, setSelectedArticleId] = useState(null);
    const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
    const [newReplyText, setNewReplyText] = useState('');
    
    const handleVote = (postId, direction) => {
        setPosts(posts.map(p => {
            if (p.id === postId) {
                return { ...p, votes: direction === 'up' ? p.votes + 1 : p.votes - 1 };
            }
            return p;
        }));
    };

    const handleReplySubmit = (e) => {
        e.preventDefault();
        if (newReplyText.trim() === '') return;

        const newReply = {
            author: user.name,
            authorInitials: user.initials,
            time: 'Just now',
            text: newReplyText.trim()
        };

        setPosts(posts.map(post => {
            if (post.id === selectedPostId) {
                const updatedReplies = [...post.replies, newReply];
                return { ...post, replies: updatedReplies, answers: updatedReplies.length };
            }
            return post;
        }));

        setNewReplyText('');
    };

    const MainForum = () => (
        <div className="forum-main-content">
             <div className="forum-header">
                <input type="text" placeholder="Search articles..." className="forum-search-input" />
                <button className="button">✏ New Article</button>
            </div>
            <div className="forum-article-list">
                {articles.map(article => (
                     <div key={article.id} className="forum-article-card" onClick={() => { setSelectedArticleId(article.id); setView('article'); }}>
                        <h3 className="post-title-link">{article.title}</h3>
                        <p className="post-excerpt">{article.content.substring(0,100)}...</p>
                        <div className="post-meta" style={{marginTop: '1rem'}}>
                             <div className="post-author-info">
                                <span>👤 {article.author}</span>
                                <span>• {article.date}</span>
                            </div>
                            <div className="post-stats">
                                <span>👍 {article.likes}</span>
                                <span>👁 {article.views}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const CommunityDiscussion = () => (
        <div className="forum-main-content">
            <div className="forum-header">
                <div>
                    <h2>Community Discussion</h2>
                    <p>Share problems, ask questions, and help fellow developers</p>
                </div>
                <button className="button" onClick={() => setIsNewPostModalOpen(true)}>+ New Post</button>
            </div>
             <div className="community-posts-list">
                {posts.map(post => (
                    <div key={post.id} className="community-post-card" onClick={() => { setSelectedPostId(post.id); setView('post'); }}>
                        <div className="vote-section">
                            <button onClick={(e) => { e.stopPropagation(); handleVote(post.id, 'up'); }}>▲</button>
                            <span>{post.votes}</span>
                            <button onClick={(e) => { e.stopPropagation(); handleVote(post.id, 'down'); }}>▼</button>
                        </div>
                        <div className="post-content">
                            <div className="post-tags">
                                <span className={`post-tag-type type-${post.type.toLowerCase()}`}>{post.type}</span>
                                {post.tags.map(tag => <span key={tag} className="post-tag-topic">{tag}</span>)}
                                {post.hot && <span className="post-tag-special hot">🔥 Hot</span>}
                                {post.featured && <span className="post-tag-special featured">⭐ Featured</span>}
                            </div>
                            <h3 className="post-title-link">{post.title}</h3>
                            <p className="post-excerpt">{post.content}</p>
                            {post.codeSnippet && <pre className="post-code-snippet"><code>{post.codeSnippet}</code></pre>}
                            <div className="post-meta">
                                <div className="post-author-info">
                                    <div className="post-author-avatar">{post.authorInitials}</div>
                                    <span>{post.author}</span>
                                    <span>• {post.time}</span>
                                </div>
                                <div className="post-stats">
                                    <span>💬 {post.answers} answers</span>
                                    <span>👁 {post.views} views</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
    
    const PostDetailView = ({ post }) => (
        <div className="forum-main-content">
            <div className="forum-header">
                <button className="button button-secondary" onClick={() => setView('community')}>← Back to Discussions</button>
            </div>
            <div className="post-detail-container">
                <div className="community-post-card">
                    <div className="vote-section">
                        <button onClick={(e) => { e.stopPropagation(); handleVote(post.id, 'up'); }}>▲</button>
                        <span>{post.votes}</span>
                        <button onClick={(e) => { e.stopPropagation(); handleVote(post.id, 'down'); }}>▼</button>
                    </div>
                    <div className="post-content">
                        <div className="post-tags">
                            <span className={`post-tag-type type-${post.type.toLowerCase()}`}>{post.type}</span>
                            {post.tags.map(tag => <span key={tag} className="post-tag-topic">{tag}</span>)}
                        </div>
                        <h2 className="post-title-full">{post.title}</h2>
                        <div className="post-meta" style={{marginBottom: '1rem'}}>
                            <div className="post-author-info">
                                <div className="post-author-avatar">{post.authorInitials}</div>
                                <span>{post.author}</span>
                                <span>• {post.time}</span>
                            </div>
                        </div>
                        <p className="post-body">{post.content}</p>
                         {post.codeSnippet && <pre className="post-code-snippet"><code>{post.codeSnippet}</code></pre>}
                    </div>
                </div>
            </div>
            <div className="post-replies-section">
                <h3>{post.replies.length} Answers</h3>
                {post.replies.map((reply, i) => (
                    <div key={i} className="reply-card">
                        <div className="post-author-info">
                            <div className="post-author-avatar">{reply.authorInitials}</div>
                            <div>
                                <span>{reply.author}</span>
                                <span className="reply-time">• {reply.time}</span>
                            </div>
                        </div>
                        <p className="reply-text">{reply.text}</p>
                    </div>
                ))}
            </div>
             <form className="reply-form-card" onSubmit={handleReplySubmit}>
                <h3>Your Answer</h3>
                <textarea 
                    value={newReplyText} 
                    onChange={e => setNewReplyText(e.target.value)} 
                    placeholder="Type your answer here..."
                    required
                ></textarea>
                <button type="submit" className="button">Post Your Answer</button>
            </form>
        </div>
    );
    
    const ArticleDetailView = ({ article }) => {
        const [newComment, setNewComment] = useState('');

        const handleCommentSubmit = (e) => {
            e.preventDefault();
            if(newComment.trim() === '') return;
            
            const comment = { author: user.name, text: newComment };
            const updatedArticles = articles.map(a => {
                if (a.id === article.id) {
                    return { ...a, comments: [...a.comments, comment] };
                }
                return a;
            });
            setArticles(updatedArticles);
            setNewComment('');
        };
        
        return (
            <div className="forum-main-content article-detail-view">
                 <div className="forum-header">
                    <button className="button button-secondary" onClick={() => setView('main')}>← Back to Articles</button>
                </div>
                <div className="profile-card">
                    <h1 className="article-title">{article.title}</h1>
                     <div className="post-meta" style={{marginBottom: '2rem'}}>
                         <div className="post-author-info">
                            <span>👤 {article.author}</span>
                            <span>• {article.date}</span>
                        </div>
                        <div className="post-stats">
                            <span>👍 {article.likes}</span>
                            <span>👁 {article.views}</span>
                        </div>
                    </div>
                    <div className="article-content">
                        <p>{article.content}</p>
                    </div>
                </div>
                 <div className="post-replies-section">
                    <h3>{article.comments.length} Comments</h3>
                    {article.comments.map((comment, i) => (
                        <div key={i} className="reply-card">
                           <div className="post-author-info">
                                <div className="post-author-avatar">{comment.author.substring(0,2)}</div>
                                <div>
                                    <span>{comment.author}</span>
                                </div>
                            </div>
                            <p className="reply-text">{comment.text}</p>
                        </div>
                    ))}
                     <form className="reply-form-card" style={{marginTop: '1.5rem'}} onSubmit={handleCommentSubmit}>
                        <h3>Leave a Comment</h3>
                        <textarea value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="Type your comment here..." required></textarea>
                        <button type="submit" className="button">Post Comment</button>
                    </form>
                </div>
            </div>
        );
    }


    const ChatInterface = () => {
        const [newMessage, setNewMessage] = useState('');

        const handleSendMessage = () => {
            if (newMessage.trim() !== '') {
                const message = { sender: 'You', text: newMessage.trim() };
                const updatedChats = { ...chats };
                updatedChats[activeChat].messages.push(message);
                setChats(updatedChats);
                setNewMessage('');
            }
        };

        return (
            <div className="forum-main-content">
                <div className="forum-header">
                    <div>
                        <h2>{chats[activeChat].name} Chat</h2>
                        <p>12 Users Online</p>
                    </div>
                     <button className="button button-secondary" onClick={() => { setView('main'); setActiveChat(null); }}>← Back to Forum</button>
                </div>
                <div className="chat-container">
                    <div className="chat-messages">
                        {chats[activeChat].messages.map((msg, i) => (
                             <div key={i} className={`chat-bubble ${msg.sender === 'You' ? 'sent' : 'received'}`}>
                                <div className="message-sender">{msg.sender}</div>
                                <div className="message-text">{msg.text}</div>
                            </div>
                        ))}
                    </div>
                    <div className="chat-input-area">
                        <input value={newMessage} onChange={e => setNewMessage(e.target.value)} type="text" placeholder="Type your message..." onKeyPress={e => e.key === 'Enter' && handleSendMessage()} />
                        <button className="button" onClick={handleSendMessage}>Send</button>
                    </div>
                </div>
            </div>
        );
    }
    
    const NewPostModal = () => (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>Create New Post</h3>
                    <button onClick={() => setIsNewPostModalOpen(false)} className="close-button">&times;</button>
                </div>
                <div className="modal-body">
                    {/* Simplified form for demo */}
                    <input type="text" placeholder="Title" className="modal-input"/>
                    <textarea placeholder="Description..." className="modal-textarea"></textarea>
                </div>
                <div className="modal-footer">
                    <button className="button button-secondary" onClick={() => setIsNewPostModalOpen(false)}>Cancel</button>
                    <button className="button" onClick={() => { alert("Post submitted!"); setIsNewPostModalOpen(false); }}>Post</button>
                </div>
            </div>
        </div>
    );

    const renderContent = () => {
        if (activeChat) return <ChatInterface />;
        const selectedPost = posts.find(p => p.id === selectedPostId);
        const selectedArticle = articles.find(a => a.id === selectedArticleId);

        switch (view) {
            case 'community': return <CommunityDiscussion />;
            case 'post': return selectedPost ? <PostDetailView post={selectedPost} /> : <CommunityDiscussion />;
            case 'article': return selectedArticle ? <ArticleDetailView article={selectedArticle} /> : <MainForum />;
            case 'main':
            default: return <MainForum />;
        }
    };
    
    return (
        <div className="forum-layout">
            <aside className="forum-sidebar">
                <h3>Categories</h3>
                <button className={`forum-nav-button ${view === 'main' || view === 'article' ? 'active' : ''}`} onClick={() => { setView('main'); setActiveChat(null); }}>Articles</button>
                <button className={`forum-nav-button ${view === 'community' || view === 'post' ? 'active' : ''}`} onClick={() => { setView('community'); setActiveChat(null); }}>Community Discussion</button>
                <div className="forum-nav-divider">Technical Groups</div>
                {Object.keys(chats).map(key => (
                    <button key={key} className={`forum-nav-button sub-item ${activeChat === key ? 'active' : ''}`} onClick={() => setActiveChat(key)}>{chats[key].name}</button>
                ))}
            </aside>
            {renderContent()}
            {isNewPostModalOpen && <NewPostModal />}
        </div>
    );
};


// --- TEACHER VIEWS ---

const TeacherDashboard = () => {
    const totalStudents = Object.values(teacherDetailedStudents).flat().length;
    const avgProgress = Math.round(Object.values(teacherDetailedStudents).flat().reduce((acc, s) => acc + s.courseProgress, 0) / totalStudents);
    const pendingReviews = submissionsData.filter(s => s.status === 'Submitted').length;

    return (
        <div>
            <div className="view-header">
                <h1 className="view-title">Dashboard</h1>
                <p className="view-subtitle">Welcome, {mockUsers.teacher.name}! Here's a summary of your classes.</p>
            </div>
             <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon-wrapper enrolled">👥</div>
                    <div>
                        <p className="stat-label">Total Students</p>
                        <p className="stat-value">{totalStudents}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon-wrapper hours">📊</div>
                    <div>
                        <p className="stat-label">Avg. Progress</p>
                        <p className="stat-value">{avgProgress}%</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon-wrapper certificates">📚</div>
                    <div>
                        <p className="stat-label">Total Groups</p>
                        <p className="stat-value">{teacherGroupsData.length}</p>
                    </div>
                </div>
                 <div className="stat-card">
                    <div className="stat-icon-wrapper completed">📝</div>
                    <div>
                        <p className="stat-label">Pending Reviews</p>
                        <p className="stat-value">{pendingReviews}</p>
                    </div>
                </div>
            </div>
            <div className="profile-grid-2-col" style={{marginTop: '2rem'}}>
                 <div className="profile-card">
                    <h3>Recent Submissions</h3>
                    <div className="grading-list">
                        {submissionsData.slice(0, 3).map(sub => (
                             <div key={sub.id} className="submission-card-sm">
                                <p><strong>{sub.assignment}</strong> by {sub.studentName}</p>
                                {sub.status === 'Submitted' ? <span className="assignment-status submitted">Needs Grading</span> : <span className="assignment-status graded">Graded: {sub.grade}</span>}
                             </div>
                        ))}
                    </div>
                </div>
                 <div className="profile-card">
                    <h3>Quick Actions</h3>
                     <div className="parent-actions-grid">
                        <button className="parent-action-btn">
                            <div className="parent-action-icon">👥</div>
                            <span>Manage Students</span>
                        </button>
                        <button className="parent-action-btn">
                            <div className="parent-action-icon">📝</div>
                            <span>Create Assignment</span>
                        </button>
                        <button className="parent-action-btn">
                            <div className="parent-action-icon">💬</div>
                            <span>Send Announcement</span>
                        </button>
                         <button className="parent-action-btn">
                            <div className="parent-action-icon">📊</div>
                            <span>View Reports</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


const TeacherGroupsView = ({ onSelectGroup }) => {
    return (
        <div>
            <div className="view-header">
                <h1 className="view-title">Groups</h1>
                <p className="view-subtitle">Select a group to view the student roster and their progress.</p>
            </div>
            <div className="teacher-groups-grid">
                {teacherGroupsData.map(group => (
                    <div key={group.id} className="teacher-group-card" onClick={() => onSelectGroup(group)}>
                        <div className="group-icon">{group.icon}</div>
                        <h3 className="group-name">{group.name}</h3>
                        <p className="group-members">{group.members} Students</p>
                        <div className="button button-secondary">View Roster</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const TeacherStudentsView = ({ group, students, onSelectStudent, onBack }) => {
    const getStatusIndicator = (status) => {
        if (status === 'Active') return <><div className="status-dot active"></div><span className="status-text active">Active</span></>;
        if (status === 'Needs Attention') return <><div className="status-dot attention"></div><span className="status-text attention">Needs Attention</span></>;
        return <><div className="status-dot inactive"></div><span className="status-text inactive">Inactive</span></>;
    };
    
    return (
        <div>
            <div className="view-header">
                {onBack && <button onClick={onBack} className="button button-secondary back-button">← Back to Groups</button>}
                <h1 className="view-title">Student Roster: {group.name}</h1>
                <p className="view-subtitle">An overview of student activity and performance in this group.</p>
            </div>
            <div className="teacher-students-grid">
                {students.map(student => (
                    <div key={student.id} className="teacher-student-card" onClick={() => onSelectStudent(student)}>
                        <div className="tsc-header">
                            <div className="tsc-avatar">{student.avatar}</div>
                            <div className="tsc-info">
                                <h3 className="tsc-name">{student.name}</h3>
                                <p className="tsc-id">{student.studentId}</p>
                                <div className="tsc-status">{getStatusIndicator(student.status)}</div>
                            </div>
                        </div>
                        <div className="tsc-body">
                             <div className="progress-labels">
                                <span className="tsc-course-name">{student.course}</span>
                                <span className="tsc-progress-percent">{student.courseProgress}%</span>
                            </div>
                            <div className="progress-bar-bg">
                                <div className="progress-bar" style={{ width: `${student.courseProgress}%`}}></div>
                            </div>
                        </div>
                        <div className="tsc-footer">
                            <span>Overall Grade</span>
                            <span className="tsc-grade">{student.overallGrade}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const TeacherStudentDetailView = ({ student, onBack }) => {
    
    const getGradePill = (status) => {
        if (status === 'completed') return <span className="grade-pill completed">Completed</span>
        if (status === 'pending') return <span className="grade-pill pending">Pending</span>
        if (status === 'missing') return <span className="grade-pill missing">Missing</span>
        if (status === 'overdue') return <span className="grade-pill overdue">Overdue</span>
        return null;
    }
    
    return (
         <div className="ts-detail-container">
            <div className="view-header">
                <button onClick={onBack} className="button button-secondary back-button">← Back to Roster</button>
                <h1 className="view-title">{student.name}'s Profile</h1>
                <p className="view-subtitle">{student.studentId} • Complete Student Information</p>
            </div>

            <div className="profile-card tsc-overview-card">
                 <div className="tsc-overview-header">
                    <div className="tsc-overview-avatar">{student.avatar}</div>
                    <div className="tsc-overview-info">
                        <h2 className="tsc-overview-name">{student.name}</h2>
                        <p className="tsc-overview-course">{student.course}</p>
                        <div className="tsc-status">
                            <div className={`status-dot ${student.status === 'Active' ? 'active' : 'attention'}`}></div>
                            <span className={`status-text ${student.status === 'Active' ? 'active' : 'attention'}`}>{student.status}</span>
                            <span className="tsc-last-active">• Last active: {student.lastActive}</span>
                        </div>
                    </div>
                    <div className="tsc-overview-grade">
                        <div className="grade-value">{student.overallGrade}</div>
                        <div className="grade-label">Overall Grade</div>
                    </div>
                </div>
                <div className="tsc-overview-progress">
                    <div className="progress-labels">
                        <span style={{fontWeight: 600}}>Course Progress</span>
                        <span>{student.courseProgress}%</span>
                    </div>
                    <div className="progress-bar-bg" style={{height: '1rem'}}>
                        <div className="progress-bar" style={{ width: `${student.courseProgress}%`, height: '1rem' }}></div>
                    </div>
                </div>
            </div>

            <div className="profile-grid-2-col">
                <div className="profile-card">
                    <h3>Contact Information</h3>
                     <ul className="ts-contact-list">
                        <li><strong>Email:</strong> {student.email}</li>
                        <li><strong>Phone:</strong> {student.phone}</li>
                        <li><strong>Attendance:</strong> {student.attendance}%</li>
                    </ul>
                </div>
                <div className="profile-card">
                    <h3>Performance Analytics</h3>
                    <div className="ts-analytics">
                        <div className="ts-analytics-item">
                             <div className="progress-labels">
                                <span>Quiz Average</span>
                                <span>{student.quizzes.average}%</span>
                            </div>
                            <div className="progress-bar-bg"><div className="progress-bar" style={{width: `${student.quizzes.average}%`}}></div></div>
                        </div>
                        <div className="ts-analytics-item">
                             <div className="progress-labels">
                                <span>Project Average</span>
                                <span>{student.projects.average}%</span>
                            </div>
                            <div className="progress-bar-bg"><div className="progress-bar" style={{width: `${student.projects.average}%`}}></div></div>
                        </div>
                         <div className="ts-analytics-item">
                             <div className="progress-labels">
                                <span>Assignment Average</span>
                                <span>{student.assignments.average}%</span>
                            </div>
                            <div className="progress-bar-bg"><div className="progress-bar" style={{width: `${student.assignments.average}%`}}></div></div>
                        </div>
                    </div>
                </div>
            </div>
             <div className="profile-card">
                <h3>Recent Activity & Grades</h3>
                <table className="ts-grades-table">
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Name</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {student.detailedGrades.map((item, i) => (
                            <tr key={i}>
                                <td>{item.type}</td>
                                <td>{item.name}</td>
                                <td>{item.date}</td>
                                <td>{getGradePill(item.status)}</td>
                                <td className="grade-score">{item.score > 0 ? `${item.score}%` : 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const GradingView = () => {
    const [submissions, setSubmissions] = useState(submissionsData);
    
    const handleGrade = (id, grade) => {
        if(grade) {
            const updatedSubmissions = submissions.map(s => s.id === id ? {...s, grade, status: 'Graded'} : s);
            setSubmissions(updatedSubmissions);
        }
    }
    
    return (
        <div>
            <div className="view-header">
                <h1 className="view-title">Grade Assignments</h1>
                <p className="view-subtitle">Review submissions and provide feedback.</p>
            </div>
            <div className="grading-list">
                {submissions.map(sub => (
                    <div key={sub.id} className="submission-card">
                        <div className="submission-details">
                            <p className="submission-assignment">{sub.assignment}</p>
                            <p className="submission-student">Student: {sub.studentName}</p>
                        </div>
                        <div className="submission-grading">
                            {sub.status === 'Graded' ? (
                                <p className="grade-display">Grade: <strong>{sub.grade}</strong></p>
                            ) : (
                                <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => { e.preventDefault(); handleGrade(sub.id, (e.currentTarget.elements.namedItem('grade') as HTMLInputElement).value); }}>
                                    <input type="text" name="grade" placeholder="e.g., A+" required/>
                                    <button type="submit" className="button">Submit Grade</button>
                                </form>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
};

// --- PARENT VIEWS ---

const ParentDashboard = () => {
    const data = parentPortalData;

    const viewChild = (childName) => alert(`Viewing detailed profile for ${childName}`);
    const viewGrades = () => alert('Opening detailed grade reports for all children...');
    const messageTeacher = () => alert('Opening messaging interface to contact teachers...');
    const scheduleConference = () => alert('Opening conference scheduling system...');
    const viewAttendance = () => alert('Displaying attendance records for all children...');
    
    return (
        <div className="parent-dashboard-container">
            <div className="floating-shapes">
                <div className="shape s1"></div>
                <div className="shape s2"></div>
                <div className="shape s3"></div>
            </div>

            <div className="parent-dashboard-content">
                <div className="parent-card fade-in" style={{ marginBottom: '1.5rem' }}>
                    <div className="parent-welcome-header">
                        <div>
                            <h2 className="parent-welcome-title">Welcome, {data.parentName}</h2>
                            <p className="parent-welcome-subtitle">Monitor your children's academic progress and stay connected.</p>
                        </div>
                        <div className="parent-badge">
                            👨‍👩‍👧‍👦 Parent Account
                        </div>
                    </div>
                </div>

                <div className="parent-children-overview">
                    {data.children.map(child => (
                        <div key={child.id} className="child-card parent-card fade-in" onClick={() => viewChild(child.name)}>
                            <div className="child-card-header">
                                <div className="child-card-avatar">{child.initials}</div>
                                <div>
                                    <h3 className="child-card-name">{child.name}</h3>
                                    <p className="child-card-track">{child.grade} • {child.track}</p>
                                </div>
                            </div>
                            <div className="child-card-stats">
                                <div className="child-stat">
                                    <div className="child-stat-value">{child.gpa}</div>
                                    <p className="child-stat-label">GPA</p>
                                </div>
                                <div className="child-stat">
                                    <div className="child-stat-value">{child.attendance}%</div>
                                    <p className="child-stat-label">Attendance</p>
                                </div>
                                <div className="child-stat">
                                    <div className="child-stat-value">{child.assignments}</div>
                                    <p className="child-stat-label">Assignments</p>
                                </div>
                            </div>
                             <div className="progress-container" style={{marginBottom: '0'}}>
                                <div className="progress-labels">
                                    <span>Overall Progress</span>
                                    <span style={{ color: child.progressStatus === 'Excellent' ? '#10b981' : '#3b82f6'}}>{child.progressStatus}</span>
                                </div>
                                <div className="progress-bar-bg">
                                    <div className="parent-progress-bar" style={{ width: `${child.progressPercent}%` }}></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="parent-quick-stats">
                    <div className="parent-stat-card parent-card slide-in">
                        <div className="parent-stat-value">{data.stats.activeStudents}</div>
                        <p>Active Students</p>
                    </div>
                    <div className="parent-stat-card parent-card slide-in" style={{animationDelay: '0.1s'}}>
                        <div className="parent-stat-value">{data.stats.totalCourses}</div>
                        <p>Total Courses</p>
                    </div>
                    <div className="parent-stat-card parent-card slide-in" style={{animationDelay: '0.2s'}}>
                        <div className="parent-stat-value">{data.stats.avgAttendance}</div>
                        <p>Avg Attendance</p>
                    </div>
                    <div className="parent-stat-card parent-card slide-in" style={{animationDelay: '0.3s'}}>
                        <div className="parent-stat-value">{data.stats.newMessages}</div>
                        <p>New Messages</p>
                    </div>
                </div>

                <div className="parent-main-grid">
                    <div className="parent-card fade-in">
                        <h3 className="parent-card-title">Recent Activity</h3>
                        <div className="parent-activity-feed">
                            {data.recentActivity.map((item, index) => (
                                <div key={index} className={`parent-activity-item color-bg-${item.color}`}>
                                    <div className={`parent-activity-icon color-icon-${item.color}`}>{item.icon}</div>
                                    <div>
                                        <h4 className="parent-activity-title">{item.title}</h4>
                                        <p className="parent-activity-desc">{item.description}</p>
                                        <p className="parent-activity-time">{item.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="parent-card fade-in">
                        <h3 className="parent-card-title">Messages & Events</h3>
                         <div className="parent-events-feed">
                            {data.events.map((item, index) => (
                                <div key={index} className={`parent-event-item border-${item.color}`}>
                                    <h4>{item.title}</h4>
                                    <p>{item.description}</p>
                                    <p className="parent-event-meta">{item.meta}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="parent-card fade-in" style={{marginTop: '1.5rem'}}>
                    <h3 className="parent-card-title">Academic Performance Overview</h3>
                    <div className="parent-performance-grid">
                        {data.children.map(child => (
                             <div key={child.id}>
                                <h4>{child.name} - {child.grade}</h4>
                                <div className="parent-course-list">
                                    {child.courses.map((course, index) => (
                                        <div key={index}>
                                            <div className="progress-labels">
                                                <span>{course.name}</span>
                                                <span style={{color: '#059669', fontWeight: '500'}}>{course.grade} ({course.percent}%)</span>
                                            </div>
                                            <div className="progress-bar-bg">
                                                <div className="parent-progress-bar" style={{ width: `${course.percent}%` }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="parent-card fade-in" style={{marginTop: '1.5rem'}}>
                    <h3 className="parent-card-title">Quick Actions</h3>
                    <div className="parent-actions-grid">
                        <button onClick={viewGrades} className="parent-action-btn">
                            <div className="parent-action-icon">📊</div>
                            <span>View Grades</span>
                        </button>
                        <button onClick={messageTeacher} className="parent-action-btn">
                            <div className="parent-action-icon">💬</div>
                            <span>Message Teacher</span>
                        </button>
                        <button onClick={scheduleConference} className="parent-action-btn">
                            <div className="parent-action-icon">📅</div>
                            <span>Schedule Meeting</span>
                        </button>
                         <button onClick={viewAttendance} className="parent-action-btn">
                            <div className="parent-action-icon">📋</div>
                            <span>Attendance</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ParentProfileView = () => {
    const data = parentPortalData;
    return (
        <div>
            <div className="view-header">
                <h1 className="view-title">Parent Profile</h1>
                <p className="view-subtitle">Manage your account information and linked students.</p>
            </div>
            <div className="profile-grid-2-col">
                <div className="profile-card">
                    <h3>Personal Information</h3>
                     <form className="parent-profile-form">
                        <div className="input-group">
                            <label>Full Name</label>
                            <input type="text" value={data.parentName} readOnly/>
                        </div>
                        <div className="input-group">
                            <label>Email Address</label>
                            <input type="email" value={data.email} readOnly/>
                        </div>
                         <div className="input-group">
                            <label>Phone Number</label>
                            <input type="tel" value={data.phone} readOnly/>
                        </div>
                         <div className="input-group">
                            <label>Address</label>
                            <input type="text" value={data.address} readOnly/>
                        </div>
                        <button className="button" style={{marginTop: '1rem'}}>Update Information</button>
                    </form>
                </div>
                 <div className="profile-card">
                    <h3>Linked Children</h3>
                    <div className="parent-children-list">
                        {data.children.map(child => (
                             <div key={child.id} className="child-card-sm">
                                <div className="child-card-avatar">{child.initials}</div>
                                <div>
                                    <h4>{child.name}</h4>
                                    <p>{child.grade} • {child.track}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- SHARED COMPONENTS ---

const AIChatView = ({ role, systemInstruction, welcomeMessage, promptSuggestions }) => {
    const chatRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const [messages, setMessages] = useState([{ sender: 'AI', text: welcomeMessage }]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(() => {
        // Initialize the chat session when the component mounts
        const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: { systemInstruction }
        });
        chatRef.current = chat;
    }, [systemInstruction]);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async (prompt) => {
        const messageText = typeof prompt === 'string' ? prompt : input;
        if (messageText.trim() === '' || isLoading) return;

        setInput('');
        setIsLoading(true);
        setMessages(prev => [...prev, { sender: 'You', text: messageText }]);

        try {
            if (chatRef.current) {
                const response = await chatRef.current.sendMessage({ message: messageText });
                setMessages(prev => [...prev, { sender: 'AI', text: response.text }]);
            }
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages(prev => [...prev, { sender: 'AI', text: "Sorry, I encountered an error. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="ai-chat-view-layout">
            <div className="ai-chat-container">
                <div className="ai-chat-messages">
                    {messages.map((msg, i) => (
                        <div key={i} className={`ai-chat-bubble ${msg.sender === 'You' ? 'user' : 'ai'}`}>
                             <div className="ai-chat-avatar">{msg.sender === 'You' ? 'You' : 'AI'}</div>
                             <div className="ai-chat-message-content">
                                {msg.text.split('```').map((part, index) => {
                                    if (index % 2 === 1) {
                                        return <pre key={index}><code>{part}</code></pre>
                                    }
                                    return <p key={index}>{part}</p>
                                })}
                            </div>
                        </div>
                    ))}
                     {isLoading && (
                        <div className="ai-chat-bubble ai">
                            <div className="ai-chat-avatar">AI</div>
                            <div className="ai-chat-message-content">
                               <div className="loading-indicator">
                                   <span></span><span></span><span></span>
                               </div>
                            </div>
                        </div>
                    )}
                    {messages.length === 1 && !isLoading && (
                         <div className="ai-chat-welcome">
                            <h3>Welcome to your AI {role}!</h3>
                            <p>Here are a few things you can ask me:</p>
                            <div className="ai-prompt-suggestions">
                                {promptSuggestions.map((prompt, i) => (
                                    <button key={i} onClick={() => handleSendMessage(prompt)}>{prompt}</button>
                                ))}
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                 <div className="ai-chat-input-area">
                    {/* FIX: Pass null to handleSendMessage to satisfy expected arguments. The function is designed to fall back to the input state if the prompt is not a string. */}
                    <input 
                        value={input} 
                        onChange={e => setInput(e.target.value)} 
                        type="text" 
                        placeholder={`Ask your AI ${role}...`}
                        onKeyPress={e => e.key === 'Enter' && handleSendMessage(null)}
                        disabled={isLoading}
                    />
                    {/* FIX: Pass null to handleSendMessage to satisfy expected arguments. The function is designed to fall back to the input state if the prompt is not a string. */}
                    <button className="button" onClick={() => handleSendMessage(null)} disabled={isLoading}>
                        {isLoading ? 'Thinking...' : 'Send'}
                    </button>
                </div>
            </div>
        </div>
    );
};


const Sidebar = ({ user, onNavigate, currentView, onLogout, theme, toggleTheme }) => {
    const navConfig = {
      Student: [
        { id: 'my-course', label: 'My Courses', icon: <IconMyCourse /> },
        { id: 'assignments', label: 'Assignments', icon: <IconAssignments /> },
        { id: 'quizzes', label: 'Quizzes', icon: <IconQuizzes /> },
        { id: 'forum', label: 'Forum', icon: <IconForum /> },
        { id: 'chat', label: 'Chat', icon: <IconChat /> },
        { id: 'ai-tutor', label: 'AI Tutor', icon: <IconAIAssistant /> },
        { id: 'profile', label: 'Profile', icon: <IconProfile /> },
      ],
      Teacher: [
        // This is now handled by TeacherLayout
      ],
      Parent: [
        { id: 'dashboard', label: 'Dashboard', icon: <IconMyCourse /> },
        { id: 'messages', label: 'Messages', icon: <IconChat /> },
        { id: 'profile', label: 'Profile', icon: <IconProfile /> },
      ]
    };

    const navItems = navConfig[user.role] || [];
    
    if (user.role === 'Teacher') {
        return null; // The new TeacherLayout handles its own navigation.
    }

    return (
        <aside className="sidebar">
            <div className="sidebar-main-content">
                <div className="logo">
                    <div className="logo-icon">🎓</div>
                    <h1>EduPersonalize</h1>
                </div>
                
                <nav>
                    <ul>
                        {navItems.map(item => (
                            <li key={item.id}>
                                <a href="#" onClick={(e) => { e.preventDefault(); onNavigate(item.id); }} className={currentView === item.id ? 'active' : ''}>
                                    <span className="nav-icon">{item.icon}</span>
                                    <span className="nav-label">{item.label}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
            <div className="sidebar-footer">
                <button onClick={toggleTheme} className="theme-toggle" aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
                    <IconTheme theme={theme} />
                    <span className="nav-label">Toggle Theme</span>
                </button>
                <div className="user-profile-sidebar">
                    <div className="user-avatar">{user.initials}</div>
                    <div className="user-details">
                        <span className="user-name">{user.name}</span>
                        <span className="user-role">{user.role}</span>
                    </div>
                </div>
                 <button onClick={onLogout} className="logout-button">
                    <IconLogout />
                    <span className="nav-label">Logout</span>
                </button>
            </div>
        </aside>
    );
};

const root = createRoot(document.getElementById('root'));
root.render(<App />);