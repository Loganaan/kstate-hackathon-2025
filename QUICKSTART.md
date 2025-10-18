# Questions API - Quick Start Guide

## What Was Built

A production-ready Next.js 15 App Router CRUD API that generates LeetCode/CodeSignal-style interview questions using Google's Gemini AI. All code is TypeScript with strict mode enabled.

## Files Created

### Core Libraries (`src/lib/`)
- ✅ `util.ts` - ID generation, timestamps, pagination, PII scrubbing
- ✅ `errors.ts` - Standardized error codes and response helpers
- ✅ `schemas.ts` - Zod validation schemas and TypeScript types
- ✅ `rate-limit.ts` - Token bucket rate limiter (60 req/10min per IP+path)
- ✅ `store.ts` - In-memory Map-based storage with soft delete
- ✅ `prompt.ts` - Gemini prompt builder with system/user templates
- ✅ `gemini-client.ts` - Gemini API client with JSON parsing and retry logic

### API Routes (`src/app/api/questions/`)
- ✅ `route.ts` - POST (create) and GET (list with filters)
- ✅ `[id]/route.ts` - GET (retrieve), PUT (update), DELETE (soft delete)

### Documentation
- ✅ `API_README.md` - Complete API documentation with examples
- ✅ `.env.example` - Updated with GEMINI_MODEL option

## Setup Instructions

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```
   The following packages were added:
   - `zod` - Schema validation
   - `@google/generative-ai` - Gemini API SDK

2. **Environment variables**:
   
   ✅ Your `GEMINI_API_KEY` is already configured in your `.env` file!
   
   The API will automatically use the existing key. Optionally, you can override it locally:
   ```bash
   # Optional: Create .env.local for local overrides
   cp .env.example .env.local
   ```
   
   To get a Gemini API key, visit: https://makersuite.google.com/app/apikey

3. **Build and run**:
   ```bash
   # Development
   npm run dev
   
   # Production
   npm run build
   npm start
   ```

## Quick Test

### Generate Questions
```bash
curl -X POST http://localhost:3000/api/questions \
  -H "Content-Type: application/json" \
  -d '{
    "company": "Google",
    "role": "Software Engineer",
    "seniority": "mid",
    "jobDescription": "We are seeking a talented mid-level software engineer with strong algorithmic problem-solving skills and experience in distributed systems. You will work on large-scale infrastructure that serves billions of users. The ideal candidate has experience with system design, algorithms, and data structures. Strong coding skills in Java, C++, or Python are required.",
    "difficulty": "medium",
    "topics": ["algorithms", "system-design"],
    "count": 2,
    "format": "coding"
  }'
```

### List Questions
```bash
curl "http://localhost:3000/api/questions?company=Google&limit=10"
```

### Get a Question
```bash
curl http://localhost:3000/api/questions/{id}
```

### Update a Question
```bash
curl -X PUT http://localhost:3000/api/questions/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "difficulty": "hard",
    "explanation": "Updated explanation"
  }'
```

### Delete a Question
```bash
curl -X DELETE http://localhost:3000/api/questions/{id}
```

## Key Features Implemented

### ✅ Strict TypeScript
- No `any` types used
- Full type safety with Zod schema validation
- Strict mode enabled

### ✅ Comprehensive Validation
- Request body validation with detailed error messages
- Input sanitization (trim, length limits)
- PII scrubbing (emails, phone numbers)
- Job description: 50-8000 chars
- Count: 1-10 questions per request
- Multiple-choice: exactly one correct answer enforced

### ✅ Rate Limiting
- Token bucket algorithm
- 60 requests per 10-minute window
- Per IP address + endpoint path
- Automatic token refill
- Periodic cleanup to prevent memory leaks

### ✅ Error Handling
- Standardized error codes: `UNAUTHORIZED`, `VALIDATION_ERROR`, `INPUT_LIMIT_EXCEEDED`, `RATE_LIMITED`, `NOT_FOUND`, `GEMINI_ERROR`, `INTERNAL_ERROR`
- Detailed validation errors with Zod
- No console.log in production (uses `logError` helper)

### ✅ Gemini Integration
- Deterministic JSON-only responses
- Strips markdown code blocks automatically
- Retry logic on parse/validation failure
- Enforces exactly one correct answer for multiple-choice
- Configurable model via `GEMINI_MODEL` env var
- Temperature: 0.7, TopK: 40, TopP: 0.95

### ✅ Data Storage
- In-memory Map-based storage
- Soft delete with `deletedAt` timestamp
- Array indexing for efficient filtering
- Pagination support (limit, offset)
- Filters: company, role, difficulty, topic

### ✅ Question Formats
- **Multiple-choice**: 4 choices (A-D), exactly one correct
- **Coding**: starter code, test cases, constraints, solution outline
- **Free-response**: evaluation criteria in explanation
- **Mixed**: combination of all formats

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/questions` | Generate questions using Gemini |
| GET | `/api/questions` | List questions with filters |
| GET | `/api/questions/[id]` | Get a single question |
| PUT | `/api/questions/[id]` | Update a question |
| DELETE | `/api/questions/[id]` | Soft delete a question |

## Response Format

All responses are JSON with explicit HTTP status codes:
- `200` - Success
- `400` - Validation error / Input limit exceeded
- `401` - Unauthorized (missing API key)
- `404` - Not found
- `429` - Rate limited
- `500` - Internal error / Gemini error

## Production Checklist

- ✅ TypeScript strict mode enabled
- ✅ Zod validation on all inputs
- ✅ Rate limiting implemented
- ✅ PII scrubbing
- ✅ Error codes standardized
- ✅ Soft delete for questions
- ✅ Pagination support
- ⚠️ In-memory storage (consider Redis/DB for production)
- ⚠️ Consider authentication beyond API key
- ⚠️ Add monitoring/observability
- ⚠️ Configure CORS for production
- ⚠️ Add request/response compression

## Next Steps

1. **Your Gemini API key is already configured!** ✅ (in `.env`)
2. Start the dev server: `npm run dev`
3. Test the endpoints using curl or Postman (see examples above)
4. Review `API_README.md` for complete documentation
5. Consider adding persistence (Redis, PostgreSQL, etc.)
6. Add monitoring and logging
7. Deploy to your production environment

## Architecture Highlights

- **Request Flow**: Rate limit → Auth check → Validation → Sanitization → Gemini call → Post-process → Store → Response
- **Data Store**: Map (id → Question) + Array (for filtering/sorting)
- **Rate Limiter**: Token bucket per IP+path with automatic refill
- **Gemini Client**: JSON parsing, schema validation, retry on failure
- **Prompt Engineering**: System + user prompts, explicit JSON schema

## Notes

- Edge runtime is compatible but commented out (uncomment in route files to enable)
- Store state resets on server restart (use external DB for persistence)
- Rate limiter state is also in-memory
- All topic tags are normalized to lowercase
- Questions are soft-deleted (deletedAt timestamp) and excluded from queries
- Multiple-choice questions are post-processed to ensure exactly one correct answer

Enjoy your production-ready interview questions API! 🚀
