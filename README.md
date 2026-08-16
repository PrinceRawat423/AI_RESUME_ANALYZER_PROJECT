# AI Resume Analyzer

**A production-ready full-stack web application that helps job candidates identify skill gaps, optimize resumes for ATS systems, and prepare for interviews—all powered by resume parsing, skill extraction, and optional Gemini-powered AI coaching.**

### The Problem

Candidates submit hundreds of resumes but rarely receive actionable feedback. They don't know:
- ❌ How many job-required skills they're missing
- ❌ Whether their resume will pass ATS screening
- ❌ What specific improvements to make before reapplying
- ❌ How to prepare for the interview

### The Solution

Upload a resume. Paste a job description. Get instant insights:
- ✅ **ATS-style score** based on skill coverage and resume structure
- ✅ **Matched & missing skills** against the target role
- ✅ **Actionable suggestions** for resume improvement
- ✅ **Interview coaching** with role-specific questions
- ✅ **Skill gaps** with course recommendations

---

## Versions & Technology Choices

| Version | Stack | Status | Use Case |
|---------|-------|--------|----------|
| **React + Node.js** | React · Express · MongoDB · JWT · Gemini API | ✅ Primary | Production demo, REST API separation, authentication, scalability |
| **Streamlit** | Python · Streamlit · Optional MySQL | 📦 Legacy | Rapid prototyping, single-file proof-of-concept |

**Why two versions?**  
Started with Streamlit for quick validation of the resume-analysis workflow. Built the React/Node version to practice production concerns: client/API separation, REST patterns, user authentication (JWT), persistent storage (MongoDB), and organized code structure. The React version is the **actively maintained portfolio piece**.

---

## 🎯 Quick Demo (2–3 minutes)

### Start the application:
```bash
npm install
npm run dev
```
Open `http://localhost:5173` (frontend will print the exact URL).

### Demo flow:
1. **Register or login** (optional; demo accepts anonymous access)
2. **Upload a resume** — use a sample PDF or download one from the internet
3. **Paste a job description** — can be from LinkedIn, job board, or a copy you prepared
4. **Click "Upload and Analyze"**
5. **Review results:**
   - ATS score and breakdown
   - Matched and missing job skills
   - Predicted candidate level (entry/mid/senior)
   - Improvement suggestions
   - Recommended courses and interview questions
6. **Chat with the AI coach** (if `GEMINI_API_KEY` is configured) or review fallback suggestions
7. **Export or save** — history is stored per session

**Demo backup plan:** If the live API is unavailable, demo screenshots are in `docs/screenshots/`. Keep a 2-min screen recording as a fallback.

---

## ✨ Features

### Core Resume Analysis
- 📄 **PDF text extraction** with `pdf-parse`
- 🎯 **Resume vs. job description skill comparison** — deterministic keyword matching
- 📊 **ATS-style scoring** — heuristic score based on skill coverage, section headings, and resume length
- 👤 **Candidate profile extraction** — name, email, phone, predicted level, years of experience
- 💡 **Improvement suggestions** — actionable feedback with course links
- ❓ **Interview question generation** — role-specific questions

### AI & Coaching
- 🤖 **Optional Gemini AI** — if `GEMINI_API_KEY` is set, generates personalized guidance, interview questions, and coaching chat
- ⚡ **Deterministic fallback** — application remains fully functional without an API key; serves predefined guidance
- 💬 **Interview coach chat** — mock Q&A with feedback and tips

### User Experience
- 📈 **Analysis history & dashboard** — track resume analyses over time
- 🔐 **JWT authentication** — register, login, and protect user data
- 📥 **CSV export** — download analysis history
- 🔄 **Responsive design** — works on desktop and tablet
- 🌙 **Dark mode support** — built-in theme toggle

---

## 🤖 AI / ML — What It Does (And What It Doesn't)

**This is important for interviews:** The project intentionally separates **rule-based deterministic analysis** from **optional generative AI**.

