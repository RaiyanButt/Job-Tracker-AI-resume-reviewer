# Job Tracker AI Resume Reviewer

A full-stack web application for managing job applications with an integrated AI-powered resume reviewer. Built with the MERN stack and deployed on Render.

🔗 **Live Demo:** [job-tracker-ai-resume-reviewer.onrender.com](https://job-tracker-ai-resume-reviewer.onrender.com)

---

## Features

- **Job Application Tracking** — Add, update, and delete job applications with status and priority tracking
- **Search & Filtering** — Filter applications by status, priority, and other fields
- **AI Resume Reviewer** — Upload your resume and get automated feedback powered by the OpenAI API
- **JWT Authentication** — Secure user accounts with token-based auth
- **Rate Limiting** — Redis-based rate limiting to protect the backend
- **CI/CD Pipeline** — Automated deployment via Render on every push to main

---

## Tech Stack

**Frontend**
- React
- JavaScript / HTML / CSS

**Backend**
- Node.js
- Express.js
- MongoDB (Mongoose)
- Redis (rate limiting)
- JWT (authentication)

**APIs & Tools**
- OpenAI API (resume analysis & feedback)
- Git / GitHub
- Render (cloud deployment)
- CI/CD pipelines

---

## Getting Started

### Prerequisites
- Node.js
- MongoDB Atlas account
- OpenAI API key
- Redis instance

### Installation

1. Clone the repo
```bash
git clone https://github.com/RaiyanButt/Job-Tracker-AI-resume-reviewer.git
cd Job-Tracker-AI-resume-reviewer
```

2. Install dependencies
```bash
npm install
cd backend && npm install
```

3. Create a `.env` file in the `backend` folder
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
PORT=5001
```

4. Run the app locally
```bash
npm run start
```

---

## Project Structure

```
Job-Tracker-AI-resume-reviewer/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js
│   │   │   └── upstash.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   └── jobsController.js
│   │   ├── middleware/
│   │   │   ├── rateLimiter.js
│   │   │   └── requireAuth.js
│   │   ├── models/
│   │   │   ├── Job.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── aiRoutes.js
│   │   │   ├── authRoutes.js
│   │   │   ├── jobsRoutes.js
│   │   │   └── uploadRoutes.js
│   │   └── app.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Filterbar.jsx
│   │   │   ├── JobsNotFound.jsx
│   │   │   ├── JobsTable.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── RateLimitedUI.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── lib/
│   │   │   ├── axios.js
│   │   │   └── utils.jsx
│   │   ├── pages/
│   │   │   ├── AIAssistant.jsx
│   │   │   ├── CreatePage.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── JobDetailPage.jsx
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   └── RegisterPage.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── README.md
```

---

## Author

**Raiyan Butt**  
[LinkedIn](https://linkedin.com/in/raiyanbutt) • [GitHub](https://github.com/RaiyanButt)
