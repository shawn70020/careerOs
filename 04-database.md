# CareerOS Database Specification

## Database

Use:

```text
PostgreSQL
Prisma ORM
```

## Database Design Principles

The database should support:

```text
- User-owned career profiles
- Work experiences
- Projects
- Skills
- Resume versions
- Jobs
- Job analysis reports
- Learning roadmaps
- Interview feedback
- Knowledge base notes
- AI outputs
```

Data should be scoped to users.

## Main Entities

```text
User
CareerProfile
WorkExperience
Project
Skill
UserSkill
ResumeVersion
Job
JobAnalysisReport
TailoredResumeSuggestion
LearningRoadmap
LearningTask
InterviewLog
InterviewQuestion
WeakArea
KnowledgeNote
AIRequestLog
```

## Suggested Prisma Models

This is a recommended starting schema. Adjust names as needed.

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  image     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  careerProfile CareerProfile?
  skills         UserSkill[]
  resumeVersions ResumeVersion[]
  jobs           Job[]
  learningRoadmaps LearningRoadmap[]
  interviewLogs InterviewLog[]
  weakAreas      WeakArea[]
  notes          KnowledgeNote[]
  aiRequestLogs  AIRequestLog[]
}

model CareerProfile {
  id        String   @id @default(cuid())
  userId    String   @unique
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  fullName        String?
  englishName     String?
  email           String?
  phone           String?
  location        String?
  linkedInUrl     String?
  githubUrl       String?
  portfolioUrl    String?
  personalWebsite String?

  currentTitle    String?
  targetRoles     String[]
  yearsOfExperience Float?
  preferredWorkTypes String[]
  preferredLocations String[]
  expectedSalary  String?
  availableFrom   DateTime?

  resumeText      String?
  aiSummary       String?
  strengthsJson   Json?
  weaknessesJson  Json?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  experiences WorkExperience[]
  projects    Project[]
}

