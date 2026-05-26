# CareerOS System Architecture

## Architecture Summary

CareerOS is a full-stack AI SaaS portfolio project built with Next.js.

The system has five major layers:

```text
Frontend UI
→ Backend API / Server Actions
→ Domain Services
→ AI Provider Layer
→ PostgreSQL Database
```

High-level flow:

```text
User interacts with Next.js UI
→ Frontend calls API route
→ API route validates input and checks auth
→ Service layer executes business logic
→ Repository / Prisma reads or writes database
→ AI service calls mock or real AI provider if needed
→ Result is stored in database
→ Frontend displays analysis results
```

## System Goals

The architecture should demonstrate:

```text
- Full-stack application design
- Clean frontend/backend separation
- Auth and data ownership
- Database modeling
- AI workflow integration
- Cost-controlled AI demo mode
- Provider-based AI abstraction
- Production-style code organization
```

## Main Architecture Diagram

```text
+-----------------------------+
|         Frontend            |
|  Next.js / React / TS       |
|  Dashboard / Forms / UI     |
+-------------+---------------+
              |
              | HTTP / Server Action
              v
+-----------------------------+
|       Backend API           |
|  Next.js Route Handlers     |
|  Auth / Validation / Quota  |
+-------------+---------------+
              |
              v
+-----------------------------+
|       Domain Services       |
| CareerProfileService        |
| ResumeService               |
| JobService                  |
| LearningService             |
| InterviewService            |
+-------------+---------------+
              |
      +-------+--------+
      |                |
      v                v
+-------------+   +------------------+
| Prisma ORM  |   |   AI Service     |
| PostgreSQL  |   | Provider Adapter |
+-------------+   +--------+---------+
                          |
                 +--------+--------+
                 |                 |
                 v                 v
          +-------------+   +----------------+
          | MockProvider|   | OpenAIProvider |
          | Demo JSON   |   | Real API       |
          +-------------+   +----------------+
```

## Frontend Architecture

Frontend responsibilities:

```text
- UI rendering
- User interaction
- Form handling
- Client-side validation
- Calling backend APIs
- Showing loading / error / empty states
- Displaying AI outputs
```

Frontend must not:

```text
- Directly access database
- Directly call OpenAI or other AI providers
- Store API keys
- Make final authorization decisions
```

## Backend Architecture

Backend responsibilities:

```text
- Authentication
- Authorization
- Input validation
- Business logic
- Database access
- AI orchestration
- Rate limiting
- Export generation
```

All backend routes should follow this flow:

```text
1. Get current user
2. Validate request input with Zod
3. Check ownership / permission
4. Call domain service
5. Return typed response
```

## Domain Service Layer

Business logic should live in services.

Examples:

```text
CareerProfileService
- create profile
- update profile
- analyze profile

SkillService
- get role-based skills
- add user skill
- detect resume skills

ResumeService
- analyze resume
- create resume version
- update resume version
- export resume

JobService
- create job
- update job status
- get job detail

JobAnalysisService
- analyze job fit
- generate tailored resume suggestions

LearningRoadmapService
- generate roadmap
- update learning task

InterviewService
- create interview log
- analyze feedback
- update weak areas
```

## AI Architecture

## Why Provider-Based AI Architecture

The product needs AI for many features, but public portfolio deployment should avoid uncontrolled API cost.

So the system should support:

```text
- Mock AI mode for public demo
- Real AI mode for development or admin testing
- Future provider replacement
```

## AI Modes

```text
AI_MODE=mock
AI_MODE=openai
```

## Mock Mode

Used for:

```text
- Public portfolio demo
- Cost control
- Stable demo results
- Offline development
- Testing
```

Mock mode returns pre-generated JSON from local files or seeded database.

Examples:

```text
demo-data/resume-analysis.json
demo-data/job-fit-analysis.json
demo-data/tailored-resume.json
demo-data/learning-roadmap.json
demo-data/interview-feedback.json
```

## OpenAI Mode

Used for:

```text
- Local development
- Admin testing
- Real AI proof of concept
```

Rules:

```text
- API key stored only in server environment variable
- Never expose key to frontend
- Validate AI output with Zod
- Store AI result in database
- Apply quota and rate limits
```

## AI Workflow Pattern

Each AI workflow should follow this pattern:

```text
Frontend action
→ Backend API
→ Auth check
→ Rate limit check
→ Load user data from DB
→ Build prompt
→ Call AI provider
→ Validate structured output
→ Save result to DB
→ Return result to frontend
```

## AI Workflows

## 1. Resume Analysis Flow

```text
User pastes resume
→ Frontend calls POST /api/resume/analyze
→ Backend validates resume text
→ AI service analyzes resume
→ System extracts strengths, weaknesses, detected skills, ATS suggestions
→ User confirms detected skills
→ Result saved to database
```

## 2. Job Fit Analysis Flow

```text
User creates job with JD
→ User clicks Analyze
→ Backend loads career profile + skills + resume
→ AI or rule-based service analyzes JD
→ System generates match score, missing skills, recommendation, risks
→ Report saved to database
```

## 3. Tailored Resume Flow

```text
User opens job analysis
→ User clicks Generate Tailored Resume Suggestions
→ Backend loads job, resume version, and analysis report
→ AI suggests positioning, keywords, bullet changes
→ User creates job-specific resume version
```

