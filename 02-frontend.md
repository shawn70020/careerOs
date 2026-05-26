# CareerOS Frontend Specification

## Frontend Framework

Use:

```text
Next.js
React
TypeScript
Tailwind CSS
shadcn/ui
```

The project should use Next.js App Router.

## Recommended Frontend Stack

```text
- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Hook Form
- Zod
- TanStack Query, optional
- Zustand, optional for complex client state
- Lucide React for icons
```

## UI / UX Direction

The product should look like a modern SaaS dashboard.

Visual style:

```text
- Clean
- Minimal
- Professional
- Developer-focused
- Similar feeling to Linear / Vercel / Notion / modern AI SaaS tools
```

Avoid:

```text
- Overly playful UI
- Heavy animations
- Too many colors
- Complicated visual effects
```

Prioritize:

```text
- Readability
- Clear hierarchy
- Useful empty states
- Good loading states
- Clear AI analysis results
- Good form UX
```

## Layout

Authenticated app should use a dashboard layout:

```text
Left Sidebar
Top Header
Main Content Area
```

Sidebar navigation:

```text
- Dashboard
- Career Profile
- Resume
- Jobs
- Learning
- Interview
- Knowledge Base
- Settings
```

## Page Structure

Suggested App Router structure:

```text
src/
  app/
    (public)/
      page.tsx
      login/page.tsx
      register/page.tsx

    (dashboard)/
      layout.tsx
      dashboard/page.tsx

      career-profile/page.tsx
      career-profile/edit/page.tsx

      resume/page.tsx
      resume/analyzer/page.tsx
      resume/versions/page.tsx
      resume/versions/[id]/page.tsx
      resume/export/page.tsx

      jobs/page.tsx
      jobs/new/page.tsx
      jobs/[id]/page.tsx
      jobs/[id]/analysis/page.tsx

      learning/page.tsx
      learning/roadmaps/[id]/page.tsx
      learning/tasks/[id]/page.tsx

      interview/page.tsx
      interview/logs/new/page.tsx
      interview/logs/[id]/page.tsx

      knowledge-base/page.tsx
      knowledge-base/[id]/page.tsx

      settings/page.tsx

    api/
      ...
```

## Main Frontend Pages

## 1. Landing Page

Purpose:

```text
Explain what CareerOS does.
```

Sections:

```text
- Hero
- Product problem
- Core workflow
- Feature highlights
- Demo CTA
```

Main message:

```text
Analyze job descriptions, tailor your resume, find skill gaps, and improve with every interview.
```

## 2. Onboarding Flow

After registration, guide user through:

```text
1. Paste resume
2. Select target role
3. Confirm detected skills
4. Review initial Career Profile
```

Pages or steps:

```text
- Upload / paste resume
- Select role
- Confirm skills
- Initial analysis result
```

## 3. Dashboard

Dashboard should show:

```text
- Application pipeline summary
- Saved jobs
- Applied jobs
- Upcoming interview preparation
- Current weak areas
- Current learning tasks
- Best matched jobs
```

Possible cards:

```text
- Job Applications
- Resume Score
- Current Weak Areas
- Learning Progress
- Recent Interview Feedback
```

## 4. Career Profile Page

Displays user's profile:

```text
- Basic information
- Target roles
- Work experience
- Projects
- Skills
- AI career profile summary
```

Actions:

```text
- Edit profile
- Add work experience
- Add project
- Add skill
- Re-run profile analysis
```

## 5. Skill Selection UI

Skill system must support:

```text
- Role-based skill templates
- Checkbox selection
- Category grouping
- Search skills
- Add custom skill
- Confirm resume-detected skills
```

UX behavior:

```text
1. User selects role: Frontend Engineer
2. Show grouped skill options
3. User selects skills
4. System also shows detected skills from resume
5. User confirms or removes detected skills
```

Each skill card/chip should show:

```text
- Skill name
- Category
- Source
- Level
```

## 6. Resume Analyzer Page

User can paste resume text.

UI sections:

```text
- Resume input area
- Analyze button
- Resume score
- Strengths
- Weaknesses
- ATS suggestions
- Improvement suggestions
```

Important UX:

```text
- Show loading state while analyzing
- Show error state if AI fails
- Support mock/demo response
- Keep original resume text visible
```

## 7. Resume Versions Page

User can manage resume versions.

Features:

```text
- List resume versions
- Create version
- Duplicate version
- View version detail
- Compare version changes, optional
- Bind version to a target job
```

Each resume version has:

```text
- Name
- Language
- Target role
- Related job
- Created date
- Updated date
```

## 8. Resume Version Detail Page

Display:

```text
- Resume preview
- Sections
- Bullet points
- AI suggestions
- Change log
```

Actions:

```text
- Edit
- Export PDF
- Export Markdown
```

## 9. Resume Export Page

MVP export only resumes.

Features:

```text
- Select resume version
- Preview resume
- Export PDF
- Export Markdown
```

Do not build public sharing.

## 10. Jobs List Page

Display jobs:

```text
- Company
- Job title
- Status
- Match score
- Tags
- Work type
- Last updated
```

