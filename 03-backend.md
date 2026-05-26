# CareerOS Backend Specification

## Backend Approach

Use Next.js backend capabilities first.

Recommended backend stack:

```text
- Next.js Route Handlers
- TypeScript
- Prisma ORM
- PostgreSQL
- Auth.js or Clerk
- Zod
- OpenAI API or compatible AI provider
```

MVP can be built as a Next.js full-stack application.

## Backend Responsibilities

The backend is responsible for:

```text
- Authentication session checks
- Authorization and data ownership checks
- Input validation
- Database access
- AI orchestration
- Resume analysis
- Job analysis
- Learning roadmap generation
- Interview feedback analysis
- Resume export generation
```

The backend should never trust frontend data.

## API Design Style

Use REST-like API routes.

Recommended structure:

```text
src/
  app/
    api/
      auth/
      career-profile/
      skills/
      resume/
      jobs/
      learning/
      interview/
      knowledge-base/
      ai/
      export/
```

## Backend Folder Structure

Suggested structure:

```text
src/
  server/
    services/
      career-profile.service.ts
      skill.service.ts
      resume.service.ts
      job.service.ts
      job-analysis.service.ts
      learning-roadmap.service.ts
      interview.service.ts
      knowledge-base.service.ts
      export.service.ts

    repositories/
      career-profile.repository.ts
      skill.repository.ts
      resume.repository.ts
      job.repository.ts
      learning.repository.ts
      interview.repository.ts

    ai/
      ai-client.ts
      ai-provider.interface.ts
      providers/
        mock.provider.ts
        openai.provider.ts
      prompts/
        resume-analysis.prompt.ts
        job-analysis.prompt.ts
        tailored-resume.prompt.ts
        learning-roadmap.prompt.ts
        interview-feedback.prompt.ts
      schemas/
        resume-analysis.schema.ts
        job-analysis.schema.ts
        learning-roadmap.schema.ts
        interview-feedback.schema.ts

    auth/
      require-user.ts
      permissions.ts

    validations/
      career-profile.schema.ts
      resume.schema.ts
      job.schema.ts
      interview.schema.ts
      learning.schema.ts

  lib/
    db.ts
    env.ts
    utils.ts
```

## Authentication

Use Auth.js or Clerk.

MVP requirements:

```text
- Register
- Login
- Logout
- Get current user
- Protect dashboard routes
- Protect API routes
```

Every user-owned API should check the current user.

## Authorization Rules

Rules:

```text
1. Users can only access their own career profile.
2. Users can only access their own jobs.
3. Users can only access their own resume versions.
4. Users can only access their own learning roadmaps.
5. Users can only access their own interview logs.
6. Admin-only AI testing endpoints should not be public.
```

## API Routes

## 1. Career Profile APIs

### GET /api/career-profile

Returns current user's career profile.

### POST /api/career-profile

Creates career profile.

Request:

```json
{
  "basicInfo": {},
  "targetRoles": ["Frontend Engineer"],
  "resumeText": "..."
}
```

### PATCH /api/career-profile

Updates career profile.

## 2. Work Experience APIs

### POST /api/career-profile/experiences

Creates work experience.

### PATCH /api/career-profile/experiences/:id

Updates work experience.

### DELETE /api/career-profile/experiences/:id

Deletes work experience.

## 3. Project APIs

### POST /api/career-profile/projects

Creates project.

### PATCH /api/career-profile/projects/:id

Updates project.

### DELETE /api/career-profile/projects/:id

Deletes project.

## 4. Skills APIs

### GET /api/skills/templates?role=frontend

Returns predefined skills for selected role.

### GET /api/user-skills

Returns current user's skills.

### POST /api/user-skills

Adds selected or custom skills.

### PATCH /api/user-skills/:id

Updates skill level or evidence.

### DELETE /api/user-skills/:id

Removes user skill.

## 5. Resume APIs

### POST /api/resume/analyze

Analyzes pasted resume.

Input:

```json
{
  "resumeText": "...",
  "mode": "mock"
}
```

Output:

```json
{
  "score": 72,
  "strengths": [],
  "weaknesses": [],
  "atsSuggestions": [],
  "detectedSkills": [],
  "improvementSuggestions": []
}
```

### GET /api/resume/versions

Returns resume versions.

### POST /api/resume/versions

Creates resume version.

### GET /api/resume/versions/:id

Returns resume version detail.

### PATCH /api/resume/versions/:id

Updates resume version.

### DELETE /api/resume/versions/:id

Deletes resume version.

## 6. Job APIs

### GET /api/jobs

Returns user's jobs.

Supports filters:

```text
status
workType
tag
skill
```

### POST /api/jobs

Creates job.

Request:

```json
{
  "companyName": "Example Company",
  "jobTitle": "Frontend Engineer",
  "jobUrl": "https://example.com/job",
  "location": "Remote",
  "workType": "remote",
  "salaryRange": "",
  "description": "..."
}
```

### GET /api/jobs/:id

Returns job detail.

### PATCH /api/jobs/:id

Updates job.

### DELETE /api/jobs/:id

Deletes job.

## 7. Job Analysis APIs

### POST /api/jobs/:id/analyze

Analyzes job fit.

Input:

```json
{
  "mode": "mock"
}
```

Output:

```json
{
  "overallScore": 78,
  "technicalMatch": 82,
  "experienceMatch": 75,
  "remoteReadiness": 70,
  "englishReadiness": 62,
  "portfolioSupport": 80,
  "mustHaveSkills": [],
  "niceToHaveSkills": [],
  "missingSkills": [],
  "recommendation": "Worth Applying",
  "risks": [],
  "reasoning": "..."
}
```

