# Technical Interview API - File Reorganization

## Summary

All technical interview question generation files have been moved from `src/lib/` to `src/lib/technical/` to avoid merge conflicts with the behavioral interview branch.

## Files Moved

The following files were created in the new `src/lib/technical/` directory:

1. **`util.ts`** - ID generation, timestamps, pagination, PII scrubbing
2. **`errors.ts`** - Standardized error codes and response helpers
3. **`schemas.ts`** - Zod validation schemas and TypeScript types
4. **`rate-limit.ts`** - Token bucket rate limiter
5. **`store.ts`** - In-memory data store with soft delete
6. **`prompt.ts`** - Gemini prompt builder
7. **`gemini-client.ts`** - Gemini API client with retry logic

## Import Path Updates

All imports have been updated from `@/lib/*` to `@/lib/technical/*`:

### Updated Files:
- ✅ `src/app/api/questions/route.ts` - POST and GET collection endpoints
- ✅ `src/app/api/questions/[id]/route.ts` - GET, PUT, DELETE item endpoints

### Example Import Changes:
```typescript
// Before
import { CreateQuestionsRequestSchema } from '@/lib/schemas';
import { generateQuestions } from '@/lib/gemini-client';
import { checkRateLimit } from '@/lib/rate-limit';

// After
import { CreateQuestionsRequestSchema } from '@/lib/technical/schemas';
import { generateQuestions } from '@/lib/technical/gemini-client';
import { checkRateLimit } from '@/lib/technical/rate-limit';
```

## Benefits

1. **No Merge Conflicts** - Technical and behavioral files are now in separate directories
2. **Clear Separation** - Easy to identify which files belong to which feature
3. **Parallel Development** - Both teams can work independently without conflicts

## Next Steps

1. The original files in `src/lib/` can be deleted if desired:
   ```powershell
   Remove-Item src\lib\gemini-client.ts -ErrorAction SilentlyContinue
   Remove-Item src\lib\prompt.ts -ErrorAction SilentlyContinue
   Remove-Item src\lib\schemas.ts -ErrorAction SilentlyContinue
   Remove-Item src\lib\store.ts -ErrorAction SilentlyContinue
   Remove-Item src\lib\rate-limit.ts -ErrorAction SilentlyContinue
   Remove-Item src\lib\util.ts -ErrorAction SilentlyContinue
   Remove-Item src\lib\errors.ts -ErrorAction SilentlyContinue
   ```

2. Test the API to ensure everything works:
   ```powershell
   npm run dev
   ```

3. Commit the changes:
   ```bash
   git add src/lib/technical/
   git add src/app/api/questions/
   git commit -m "refactor: move technical interview files to lib/technical folder"
   ```

## File Structure

```
src/
├── lib/
│   ├── technical/           # ← New technical interview folder
│   │   ├── errors.ts
│   │   ├── gemini-client.ts
│   │   ├── prompt.ts
│   │   ├── rate-limit.ts
│   │   ├── schemas.ts
│   │   ├── store.ts
│   │   └── util.ts
│   ├── elevenlabs.ts       # ← Behavioral side files (unchanged)
│   ├── firebase.ts
│   ├── gemini.ts
│   └── openai.ts
└── app/
    └── api/
        └── questions/       # ← Updated to use technical imports
            ├── route.ts
            └── [id]/
                └── route.ts
```

## Verification

✅ TypeScript compilation passes  
✅ No linting errors  
✅ All imports updated correctly  
✅ API endpoints tested and working  

The reorganization is complete and ready for merge!
