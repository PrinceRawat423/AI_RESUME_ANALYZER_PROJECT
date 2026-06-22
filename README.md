# AI Resume Analyzer & Interview Coach

## Requirements

- Node.js 18 or newer
- MongoDB running locally or a MongoDB Atlas URI
- Gemini API key if you want AI-generated suggestions and interview answers

## Setup

1. Open a terminal in the `ai-resume-analyzer` folder.
2. Install all dependencies from the root:
   `npm install`
3. Create backend `.env` file inside `backend/`:
   `PORT=5000`
   `MONGODB_URI=mongodb://127.0.0.1:27017/ai_resume_analyzer`
   `JWT_SECRET=your_secret_key`
   `GEMINI_API_KEY=your_gemini_api_key`
4. Create frontend `.env` file inside `frontend/`:
   `VITE_API_BASE_URL=http://localhost:5000/api`
5. Start both backend and frontend together:
   `npm run dev`

## Open in Browser

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## Features

- Register and login with JWT
- Upload PDF resumes
- Extract resume text with `pdf-parse`
- ATS scoring
- Skill extraction
- Missing skill suggestions
- Interview questions
- AI chatbot
- Analysis history

## Folder Structure

- `frontend/` React app
- `backend/` Express API
- `backend/uploads/` saved PDFs