### POST /api/jobs/:id/tailored-resume

Generates tailored resume suggestions for this job.

Output:

```json
{
  "positioning": "...",
  "summarySuggestion": "...",
  "skillsToEmphasize": [],
  "bulletSuggestions": [],
  "keywordsToAdd": [],
  "sectionsToReduce": []
}
```

## 8. Learning APIs

### GET /api/learning/roadmaps

Returns roadmaps.

### POST /api/learning/roadmaps/generate

Generates roadmap based on user profile, job, and skill gaps.

Input:

```json
{
  "jobId": "optional",
  "targetRole": "Frontend Engineer",
  "mode": "mock"
}
```

### GET /api/learning/roadmaps/:id

Returns roadmap detail.

### PATCH /api/learning/tasks/:id

Updates learning task status.

## 9. Interview APIs

### GET /api/interview/logs

Returns interview logs.

### POST /api/interview/logs

Creates interview log.

### GET /api/interview/logs/:id

Returns interview log detail.

### PATCH /api/interview/logs/:id

Updates interview log.

### DELETE /api/interview/logs/:id

Deletes interview log.

### POST /api/interview/logs/:id/analyze

Analyzes interview feedback.

Output:

```json
{
  "weakAreas": [],
  "suggestedPractice": [],
  "roadmapUpdates": [],
  "summary": "..."
}
```

## 10. Knowledge Base APIs

### GET /api/knowledge-base/notes

Returns notes.

### POST /api/knowledge-base/notes

Creates note.

### GET /api/knowledge-base/notes/:id

Returns note detail.

### PATCH /api/knowledge-base/notes/:id

Updates note.

### DELETE /api/knowledge-base/notes/:id

Deletes note.

## 11. Export APIs

### POST /api/export/resume/:versionId/pdf

Generates PDF resume.

### GET /api/export/resume/:versionId/markdown

Returns Markdown resume content.

MVP only supports resume export.

Do not implement report sharing or public links.

## AI Integration

## AI Provider Strategy

The AI layer must support provider switching.

Use provider-based architecture:

```text
AIProvider interface
→ MockProvider
→ OpenAIProvider
→ Future providers
```

The public portfolio demo can run in mock mode.

Development or admin mode can use real OpenAI API.

## Environment Variables

```env
AI_MODE=mock
OPENAI_API_KEY=
```

Allowed AI modes:

```text
mock
openai
```

## AI Provider Interface

Suggested TypeScript interface:

```ts
export interface AIProvider {
  generateText(input: AITextRequest): Promise<AITextResponse>;
  generateStructuredData<T>(input: AIStructuredRequest): Promise<T>;
}
```

## Mock Provider

Mock provider should return pre-generated JSON.

Use mock provider for:

```text
- Public demo
- Automated tests
- Offline development
- Cost control
```

Suggested files:

```text
src/demo-data/
  resume-analysis.json
  job-fit-analysis.json
  tailored-resume.json
  learning-roadmap.json
  interview-feedback.json
```

## OpenAI Provider

OpenAI provider should:

```text
- Only run server-side
- Read API key from environment variables
- Never expose key to frontend
- Return structured JSON
- Validate model output with Zod
```

## AI Use Cases

### Resume Analysis

Inputs:

```text
- Resume text
- User target role
- User skills
```

Outputs:

```text
- Score
- Strengths
- Weaknesses
- Detected skills
- ATS suggestions
- Bullet improvement ideas
```

### Job Fit Analysis

Inputs:

```text
- Job description
- Career profile
- User skills
- Resume text
```

Outputs:

```text
- Match score
- Required skills
- Missing skills
- Apply recommendation
- Risks
- Reasoning
```

### Tailored Resume

Inputs:

```text
- Resume version
- Job description
- Job fit analysis
```

Outputs:

```text
- Suggested positioning
- Summary rewrite
- Bullet suggestions
- Skill emphasis
- Keywords
```

### Learning Roadmap

Inputs:

```text
- Target role
- Missing skills
- Interview feedback
```

Outputs:

```text
- Roadmap items
- Priorities
- Learning tasks
- Practice tasks
- Interview questions
```

### Interview Feedback

Inputs:

```text
- Interview questions
- User answers
- User self-review
- Job description, optional
```

Outputs:

```text
- Weak areas
- Suggested practice
- Roadmap update
- Better answer suggestions
```

## Rate Limit and Cost Control

If real AI mode is enabled, implement:

```text
- Per-user daily quota
- Per-action limit
- Basic IP rate limit
- AI request logging
```

Example quotas:

```text
Resume analysis: 2 times per day
Job analysis: 5 times per day
Roadmap generation: 2 times per day
Interview feedback analysis: 3 times per day
```

## Backend Validation

Use Zod for all request payloads.

Rules:

```text
1. Validate all POST / PATCH requests.
2. Validate AI output before saving.
3. Reject invalid enum values.
4. Limit resume and JD text length.
5. Sanitize user input where needed.
```

## Error Handling

All APIs should return consistent error responses:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input"
  }
}
```

Common error codes:

```text
UNAUTHORIZED
FORBIDDEN
NOT_FOUND
VALIDATION_ERROR
AI_PROVIDER_ERROR
RATE_LIMITED
INTERNAL_ERROR
```

## Backend Development Rules

```text
1. Keep business logic in services.
2. Keep database queries in repositories or service layer.
3. Never call AI provider from frontend.
4. Never expose API keys.
5. Validate all inputs with Zod.
6. Check user ownership before returning data.
7. Store AI outputs in database for reuse.
8. Use mock provider for public demo.
9. Use structured AI responses where possible.
10. Keep API responses stable and typed.
```