model WorkExperience {
  id        String   @id @default(cuid())
  profileId String
  profile   CareerProfile @relation(fields: [profileId], references: [id], onDelete: Cascade)

  companyName String
  jobTitle    String
  startDate   DateTime?
  endDate     DateTime?
  isCurrent   Boolean @default(false)

  description String?
  technologies String[]
  responsibilitiesJson Json?
  achievementsJson Json?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Project {
  id        String   @id @default(cuid())
  profileId String
  profile   CareerProfile @relation(fields: [profileId], references: [id], onDelete: Cascade)

  name        String
  type        ProjectType
  projectUrl  String?
  githubUrl   String?
  demoUrl     String?
  description String?
  technologies String[]
  background  String?
  problem     String?
  responsibility String?
  technicalChallenges String?
  solution    String?
  result      String?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum ProjectType {
  COMPANY
  PERSONAL
  SIDE_PROJECT
  OPEN_SOURCE
}
```

## Skill Models

```prisma
model Skill {
  id        String   @id @default(cuid())
  name      String
  category  String
  roleTags  String[]
  source    SkillSource @default(SYSTEM)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  users UserSkill[]

  @@unique([name, category])
}

model UserSkill {
  id      String @id @default(cuid())
  userId  String
  user    User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  skillId String
  skill   Skill  @relation(fields: [skillId], references: [id], onDelete: Cascade)

  level   SkillLevel @default(FAMILIAR)
  yearsOfExperience Float?
  evidenceJson Json?
  confidence Float?
  source UserSkillSource @default(USER_SELECTED)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([userId, skillId])
}

enum SkillSource {
  SYSTEM
  USER_ADDED
}

enum UserSkillSource {
  USER_SELECTED
  RESUME_DETECTED
  USER_ADDED
}

enum SkillLevel {
  BEGINNER
  FAMILIAR
  WORKING_EXPERIENCE
  STRONG
}
```

## Resume Models

```prisma
model ResumeVersion {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  name       String
  language   ResumeLanguage @default(EN)
  targetRole String?
  relatedJobId String?
  relatedJob   Job? @relation(fields: [relatedJobId], references: [id])

  contentJson Json
  markdownContent String?
  originalResumeText String?
  changeLogJson Json?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum ResumeLanguage {
  EN
  ZH_TW
}
```

## Job Models

```prisma
model Job {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  companyName String
  jobTitle    String
  jobUrl      String?
  location    String?
  workType    WorkType?
  salaryRange String?
  description String

  status JobStatus @default(SAVED)
  tags   String[]

  requiredSkillsJson Json?
  niceToHaveSkillsJson Json?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  analysisReports JobAnalysisReport[]
  tailoredSuggestions TailoredResumeSuggestion[]
  resumeVersions ResumeVersion[]
}

enum WorkType {
  REMOTE
  HYBRID
  ONSITE
  UNKNOWN
}

enum JobStatus {
  SAVED
  ANALYZING
  INTERESTED
  NOT_SUITABLE
  READY_TO_APPLY
  APPLIED
  HR_SCREEN
  TECHNICAL_INTERVIEW
  FINAL_INTERVIEW
  OFFER
  REJECTED
  WITHDRAWN
}
```

## Job Analysis Models

```prisma
model JobAnalysisReport {
  id     String @id @default(cuid())
  jobId  String
  job    Job    @relation(fields: [jobId], references: [id], onDelete: Cascade)

  overallScore     Int
  technicalMatch   Int?
  experienceMatch  Int?
  remoteReadiness  Int?
  englishReadiness Int?
  portfolioSupport Int?

  mustHaveSkillsJson Json?
  niceToHaveSkillsJson Json?
  missingSkillsJson Json?
  risksJson Json?
  recommendation ApplyRecommendation
  reasoning String?

  aiProvider String?
  aiMode     String?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum ApplyRecommendation {
  STRONG_APPLY
  WORTH_APPLYING
  STRETCH_ROLE
  NOT_RECOMMENDED
}

model TailoredResumeSuggestion {
  id     String @id @default(cuid())
  jobId  String
  job    Job    @relation(fields: [jobId], references: [id], onDelete: Cascade)

  positioning String?
  summarySuggestion String?
  skillsToEmphasizeJson Json?
  bulletSuggestionsJson Json?
  keywordsToAddJson Json?
  sectionsToReduceJson Json?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Learning Models

```prisma
model LearningRoadmap {
  id      String @id @default(cuid())
  userId  String
  user    User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  title       String
  targetRole  String?
  relatedJobId String?
  source      RoadmapSource @default(MANUAL)

  summary     String?
  generatedFromJson Json?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  tasks LearningTask[]
}

model LearningTask {
  id        String @id @default(cuid())
  roadmapId String
  roadmap   LearningRoadmap @relation(fields: [roadmapId], references: [id], onDelete: Cascade)

  title       String
  topic       String?
  skillName   String?
  priority    Priority @default(MEDIUM)
  reason      String?
  estimatedEffort String?
  status      LearningTaskStatus @default(NOT_STARTED)

  notes       String?
  practiceTasksJson Json?
  interviewQuestionsJson Json?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum RoadmapSource {
  MANUAL
  JOB_ANALYSIS
  INTERVIEW_FEEDBACK
  AI_GENERATED
}

enum LearningTaskStatus {
  NOT_STARTED
  IN_PROGRESS
  COMPLETED
  SKIPPED
}

enum Priority {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}
```

## Interview Models

```prisma
model InterviewLog {
  id      String @id @default(cuid())
  userId  String
  user    User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  companyName String
  jobTitle    String?
  jobId       String?
  interviewDate DateTime?
  stage       InterviewStage?

  interviewerRole String?
  whatWentWell String?
  whatWentBadly String?
  stuckPoints String?
  result InterviewResult?
  notes String?

  aiSummary String?
  weakAreasJson Json?
  suggestedPracticeJson Json?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  questions InterviewQuestion[]
}

model InterviewQuestion {
  id      String @id @default(cuid())
  logId   String
  log     InterviewLog @relation(fields: [logId], references: [id], onDelete: Cascade)

  question String
  category String?
  userAnswer String?
  aiEvaluation String?
  suggestedAnswer String?
  relatedSkill String?
  addToMistakeBook Boolean @default(false)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum InterviewStage {
  HR_SCREEN
  TECHNICAL_INTERVIEW
  FINAL_INTERVIEW
  OTHER
}

enum InterviewResult {
  PENDING
  PASSED
  REJECTED
  WITHDRAWN
  UNKNOWN
}
```

## Weak Area Model

```prisma
model WeakArea {
  id      String @id @default(cuid())
  userId  String
  user    User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  title       String
  category    String?
  severity    Priority @default(MEDIUM)
  source      WeakAreaSource
  evidenceJson Json?
  suggestedActionsJson Json?
  status      WeakAreaStatus @default(ACTIVE)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum WeakAreaSource {
  RESUME_ANALYSIS
  JOB_ANALYSIS
  INTERVIEW_FEEDBACK
  QUIZ
  USER_MANUAL
}

enum WeakAreaStatus {
  ACTIVE
  IMPROVING
  RESOLVED
}
```

## Knowledge Base Model

```prisma
model KnowledgeNote {
  id      String @id @default(cuid())
  userId  String
  user    User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  title   String
  content String
  tags    String[]
  relatedSkill String?
  relatedJobId String?
  source  NoteSource @default(MANUAL)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum NoteSource {
  MANUAL
  AI_GENERATED
  INTERVIEW
  LEARNING_TASK
}
```

## AI Request Log

```prisma
model AIRequestLog {
  id      String @id @default(cuid())
  userId  String?
  user    User?  @relation(fields: [userId], references: [id], onDelete: SetNull)

  action  AIAction
  mode    String
  provider String?
  inputTokens Int?
  outputTokens Int?
  status AIRequestStatus
  errorMessage String?

  createdAt DateTime @default(now())
}

enum AIAction {
  RESUME_ANALYSIS
  JOB_ANALYSIS
  TAILORED_RESUME
  LEARNING_ROADMAP
  INTERVIEW_FEEDBACK
}

enum AIRequestStatus {
  SUCCESS
  FAILED
  RATE_LIMITED
}
```

## Important Relationships

```text
User
  ├── CareerProfile
  │     ├── WorkExperience
  │     └── Project
  ├── UserSkill
  ├── ResumeVersion
  ├── Job
  │     ├── JobAnalysisReport
  │     ├── TailoredResumeSuggestion
  │     └── related ResumeVersion
  ├── LearningRoadmap
  │     └── LearningTask
  ├── InterviewLog
  │     └── InterviewQuestion
  ├── WeakArea
  └── KnowledgeNote
```

## Data Ownership

Every user-owned model should be directly or indirectly scoped to `userId`.

Before reading or modifying data, check ownership.

Examples:

```text
- A user cannot read another user's job.
- A user cannot export another user's resume.
- A user cannot access another user's interview logs.
```

## JSON Fields

JSON fields are acceptable for AI outputs and flexible structured data.

Use JSON for:

```text
- AI-generated strengths
- AI-generated weaknesses
- Bullet suggestions
- Required skills
- Missing skills
- Risk signals
- Practice tasks
- Interview questions
```

Do not over-normalize AI output in MVP.

## Index Recommendations

Add indexes for common access patterns:

```prisma
@@index([userId])
@@index([status])
@@index([createdAt])
```

Important query patterns:

```text
- Get all jobs by user
- Filter jobs by status
- Get resume versions by user
- Get learning roadmaps by user
- Get interview logs by user
- Get weak areas by user
```

## Seed Data

Create seed data for:

```text
- System skill templates
- Frontend skill list
- Demo user
- Demo resume
- Demo job
- Demo AI reports
```

Skill seed should include role tags:

```text
Frontend Engineer
React Developer
Vue Developer
Full-stack Engineer
```

## Database Development Rules

```text
1. Use Prisma migrations.
2. Keep schema readable and domain-based.
3. Use enums for fixed statuses.
4. Use JSON for flexible AI outputs.
5. Avoid premature over-normalization.
6. Always enforce user ownership in backend services.
7. Seed demo data for portfolio presentation.
8. Keep resume versions immutable enough for comparison.
9. Store AI outputs so repeated page views do not call AI again.
10. Do not store provider API keys in database for MVP.
```