### Resume Analysis Pipeline
```
User's Resume (PDF)
  ↓ pdf-parse
Text extraction & cleaning
  ↓ Custom skill library
Identify skills (JavaScript, React, MongoDB, etc.)
  ↓ Job description parsing
Extract job-required skills
  ↓ Comparison algorithm
Match resume skills vs. job skills
  ↓ ATS heuristic rules
Calculate score (skill coverage + section presence + length)
  ↓ Output: Matched skills, missing skills, score, suggestions
  ↓
Optional: If GEMINI_API_KEY is set
  ↓ Gemini 1.5 Flash
Generate personalized suggestions, interview questions, coaching responses
  ↓
If NO API key
  ↓ Predefined fallback templates
Return guidance from hardcoded suggestions
  ↓
React dashboard → User sees results
```

### What's **NOT** Machine Learning
- ❌ The **ATS score** is a heuristic, not a trained ML model
- ❌ **Skill matching** is explicit keyword detection, not semantic similarity
- ❌ **Experience level prediction** uses simple heuristics (keywords like "senior", "junior", years on resume)
- ❌ **Contact extraction** uses regex patterns, not NLP models

### What **CAN** Use Gemini (Optional)
- ✅ **Improvement suggestions** — "Here's how to make your resume stand out"
- ✅ **Interview questions** — Role-specific practice questions
- ✅ **Coaching chat** — Answer candidate questions about the role, interview prep, etc.
- ✅ **Personalized guidance** — Beyond what hardcoded templates provide

### Why This Design?
1. **Explainability** — The score isn't a "black box"; you can explain exactly why it's 78/100.
2. **No false AI claims** — Honest about what's heuristic vs. generative.
3. **Graceful degradation** — Works perfectly without any API key.
4. **Cost & latency** — No expensive ML infrastructure; optional Gemini calls only when requested.

---

## Architecture

```mermaid
flowchart TD
    U["👤 Candidate"] -->|Browse & Upload| R["React Vite Dashboard<br/>(Responsive, Dark Mode)"]
    R -->|REST API<br/>JSON + Multipart PDF| E["Express.js Server<br/>(JWT, CORS, Multer)"]
    E -->|1. Parse PDF| P["📄 pdf-parse library"]
    P -->|Extract text| E
    E -->|2. Extract skills| S["🎯 Skill Library Service<br/>(300+ tech keywords)"]
    S -->|Matched skills| E
    E -->|3. Generate score| A["📊 ATS Service<br/>(Heuristic scoring)"]
    A -->|Score + breakdown| E
    E -->|4. Store analysis| M[("MongoDB<br/>(User, Resume,<br/>Analysis, Feedback)")]
    E -->|5. Optional AI| G{"Gemini API<br/>Key Available?"}
    G -->|Yes| GM["🤖 Gemini 1.5 Flash<br/>(Suggestions, Questions,<br/>Coaching Chat)"]
    GM -->|Personalized response| E
    G -->|No| F["⚡ Fallback Templates<br/>(Predefined guidance)"]
    F -->|Static response| E
    E -->|JSON Response| R
    R -->|Display Results| U
    
    style R fill:#4F46E5
    style E fill:#0891B2
    style M fill:#7C3AED
    style G fill:#DC2626
```

### Key Design Decisions

| Component | Technology | Why |
|-----------|-----------|-----|
| **Frontend** | React 18 + Vite | Fast build, HMR, modern React patterns, easy deployment |
| **API** | Express.js | Lightweight, minimal overhead, perfect for REST routes |
| **PDF Processing** | pdf-parse | Pure Node.js, no system dependencies (unlike PyPDF2) |
| **Database** | MongoDB + Mongoose | Flexible schema for resume/analysis data, Atlas for easy hosting |
| **Auth** | JWT + bcryptjs | Stateless sessions, secure password hashing |
| **Optional AI** | Google Gemini API | Free tier available, low latency, good quality for this use case |
| **Fallback** | Hardcoded templates | No runtime cost, predictable, educational |

---

## Tech Stack

```
┌─────────────────────────────────────┐
│   Frontend                          │
│   React 18 · Vite · Tailwind CSS    │
│   Axios · Chart.js · Context API    │
└──────────────┬──────────────────────┘
               │ REST + JSON
┌──────────────▼──────────────────────┐
│   Backend                           │
│   Node.js · Express · Multer        │
│   pdf-parse · Mongoose · JWT        │
└──────────────┬──────────────────────┘
               │
     ┌─────────┴─────────┐
     │                   │
┌────▼──────┐   ┌────────▼─────┐
│ MongoDB   │   │ Gemini API   │
│ (Data)    │   │ (Optional AI)│
└───────────┘   └──────────────┘
```

---

