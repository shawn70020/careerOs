# CareerOS Database Specification

> **📖 中文摘要**  
> 本文件定義 CareerOS 資料庫設計：PostgreSQL + Prisma ORM、主要實體、Prisma Schema 建議、關聯關係、資料所有權、JSON 欄位使用、索引建議、Seed 資料與開發規範。

## Database

> **中文解說：** 資料庫使用 PostgreSQL，ORM 使用 Prisma。

Use:

```text
PostgreSQL
Prisma ORM
```

## Database Design Principles

> **中文解說：** 資料庫設計須支援使用者職涯檔案、工作/專案經驗、技能、履歷版本、職缺、分析報告、學習路線、面試回饋、知識庫與 AI 輸出，且所有資料以使用者為範圍。

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

> **中文解說：** 資料庫須支援使用者職涯檔案、工作/專案經驗、技能、履歷版本、職缺、分析報告、學習路線、面試回饋、知識庫筆記與 AI 輸出。**所有資料以使用者為範圍（user-scoped）。**

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

> **中文解說：** 主要實體包含 User、CareerProfile、WorkExperience、Project、Skill、UserSkill、ResumeVersion、Job、JobAnalysisReport、TailoredResumeSuggestion、LearningRoadmap、LearningTask、InterviewLog、InterviewQuestion、WeakArea、KnowledgeNote、AIRequestLog。

## Suggested Prisma Models

This is a recommended starting schema. Adjust names as needed.

> **中文解說：** 以下為建議的起始 Prisma Schema，可依實際需求調整命名。User 為根實體，CareerProfile 含基本資訊、目標職缺、履歷原文與 AI 摘要；WorkExperience 與 Project 掛在 CareerProfile 下。

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

> **中文解說：** Skill 為系統技能模板（含 category、roleTags）；UserSkill 為使用者技能關聯，含 level、yearsOfExperience、evidence、source（USER_SELECTED / RESUME_DETECTED / USER_ADDED）。SkillLevel 分為 BEGINNER / FAMILIAR / WORKING_EXPERIENCE / STRONG。

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

> **中文解說：** ResumeVersion 儲存履歷版本，含 name、language（EN/ZH_TW）、targetRole、relatedJobId、contentJson、markdownContent、changeLogJson 等。可綁定特定職缺。

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

> **中文解說：** Job 儲存職缺資訊，含 companyName、jobTitle、description、status（完整應徵管道 enum）、workType、tags 與技能 JSON。關聯 analysisReports、tailoredSuggestions、resumeVersions。

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

> **中文解說：** JobAnalysisReport 儲存 Job Fit 分析結果（各維度分數、技能 JSON、recommendation enum、reasoning）。TailoredResumeSuggestion 儲存客製化履歷建議（positioning、summary、skillsToEmphasize、bulletSuggestions 等 JSON）。

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

> **中文解說：** LearningRoadmap 含 title、targetRole、relatedJobId、source（MANUAL/JOB_ANALYSIS/INTERVIEW_FEEDBACK/AI_GENERATED）。LearningTask 含 priority、status、practiceTasksJson、interviewQuestionsJson 等。

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

> **中文解說：** InterviewLog 記錄面試回饋（公司、階段、優缺點、卡關處、result、aiSummary、weakAreasJson）。InterviewQuestion 為子表，記錄個別問題、回答、AI 評估與 suggestedAnswer。

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

> **中文解說：** WeakArea 追蹤使用者弱點，含 category、severity、source（RESUME_ANALYSIS/JOB_ANALYSIS/INTERVIEW_FEEDBACK 等）、status（ACTIVE/IMPROVING/RESOLVED）與 suggestedActionsJson。

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

> **中文解說：** KnowledgeNote 為使用者筆記，含 title、content、tags、relatedSkill、relatedJobId、source（MANUAL/AI_GENERATED/INTERVIEW/LEARNING_TASK）。

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

> **中文解說：** AIRequestLog 記錄 AI 請求（action enum、mode、provider、token 用量、status），用於配額控制與成本追蹤。userId 可為 null（匿名請求），刪除使用者時設 SetNull。

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

> **中文解說：** 實體關聯樹：User 為根 → CareerProfile（含 WorkExperience、Project）、UserSkill、ResumeVersion、Job（含 JobAnalysisReport、TailoredResumeSuggestion、related ResumeVersion）、LearningRoadmap（含 LearningTask）、InterviewLog（含 InterviewQuestion）、WeakArea、KnowledgeNote。

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

> **中文解說：** 所有使用者資料模型須直接或間接以 `userId` 為範圍。讀取或修改前必須檢查所有權——使用者不可存取他人的 job、resume 或 interview logs。

Every user-owned model should be directly or indirectly scoped to `userId`.

Before reading or modifying data, check ownership.

Examples:

```text
- A user cannot read another user's job.
- A user cannot export another user's resume.
- A user cannot access another user's interview logs.
```

## JSON Fields

> **中文解說：** JSON 欄位用於 AI 輸出與彈性結構化資料（優缺點、技能列表、風險信號、練習任務、面試題等）。MVP 階段不過度正規化 AI 輸出。

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

> **中文解說：** 建議在 userId、status、createdAt 上加索引，優化「依使用者查詢 jobs/resumes/roadmaps/interview logs/weak areas」等常見查詢模式。

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

> **中文解說：** Seed 資料須包含：系統技能模板（含 Frontend/React/Vue/Full-stack 等 role tags）、Demo 使用者、Demo 履歷、Demo 職缺與 Demo AI 報告，供 Portfolio 展示使用。

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

> **中文解說：** 資料庫開發十則：使用 Prisma migrations、schema 可讀且依領域組織、固定狀態用 enum、AI 輸出用 JSON、避免過早過度正規化、後端服務強制檢查所有權、Seed demo 資料、履歷版本保留足夠 immutability 供比較、AI 輸出存 DB 避免重複呼叫、MVP 不存 API Key 到 DB。

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