## 4. Learning Roadmap Flow

```text
System identifies skill gaps
→ User generates roadmap
→ AI / template service creates roadmap items
→ Roadmap and tasks saved to database
→ Dashboard shows learning progress
```

## 5. Interview Feedback Flow

```text
User records interview feedback
→ Backend analyzes questions and stuck points
→ System identifies weak areas
→ Weak areas are saved or updated
→ Learning roadmap is updated
→ User sees suggested practice plan
```

## Resume Export Flow

MVP only exports resumes.

```text
User selects resume version
→ Frontend shows resume preview
→ User clicks Export PDF or Markdown
→ Backend generates file
→ User downloads resume
```

Do not implement:

```text
- Public sharing links
- Report sharing
- Recruiter pages
```

## Data Flow

## Career Profile Data Flow

```text
Onboarding
→ Resume text input
→ Skill detection
→ User confirms skills
→ Career profile saved
→ Dashboard uses profile summary
```

## Job Data Flow

```text
Add Job
→ Store JD
→ Analyze job fit
→ Store analysis report
→ Generate tailored suggestions
→ Create job-specific resume version
```

## Learning Data Flow

```text
Skill gaps
→ Roadmap generation
→ Learning tasks
→ Task completion
→ Progress shown on dashboard
```

## Feedback Loop Data Flow

```text
Interview log
→ Feedback analysis
→ Weak area update
→ Learning roadmap update
→ Better next application
```

## Suggested Directory Structure

```text
src/
  app/
    (public)/
    (dashboard)/
    api/

  components/
    layout/
    shared/
    career-profile/
    resume/
    jobs/
    learning/
    interview/
    knowledge-base/

  server/
    services/
    repositories/
    ai/
      providers/
      prompts/
      schemas/
    auth/
    validations/

  lib/
    db.ts
    env.ts
    utils.ts

  demo-data/
    resume-analysis.json
    job-fit-analysis.json
    tailored-resume.json
    learning-roadmap.json
    interview-feedback.json

  prisma/
    schema.prisma
    seed.ts
```

## Security Architecture

Security rules:

```text
1. All user data belongs to a specific user.
2. API routes must check authentication.
3. API routes must check ownership.
4. AI provider keys must only exist on the server.
5. Public demo should use mock mode.
6. Text input length should be limited.
7. Rate limit AI endpoints.
8. Do not allow users to access other users' exports.
```

## Rate Limiting

For real AI mode, implement quota.

Suggested quota:

```text
Resume analysis: 2/day/user
Job analysis: 5/day/user
Tailored resume: 3/day/user
Learning roadmap: 2/day/user
Interview feedback: 3/day/user
```

For portfolio MVP, rate limiting can be simple:

```text
- Store AIRequestLog in database
- Count requests by user and action within current day
- Reject if over quota
```

## Error Handling Architecture

All backend APIs should return consistent errors.

Shape:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  }
}
```

Common codes:

```text
UNAUTHORIZED
FORBIDDEN
NOT_FOUND
VALIDATION_ERROR
AI_PROVIDER_ERROR
RATE_LIMITED
INTERNAL_ERROR
```

Frontend should display these errors clearly.

## MVP Architecture

MVP should implement:

```text
1. Next.js App Router
2. Auth
3. PostgreSQL + Prisma
4. Career Profile
5. Role-based skill selection
6. Resume analysis with mock provider
7. Job creation
8. Job fit analysis with mock provider
9. Tailored resume suggestions with mock provider
10. Learning roadmap with mock provider
11. Interview feedback loop with mock provider
12. Resume export
```

Real OpenAI provider can be implemented but does not need to be enabled for public demo.

## Future Architecture Extensions

Later features:

```text
- BYOK: Bring Your Own API Key
- Real OpenAI mode for selected users
- Voice interview simulation
- LinkedIn import
- Gmail follow-up reminders
- Calendar interview reminders
- Team or mentor review mode
- More role templates beyond frontend
```

## Development Order

Recommended implementation order:

```text
Phase 1: Foundation
- Next.js project setup
- Tailwind + shadcn/ui
- Prisma + PostgreSQL
- Auth
- Dashboard layout

Phase 2: Career Profile
- Resume paste
- Basic profile form
- Role-based skill selector
- Detected skill confirmation with mock data

Phase 3: Resume Intelligence
- Resume analyzer
- Resume versions
- Resume preview

Phase 4: Jobs
- Job CRUD
- Job list
- Job detail
- Job Fit Analysis mock provider

Phase 5: Tailored Application
- Tailored resume suggestions
- Create job-specific resume version

Phase 6: Learning and Feedback
- Learning roadmap
- Interview logs
- Feedback analysis
- Weak areas

Phase 7: Export and Polish
- Resume PDF export
- Markdown export
- Loading states
- Empty states
- Error states
- README and deployment
```

## Architecture Rules for Cursor

```text
1. Keep frontend, backend, database, and AI concerns separated.
2. Use service layer for business logic.
3. Use provider interface for AI calls.
4. Use mock provider by default.
5. Store generated AI outputs in database.
6. Never call AI provider directly from frontend.
7. Never expose API keys.
8. Validate all user inputs.
9. Check user ownership for all private resources.
10. Build MVP first and avoid overengineering.
```