Filters:

```text
- Status
- Match score
- Work type
- Tags
- Skill
```

MVP can start with table view.

Kanban can be added later.

## 11. Add Job Page

User can add a job by:

```text
- Pasting job description
- Manually entering job info
- Pasting job URL for reference
```

Fields:

```text
- Company name
- Job title
- Job URL
- Location
- Work type
- Salary range
- Job description
```

## 12. Job Detail Page

Display:

```text
- Job information
- Job description
- Job status
- Tags
- Match score
- Job Fit Analysis
- Tailored Application suggestions
- Related resume version
```

Actions:

```text
- Run Job Fit Analysis
- Generate Tailored Resume Suggestions
- Create Resume Version for this Job
- Update status
```

## 13. Job Fit Analysis UI

Show:

```text
- Overall match score
- Technical match
- Experience match
- Remote readiness
- English readiness
- Portfolio support
- Must-have skills
- Nice-to-have skills
- Missing skills
- Apply recommendation
- Job risk signals
```

Use cards and clear sections.

Avoid showing only a number. Always show reasoning.

## 14. Learning Roadmap Page

Display roadmaps.

Each roadmap:

```text
- Target role
- Related job
- Generated from skill gaps
- Progress
- Tasks
```

Roadmap detail should show:

```text
- Topic
- Priority
- Reason
- Estimated effort
- Learning tasks
- Practice tasks
- Interview questions
```

## 15. Interview Page

Display:

```text
- Interview logs
- Saved questions
- Weak areas from interviews
- Suggested practice questions
```

## 16. Add Interview Feedback Page

User records:

```text
- Company
- Job
- Interview date
- Stage
- Questions asked
- Own answer
- What went well
- What went badly
- Stuck points
- Result
```

After saving, system can run feedback analysis.

## 17. Knowledge Base Page

MVP simple note system.

Features:

```text
- Note list
- Create note
- Edit note
- Tags
- Related skill
- Related job
```

## Shared Components

Recommended components:

```text
components/
  layout/
    AppSidebar.tsx
    DashboardHeader.tsx
    PageHeader.tsx

  shared/
    EmptyState.tsx
    LoadingState.tsx
    ErrorState.tsx
    ConfirmDialog.tsx
    ScoreBadge.tsx
    StatusBadge.tsx
    SkillBadge.tsx
    SectionCard.tsx

  career-profile/
    ProfileSummaryCard.tsx
    WorkExperienceForm.tsx
    ProjectForm.tsx
    SkillSelector.tsx
    DetectedSkillReview.tsx

  resume/
    ResumeInput.tsx
    ResumeScoreCard.tsx
    ResumePreview.tsx
    ResumeVersionList.tsx
    ResumeExportPanel.tsx
    BulletSuggestionCard.tsx

  jobs/
    JobForm.tsx
    JobTable.tsx
    JobStatusBadge.tsx
    JobFitScoreCard.tsx
    JobAnalysisPanel.tsx
    MissingSkillList.tsx
    JobRiskPanel.tsx

  learning/
    RoadmapList.tsx
    RoadmapTimeline.tsx
    LearningTaskCard.tsx

  interview/
    InterviewLogForm.tsx
    InterviewQuestionCard.tsx
    FeedbackAnalysisPanel.tsx
```

## Frontend Data Rules

Frontend should not:

```text
- Access database directly
- Store API keys in client code
- Implement final permission checks
- Call AI provider directly
```

Frontend should:

```text
- Call backend API routes
- Use forms with validation
- Show loading, error, and empty states
- Keep UI state separate from server state
```

## Forms

Use:

```text
React Hook Form + Zod
```

Validation should exist both on frontend and backend.

## State Management

Use local React state for small UI states.

Use URL search params for filters when useful.

Use TanStack Query or server components for server data.

Use Zustand only if global client state becomes necessary.

## AI UX Requirements

For AI actions:

```text
- Show processing state
- Show retry option
- Show error message
- Save AI output after generation
- Do not lose user input
```

AI action examples:

```text
- Analyze resume
- Analyze job fit
- Generate tailored resume suggestions
- Generate learning roadmap
- Analyze interview feedback
```

## Demo Mode UX

The product should support demo mode.

In demo mode:

```text
- User can select demo resume
- User can select demo job description
- AI results are mock or pre-generated
- Full workflow is still visible
```

Show a small label:

```text
Demo Mode
```

This helps avoid API cost in public portfolio deployment.

## Accessibility

Follow basic accessibility practices:

```text
- Proper labels
- Keyboard-accessible forms
- Clear focus states
- Semantic HTML
- Good color contrast
```

## Frontend Development Rules

```text
1. Use TypeScript everywhere.
2. Keep components small.
3. Prefer server components for data display when possible.
4. Use client components only for interactive UI.
5. Keep business logic out of UI components.
6. Create reusable components for cards, badges, forms, and lists.
7. Always implement loading, empty, and error states.
8. Do not expose secrets in frontend.
9. Use domain-based folders.
10. Keep UI clean and professional.
```