## Installation & Setup

### Prerequisites
- **Node.js 18+** (download from [nodejs.org](https://nodejs.org))
- **MongoDB** — either:
  - Local MongoDB instance, or
  - Free MongoDB Atlas account (https://www.mongodb.com/cloud/atlas)
- **Optional:** Gemini API key (free tier available at https://aistudio.google.com/apikey)

### Step 1: Clone & Install

```bash
git clone https://github.com/yourusername/AI_RESUME_ANALYZER.git
cd AI_RESUME_ANALYZER
npm install
```

### Step 2: Configure Environment Variables

**Backend** (`backend/.env`):
```env
# Database
MONGODB_URI=mongodb://localhost:27017/resume_analyzer
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/resume_analyzer

# Auth
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Optional: Gemini AI
GEMINI_API_KEY=your-gemini-api-key-here

# Server
PORT=5001
NODE_ENV=development
```

**Frontend** (`frontend/.env`):
```env
VITE_API_BASE_URL=http://localhost:5001/api
```

### Step 3: Run Locally

```bash
# Development mode (runs both frontend + backend concurrently)
npm run dev

# OR run them separately:
npm run start:backend    # Terminal 1
npm run start:frontend   # Terminal 2
```

**Success:**
- Backend: `Server running on port 5001`
- Frontend: Open `http://localhost:5173` in your browser

### Production Build

```bash
npm run build
```

---

## Usage Guide

### For Candidates
1. **Register or login** (optional for demo)
2. **Upload your resume** (PDF only)
3. **Paste a job description** from the target role
4. **Click "Analyze"** — wait 2–3 seconds
5. **Review:**
   - Your ATS score
   - Matched skills (green)
   - Missing skills (red)
   - Predicted experience level
   - Improvement suggestions
   - Recommended courses
   - Mock interview questions
6. **Chat with the AI coach** (if API configured) or read suggestions
7. **Download your analysis** as PDF or CSV

### For Developers / Interviewers
- API base: `http://localhost:5001/api`
- All endpoints documented in [docs/API.md](docs/API.md)
- No authentication required for demo (anonymous mode enabled)
- Test with sample PDF: download from Google Drive, paste a job description, analyze

---

## Security & Privacy

### What We Do Right ✅
- **No secrets in Git** — `.env` files are in `.gitignore`; all API keys, DB credentials, and JWT secrets stay local
- **Password hashing** — bcryptjs with salt rounds = 10 (standard industry practice)
- **JWT tokens** — Stateless authentication, no session storage required
- **CORS configured** — Only allows frontend origin in production
- **PDF MIME type validation** — Server rejects non-PDF uploads
- **No real resumes in Git** — Sample data only; docs recommend not using real candidate info

### Production Considerations (TODO) ⚠️
- [ ] Enforce authentication on all endpoints (currently allows anonymous demo mode)
- [ ] Add file-size limits (e.g., max 10MB per resume)
- [ ] Use cloud object storage (AWS S3, Google Cloud Storage) instead of local filesystem
- [ ] Rate limiting on API endpoints
- [ ] HTTPS only (use reverse proxy like Nginx)
- [ ] Regular security audits and dependency updates
- [ ] Input sanitization for job description text
- [ ] Malware scanning for uploaded PDFs

### Why This Matters for Interviews
When an interviewer asks: *"How would you secure this for production?"*

Answer:
> "Right now, the app is designed for portfolio demo purposes—authentication is optional to make testing frictionless. For production, I'd:
> 1. Require authentication on all endpoints
> 2. Move file uploads to S3 instead of the local filesystem (scalability & security)
> 3. Add rate limiting to prevent abuse
> 4. Use HTTPS with a reverse proxy
> 5. Implement input validation and output encoding
> 6. Set up automated security scanning in CI/CD"

---

## API Reference

### Base URL
```
http://localhost:5001/api
```

### Authentication
Optional Bearer token:
```
Authorization: Bearer <JWT_TOKEN>
```

### Key Endpoints

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| **POST** | `/auth/register` | Create account | ❌ No |
| **POST** | `/auth/login` | Get JWT token | ❌ No |
| **POST** | `/resume/upload` | Upload PDF resume | ❌ No |
| **POST** | `/resume/analyze` | Analyze resume vs. job description | ❌ No |
| **GET** | `/resume/latest` | Get latest analysis | ❌ No |
| **GET** | `/resume/history` | Get all saved analyses | ❌ No |
| **POST** | `/interview/questions` | Generate interview questions | ❌ No |
| **POST** | `/interview/chat` | Chat with AI coach | ❌ No |
| **POST** | `/feedback/submit` | Submit feedback | ❌ No |

### Example: Analyze a Resume

**Request:**
```bash
curl -X POST http://localhost:5001/api/resume/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "resumeId": "66f000000000000000000000",
    "jobDescription": "5+ years React, Node.js, MongoDB, REST APIs",
    "name": "John Doe",
    "email": "john@example.com"
  }'
```

**Response:**
```json
{
  "success": true,
  "analysis": {
    "atsScore": 78,
    "matchedSkills": ["React", "Node.js", "MongoDB", "REST APIs"],
    "missingSkills": ["GraphQL", "AWS", "Docker"],
    "suggestions": ["Add GraphQL experience", "Mention AWS deployments"],
    "interviewQuestions": ["Tell me about your largest React project..."]
  }
}
```

See [docs/API.md](docs/API.md) for complete endpoint documentation.

---

## Project Structure

```
AI_RESUME_ANALYZER/
├── backend/                    Node.js + Express API
│   ├── controllers/            Request handlers
│   │   ├── authController.js        Register, login
│   │   ├── resumeController.js      Upload, analyze
│   │   ├── interviewController.js   Q&A generation
│   │   └── feedbackController.js    User feedback
│   ├── services/               Business logic
│   │   ├── atsService.js           Score calculation
│   │   ├── geminiService.js        Gemini API integration
│   │   ├── skillExtractor.js       Keyword matching
│   │   └── resumeProfile.js        Profile extraction
│   ├── models/                 MongoDB schemas
│   ├── routes/                 REST routes
│   ├── middleware/             Auth, upload validation
│   ├── config/                 Database connection
│   └── uploads/                Temp resume storage
├── frontend/                   React + Vite
│   ├── src/
│   │   ├── components/         UI components
│   │   │   ├── ATSScoreCard.jsx     Score display
│   │   │   ├── SkillChart.jsx       Skill visualization
│   │   │   ├── Chatbot.jsx          Interview coach
│   │   │   ├── Suggestions.jsx      Recommendations
│   │   │   └── ...
│   │   ├── pages/              Routes
│   │   ├── services/           API client (Axios)
│   │   ├── context/            Auth context
│   │   └── index.css           Tailwind styles
│   └── vite.config.js
├── App/                        Streamlit (Legacy)
└── docs/
    ├── API.md                  Endpoint reference
    └── screenshots/            Demo assets (TODO)
```

---

## Data Model

### MongoDB Collections

```
┌─────────────────────────────────────────────────┐
│ User                                            │
├─────────────────────────────────────────────────┤
│ _id (ObjectId)                                  │
│ name (String)                                   │
│ email (String, unique)                          │
│ passwordHash (bcrypt)                           │
│ createdAt (Date)                                │
│ resumes: [ObjectId → Resume]  ◄──1:N            │
└─────────────────────────────────────────────────┘
                 ▲
                 │
┌─────────────────────────────────────────────────┐
│ Resume                                          │
├─────────────────────────────────────────────────┤
│ _id (ObjectId)                                  │
│ userId (ObjectId → User)     1:N ──►            │
│ fileName (String)                               │
│ originalFilePath (String)                       │
│ extractedText (String, large)                   │
│ uploadedAt (Date)                               │
│ analyses: [ObjectId → Analysis]  ◄──1:N         │
└─────────────────────────────────────────────────┘
                 ▲
                 │
┌─────────────────────────────────────────────────┐
│ Analysis                                        │
├─────────────────────────────────────────────────┤
│ _id (ObjectId)                                  │
│ resumeId (ObjectId → Resume)   1:N ──►          │
│ jobDescription (String)                         │
│ atsScore (Number 0-100)                         │
│ matchedSkills (Array<String>)                   │
│ missingSkills (Array<String>)                   │
│ suggestions (Array<String>)                     │
│ interviewQuestions (Array<String>)              │
│ resumeProfile { level, skills, experience }    │
│ createdAt (Date)                                │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ Feedback                                        │
├─────────────────────────────────────────────────┤
│ _id (ObjectId)                                  │
│ name (String)                                   │
│ email (String)                                  │
│ rating (Number 1-5)                             │
│ comments (String)                               │
│ createdAt (Date)                                │
└─────────────────────────────────────────────────┘
```

---

## 🎓 FAQ for Interviews

### Q1: "Where exactly is AI used in your project?"

**Answer:**
> The project uses AI in two ways:
> 
> **1. Deterministic (Rule-based):**
> - PDF text extraction with `pdf-parse`
> - Skill library keyword matching (explicit terms like "React", "Node.js")
> - ATS scoring using heuristics (skill coverage % + section headings + resume length)
> - Experience level prediction (regex for "senior", "junior" + years calculation)
>
> **2. Optional Generative AI (Google Gemini):**
> - When a user clicks "Get Suggestions", if `GEMINI_API_KEY` is configured, we send:
>   - Matched skills, missing skills, job description, resume excerpt
>   - Gemini generates personalized improvement suggestions
> - Interview question generation (role-specific practice questions)
> - Coaching chat (mock Q&A with feedback)
>
> **Why both?** Transparent and honest. The ATS score is explainable; the Gemini output is an optional enhancement. Without the API key, the app still works perfectly—it just returns templated guidance instead of personalized suggestions.

### Q2: "Can this actually predict if an ATS will pass your resume?"

**Answer:**
> No, it can't. And I'm intentional about that. The score is a **guidance metric**, not a prediction. Real ATS systems are proprietary black boxes by each company.
>
> What this *can* do:
> - Identify if you're missing key job-required skills
> - Flag common missing resume sections (Experience, Education, Skills)
> - Show you if the resume is significantly shorter than typical (~1 page vs. 3)
> - Recommend skills to add based on the job description
>
> It's more like a "resume health check" than a true ATS prediction. I'm careful not to oversell it.

### Q3: "Why did you build both Streamlit and React versions?"

**Answer:**
> I started with Streamlit to validate the core idea quickly—upload PDF, extract skills, compare, score. It worked for a proof-of-concept.
>
> Then I rebuilt with React + Express + MongoDB to practice:
> - **Separation of concerns** — UI, API, and database logic separated
> - **Scalability** — React frontend can handle many users; Express is stateless
> - **Authentication** — JWT tokens, bcryptjs password hashing
> - **Persistent storage** — Analyses saved to MongoDB, not ephemeral
> - **REST API patterns** — Proper HTTP verbs, error handling, middleware
> - **Deployment** — React builds as static files; Express runs as a service
>
> The React version is my portfolio piece because it demonstrates production-grade architecture. The Streamlit version is preserved to show the rapid-prototyping approach I used initially.

### Q4: "What would you improve if you had more time?"

**Answer:**
> Top priorities:
> 1. **Semantic skill matching** — Use embeddings (via Gemini Embeddings API) instead of exact keyword match. This catches synonyms: "ES6" vs. "ECMAScript", "React" vs. "React.js"
> 2. **OCR for scanned PDFs** — Right now image-based resumes fail. Add Tesseract or Google Vision API
> 3. **Skill taxonomy configuration** — Let recruiters define custom skill lists per job category
> 4. **Automated tests** — Unit tests for services (atsService, skillExtractor), integration tests for API routes, E2E tests with Playwright
> 5. **Cloud deployment** — Deploy frontend to Vercel, backend to Render, database to MongoDB Atlas, with CI/CD pipeline
> 6. **User roles** — Support recruiters and admins, not just candidates
> 7. **Analytics dashboard** — Track trends: which skills are most sought, which experience levels are hired, etc.

### Q5: "How did you handle uploading large PDFs?"

**Answer:**
> Good question. I used:
> - **Multer middleware** — Parses multipart form data, streams file to disk
> - **File-size validation** — Currently no hard limit, but in production I'd add `MAX_FILE_SIZE = 10MB`
> - **Async processing** — Upload returns immediately; PDF parsing happens server-side
> - **Error handling** — If `pdf-parse` fails (corrupted PDF, image-only), the API returns a clear error
>
> For scalability, I'd replace the local `uploads/` folder with **AWS S3** or **Google Cloud Storage** so files are persistent and accessible across multiple backend instances.

### Q6: "Is this production-ready?"

**Answer:**
> **Portfolio-ready, not production-ready.** For demo purposes:
> - ✅ Fully functional end-to-end
> - ✅ Works locally and handles uploads, analysis, persistence
> - ✅ Authentication and JWT tokens implemented
> - ❌ But currently allows anonymous use (for easy demo)
> - ❌ File storage is local filesystem (not scalable)
> - ❌ No rate limiting or abuse prevention
> - ❌ Missing HTTPS and some input validation
>
> To make it production-ready, I'd need to:
> - Enforce authentication on all endpoints
> - Move files to cloud storage
> - Add rate limiting and logging
> - Set up CI/CD and automated testing
> - Deploy with HTTPS and a reverse proxy
> - Add monitoring and error tracking
>
> For a startup or hackathon, this would be a solid MVP. For a user-facing SaaS product, it would need the above hardening.

### Q7: "How does skill extraction work exactly?"

**Answer:**
> I built a skill library of ~300 common tech keywords: programming languages, frameworks, tools, databases, platforms, etc.
>
> The process:
> 1. Extract text from PDF with `pdf-parse`
> 2. Tokenize and lowercase
> 3. For each token, check if it matches a skill in the library (using fuzzy matching to catch variations like "react.js" → "react")
> 4. Return list of matched skills
> 5. Compare against job description skills (same process)
> 6. Calculate overlap: matched / total_job_skills = coverage %
>
> **Limitations:** Only catches skills that are explicitly mentioned and in my library. Won't infer that "3 years with TypeScript" also means JavaScript experience. This is by design—avoid false positives.

---

## Known Limitations & Roadmap

### Current Limitations
- 📄 Scanned/image-only PDFs fail (need OCR)
- 🎯 Keyword matching is explicit, not semantic (can't infer synonyms)
- 📊 ATS score is a heuristic, not a true ATS simulator
- 🗂️ Files stored locally (not scalable for multi-instance deployment)
- 🔐 Authentication optional for demo (security gap)
- ⚙️ No automated tests yet (plan to add)

### Future Roadmap
- [ ] Add OCR support for scanned resumes
- [ ] Integrate embeddings for semantic skill matching
- [ ] Configurable skill taxonomies per industry
- [ ] Full test coverage (unit + integration + E2E)
- [ ] Cloud deployment (Vercel + Render + MongoDB Atlas)
- [ ] Recruiter dashboard and admin panel
- [ ] Resume template suggestions
- [ ] Job market analytics and salary insights
- [ ] Integration with LinkedIn and job boards API

---

## 📸 Screenshots & Demo Assets

*(To be added before sharing with interviewers)*

Prepare these for your interview:

- `docs/screenshots/01-register.png` — Registration/login flow
- `docs/screenshots/02-upload.png` — Resume upload form
- `docs/screenshots/03-analysis.png` — ATS score and skill breakdown
- `docs/screenshots/04-suggestions.png` — Improvement suggestions
- `docs/screenshots/05-dashboard.png` — Analysis history
- `docs/screenshots/06-interview-coach.png` — AI coaching chat
- `demo.mp4` or unlisted video link — 2–3 minute walkthrough (backup for live demo failures)

---

## 🚀 GitHub Repository Checklist

Before sharing publicly, update your GitHub repo:

**Repository Description:**
> "Resume-to-job-description skill matching, ATS-style scoring, and interview guidance with React, Express, MongoDB, and optional Gemini AI. See demo at [link]."

**Topics:**
```
react, nodejs, express, mongodb, resume-parser, ats, gemini-api, streamlit, full-stack
```

**README Sections Added:**
- ✅ Clear problem statement
- ✅ Architecture diagram
- ✅ Quick start guide
- ✅ API reference
- ✅ Tech stack explanation
- ✅ Security notes
- ✅ Interview Q&A section
- ✅ Known limitations & roadmap
- ✅ Screenshots (TBD)

---

## Legacy: Streamlit Version

The `App/` directory contains the original Streamlit implementation for rapid prototyping.

```bash
cd App
pip install -r requirements.txt
streamlit run App.py
```

MySQL is optional. To enable: copy `App/.env.example` → `App/.env` and configure credentials.

---

## Contributing

Contributions welcome! Please:
1. Fork the repo
2. Create a feature branch
3. Submit a PR with a clear description

---

## License

MIT License — feel free to use this project for learning or as a portfolio piece.

---

**Happy interviewing! 🚀**
