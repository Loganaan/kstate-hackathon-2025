# Interview Questions API

Production-ready Next.js App Router CRUD API that uses Google's Gemini API to generate LeetCode/CodeSignal-style interview questions tailored to company and job description.

## Features

- ✅ **TypeScript with strict mode** - No `any` types, full type safety
- ✅ **Zod validation** - Runtime schema validation for all inputs
- ✅ **Rate limiting** - Token bucket algorithm (60 req / 10 min per IP+path)
- ✅ **Gemini AI integration** - Deterministic JSON generation with retry logic
- ✅ **In-memory data store** - Map-based storage with soft delete
- ✅ **Comprehensive error handling** - Standardized error codes and responses
- ✅ **PII scrubbing** - Automatic removal of emails and phone numbers
- ✅ **Multiple question formats** - Multiple-choice, coding, free-response, or mixed

## Setup

### Prerequisites

- Node.js 18+
- Google Gemini API key

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   GEMINI_MODEL=gemini-1.5-pro  # Optional, defaults to gemini-1.5-pro
   NODE_ENV=production           # Optional, for production mode
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### POST /api/questions

Generate new interview questions using Gemini AI.

**Request Body:**
```typescript
{
  company: string;           // 1-80 characters (required)
  role: string;              // (required)
  seniority?: "intern" | "junior" | "mid" | "senior";
  jobDescription: string;    // 50-8000 characters (required)
  difficulty?: "easy" | "medium" | "hard";  // Default: "medium"
  topics?: string[];         // e.g., ["graphs", "sql"]
  count?: number;            // 1-10, default: 3
  format?: "multiple-choice" | "coding" | "free-response" | "mixed";
}
```

**Response (200):**
```typescript
{
  questions: Question[]
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/questions \
  -H "Content-Type: application/json" \
  -d '{
    "company": "Google",
    "role": "Software Engineer",
    "seniority": "mid",
    "jobDescription": "We are looking for a mid-level software engineer with experience in distributed systems, algorithm design, and scalable architecture. The ideal candidate will work on core infrastructure...",
    "difficulty": "medium",
    "topics": ["algorithms", "distributed-systems"],
    "count": 2,
    "format": "coding"
  }'
```

### GET /api/questions

List questions with optional filters and pagination.

**Query Parameters:**
```typescript
{
  company?: string;
  role?: string;
  difficulty?: "easy" | "medium" | "hard";
  topic?: string;
  limit?: number;    // 1-50, default: 50
  offset?: number;   // Default: 0
}
```

**Response (200):**
```typescript
{
  items: Question[];
  total: number;
  nextOffset?: number;  // Present if more results available
}
```

**Example:**
```bash
curl "http://localhost:3000/api/questions?company=Google&difficulty=medium&limit=10"
```

### GET /api/questions/[id]

Retrieve a single question by ID.

**Response (200):**
```typescript
Question
```

**Example:**
```bash
curl http://localhost:3000/api/questions/abc123def456
```

### PUT /api/questions/[id]

Update an existing question.

**Request Body:**
```typescript
{
  difficulty?: "easy" | "medium" | "hard";
  topicTags?: string[];
  prompt?: string;
  starterCode?: string;
  choices?: Choice[];        // For multiple-choice only
  explanation?: string;
  testCases?: TestCase[];
  solutionOutline?: string;
}
```

**Response (200):**
```typescript
Question
```

**Example:**
```bash
curl -X PUT http://localhost:3000/api/questions/abc123def456 \
  -H "Content-Type: application/json" \
  -d '{
    "difficulty": "hard",
    "explanation": "Updated constraints and edge cases"
  }'
```

### DELETE /api/questions/[id]

Soft delete a question (sets `deletedAt` timestamp).

**Response (200):**
```typescript
{
  ok: true
}
```

**Example:**
```bash
curl -X DELETE http://localhost:3000/api/questions/abc123def456
```

## Type Definitions

### Question
```typescript
type Question = {
  id: string;                   // Unique identifier (nanoid)
  company: string;
  role: string;
  seniority?: "intern" | "junior" | "mid" | "senior";
  difficulty: "easy" | "medium" | "hard";
  topicTags: string[];          // Normalized lowercase tags
  format: "multiple-choice" | "coding" | "free-response";
  prompt: string;               // Question text
  starterCode?: string;         // For coding questions
  solutionOutline?: string;     // Brief approach description
  testCases?: TestCase[];       // For coding questions
  choices?: Choice[];           // For multiple-choice (exactly one correct)
  explanation?: string;         // Constraints, edge cases, rationale
  createdAt: string;            // ISO 8601 timestamp
  updatedAt?: string;           // ISO 8601 timestamp
  deletedAt?: string;           // ISO 8601 timestamp (soft delete)
};
```

### Choice
```typescript
type Choice = {
  label: string;     // e.g., "A", "B", "C", "D"
  text: string;      // Choice text
  correct?: boolean; // Exactly one must be true for MC questions
};
```

### TestCase
```typescript
type TestCase = {
  input: string;
  output: string;
  explanation?: string;
};
```

## Error Responses

All errors follow a standardized format:

