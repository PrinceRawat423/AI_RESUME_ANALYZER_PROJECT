# API reference

Base URL: `http://localhost:5001/api`

The API accepts a Bearer token when supplied: `Authorization: Bearer <token>`. The current authentication middleware allows anonymous use for the local portfolio demo; records created anonymously have no user owner.

## Authentication

| Method | Endpoint | Body |
| --- | --- | --- |
| POST | `/auth/register` | `{ "name", "email", "password" }` |
| POST | `/auth/login` | `{ "email", "password" }` |

Both successful endpoints return `{ message, token, user }`.

## Resume analysis

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/resume/upload` | Upload a PDF using multipart field `resume` |
| POST | `/resume/analyze` | Analyze a stored resume |
| GET | `/resume/latest` | Fetch the latest saved analysis |
| GET | `/resume/history` | Fetch analysis history |

Example analysis request:

```json
{
  "resumeId": "66f000000000000000000000",
  "jobDescription": "React developer with JavaScript, Node.js, MongoDB and REST API experience.",
  "name": "Optional display name",
  "email": "optional@example.com",
  "mobile": "Optional phone number"
}
```

The response contains the saved `resume`, `analysis`, and derived `resumeProfile`. `analysis` includes `atsScore`, `matchedSkills`, `missingSkills`, `suggestions`, and `interviewQuestions`.

## Interview coach

| Method | Endpoint | Body |
| --- | --- | --- |
| POST | `/interview/questions` | Optional `{ "analysisId", "resumeText", "skills" }` |
| POST | `/interview/chat` | `{ "question", "context" }` |

## Feedback

| Method | Endpoint | Body |
| --- | --- | --- |
| POST | `/feedback/submit` | `{ "name", "email", "score", "comments" }` |
| GET | `/feedback/history` | None |

`score` must be between 1 and 5.