```typescript
{
  error: {
    code: ErrorCode;
    message: string;
    details?: unknown;  // Optional validation details
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Missing or invalid `GEMINI_API_KEY` |
| `VALIDATION_ERROR` | 400 | Invalid request body or query parameters |
| `INPUT_LIMIT_EXCEEDED` | 400 | Input exceeds allowed limits |
| `RATE_LIMITED` | 429 | Rate limit exceeded (60 req / 10 min) |
| `NOT_FOUND` | 404 | Resource not found |
| `GEMINI_ERROR` | 500 | Gemini API error |
| `INTERNAL_ERROR` | 500 | Internal server error |

### Example Error Response

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "code": "too_small",
        "minimum": 50,
        "path": ["jobDescription"],
        "message": "String must contain at least 50 character(s)"
      }
    ]
  }
}
```

## Rate Limiting

The API implements token bucket rate limiting:
- **Limit:** 60 requests per 10-minute window
- **Scope:** Per IP address + endpoint path
- **Response:** `429` status code when exceeded
- **Header:** None (consider adding `Retry-After` in production)

## Validation Rules

### Input Sanitization
- All strings are trimmed
- Job descriptions are capped at 8,000 characters
- Question count is limited to 10 per request
- Topic tags are normalized to lowercase and deduplicated
- PII (emails, phone numbers) are scrubbed from job descriptions

### Multiple-Choice Questions
- Must have exactly 4 choices (A, B, C, D)
- Exactly one choice must be marked as correct
- Post-processing enforces this constraint if Gemini output is invalid

### Coding Questions
- Must include at least 2 test cases
- Should include starter code and constraints
- Solution outline describes the approach

## Architecture

### File Structure
```
src/
├── app/api/questions/
│   ├── route.ts              # POST, GET collection
│   └── [id]/
│       └── route.ts          # GET, PUT, DELETE item
└── lib/
    ├── schemas.ts            # Zod schemas + TypeScript types
    ├── prompt.ts             # Prompt builder for Gemini
    ├── gemini-client.ts      # Gemini API client with retry
    ├── store.ts              # In-memory Map-based storage
    ├── rate-limit.ts         # Token bucket rate limiter
    ├── errors.ts             # Error helpers and codes
    └── util.ts               # Utility functions
```

### Data Flow

1. **Rate Limiting** → Check token bucket
2. **Authentication** → Validate `GEMINI_API_KEY`
3. **Validation** → Parse and validate with Zod
4. **Sanitization** → Trim, scrub PII, enforce limits
5. **Gemini Generation** → Call API with retry logic
6. **Post-Processing** → Enforce MC constraints, normalize tags
7. **Storage** → Save to in-memory Map
8. **Response** → Return JSON with explicit status

## Gemini Integration

### Prompt Engineering

The API uses carefully crafted prompts to ensure deterministic JSON output:

1. **System Prompt:** Defines role as "senior interview content designer"
2. **User Prompt:** Includes company, role, seniority, job description summary (≤1500 chars), difficulty, topics, format, and count
3. **JSON Contract:** Explicit schema definition in prompt
4. **Retry Logic:** On parse failure, sends clarification prompt

### Output Handling

- Strips markdown code blocks (```json)
- Validates against Zod schema
- Enforces exactly one correct answer for multiple-choice
- Retries once on validation failure
- Maximum 2 attempts before throwing error

### Configuration

Set environment variables:
- `GEMINI_MODEL`: Model to use (default: `gemini-1.5-pro`)
- Temperature: 0.7 (configurable in code)
- Top-K: 40
- Top-P: 0.95
- Max output tokens: 8192

## Production Considerations

### Security
- ✅ No `console.log` in production (use `logError` helper)
- ✅ PII scrubbing for job descriptions
- ✅ Input sanitization and validation
- ✅ Rate limiting per IP+path
- ⚠️ Consider adding authentication beyond API key check
- ⚠️ Consider CORS configuration for production

### Scalability
- ⚠️ In-memory store will reset on server restart
- ⚠️ Consider Redis or database for persistence
- ⚠️ Rate limiter state is also in-memory
- ✅ Edge runtime compatible (commented out, uncomment to enable)

### Monitoring
- Add application monitoring (e.g., Sentry, DataDog)
- Track Gemini API usage and costs
- Monitor rate limit hits
- Log error rates by endpoint

### Performance
- Consider caching common queries
- Implement request/response compression
- Add CDN for static assets
- Monitor Gemini API latency

## Testing

### Manual Testing

```bash
# Test POST endpoint
curl -X POST http://localhost:3000/api/questions \
  -H "Content-Type: application/json" \
  -d @test-request.json

# Test GET with filters
curl "http://localhost:3000/api/questions?difficulty=medium&limit=5"

# Test rate limiting (run 61 times rapidly)
for i in {1..61}; do
  curl http://localhost:3000/api/questions
done
```

### Unit Testing

Consider adding:
- Zod schema validation tests
- Store CRUD operation tests
- Rate limiter behavior tests
- Prompt builder tests
- Error handler tests

## License

MIT

## Support

For issues or questions, please open a GitHub issue.
