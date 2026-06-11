# CareerOS Backend Specification

> **📖 中文摘要**  
> 本文件定義 CareerOS 後端架構：Next.js Route Handlers、Prisma + PostgreSQL、認證授權、REST-like API 設計、Service/Repository 分層、AI 整合策略（Mock/OpenAI 可切換）、速率限制與錯誤處理規範。

## Backend Approach

> **中文解說：** 後端優先使用 Next.js 內建能力，技術棧為 Route Handlers、TypeScript、Prisma、PostgreSQL、Auth.js/Clerk、Zod 與 OpenAI（或相容 AI 提供者）。MVP 可建置為 Next.js 全端應用。

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

> **中文解說：** 後端負責認證 session、授權與資料所有權、輸入驗證、DB 存取、AI 編排，以及履歷/職缺/學習/面試分析與匯出產生。

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

> **中文解說：** 後端負責 session 驗證、授權與資料所有權檢查、輸入驗證、資料庫存取、AI 編排，以及履歷/職缺/學習/面試分析與匯出。**絕不信任前端傳入的資料。**

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

> **中文解說：** API 採 REST-like 風格，路由依領域分組：auth、career-profile、skills、resume、jobs、learning、interview、knowledge-base、ai、export。

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

> **中文解說：** 後端目錄分層：`server/services` 放業務邏輯、`repositories` 放資料存取、`ai` 放 provider/prompts/schemas、`auth` 放認證、`validations` 放 Zod schema，`lib` 放 db/env/utils 等共用工具。

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

> **中文解說：** MVP 認證需求：註冊、登入、登出、取得當前使用者、保護 Dashboard 路由與 API 路由。所有使用者資料相關 API 都須驗證當前使用者身份。

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

> **中文解說：** 授權規則：使用者只能存取自己的 career profile、jobs、resume versions、learning roadmaps、interview logs。Admin 專用 AI 測試端點不可公開。

## API Routes

> **中文解說：** 以下為各領域 API 端點規格，包含 Career Profile、Work Experience、Project、Skills、Resume、Job、Job Analysis、Learning、Interview、Knowledge Base 與 Export。

## 1. Career Profile APIs

> **中文解說：** GET 取得、POST 建立、PATCH 更新當前使用者的 career profile。

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

> **中文解說：** 工作經驗 CRUD：POST 建立、PATCH 更新、DELETE 刪除。

### POST /api/career-profile/experiences

Creates work experience.

### PATCH /api/career-profile/experiences/:id

Updates work experience.

### DELETE /api/career-profile/experiences/:id

Deletes work experience.

## 3. Project APIs

> **中文解說：** 專案經驗 CRUD：POST 建立、PATCH 更新、DELETE 刪除。

### POST /api/career-profile/projects

Creates project.

### PATCH /api/career-profile/projects/:id

Updates project.

### DELETE /api/career-profile/projects/:id

Deletes project.

## 4. Skills APIs

> **中文解說：** 技能 API：GET templates 依角色取得預設技能、GET/POST/PATCH/DELETE user-skills 管理使用者技能。

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

> **中文解說：** 履歷 API：POST analyze 分析貼上履歷（支援 mock mode）、GET/POST/PATCH/DELETE versions 管理履歷版本。

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

> **中文解說：** 職缺 CRUD，GET 支援 status/workType/tag/skill 篩選。

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

> **中文解說：** POST analyze 執行 Job Fit 分析（回傳匹配分數、技能、建議、風險與 reasoning）；POST tailored-resume 產生客製化履歷建議。

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

> **中文解說：** 學習路線圖 GET 列表、POST generate 依 profile/job/缺口產生、GET 詳情、PATCH 更新 task 狀態。

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

> **中文解說：** 面試紀錄 CRUD，POST analyze 分析回饋（回傳 weakAreas、suggestedPractice、roadmapUpdates、summary）。

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

> **中文解說：** 知識庫筆記 CRUD。

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

> **中文解說：** MVP 僅支援履歷匯出：POST PDF、GET Markdown。不實作報告分享或公開連結。

### POST /api/export/resume/:versionId/pdf

Generates PDF resume.

### GET /api/export/resume/:versionId/markdown

Returns Markdown resume content.

MVP only supports resume export.

Do not implement report sharing or public links.

## AI Integration

> **中文解說：** AI 整合採 Provider 架構，支援 Mock 與 OpenAI 切換，公開 Demo 用 mock，開發/Admin 可用真實 API。

## AI Provider Strategy

> **中文解說：** AI 層須支援 Provider 切換：`AIProvider interface → MockProvider → OpenAIProvider → 未來其他 Provider`。

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

> **中文解說：** 環境變數 `AI_MODE=mock|openai`，`OPENAI_API_KEY` 僅在 openai 模式使用。

## AI Provider Interface

Suggested TypeScript interface:

```ts
export interface AIProvider {
  generateText(input: AITextRequest): Promise<AITextResponse>;
  generateStructuredData<T>(input: AIStructuredRequest): Promise<T>;
}
```

## Mock Provider

> **中文解說：** Mock Provider 回傳預產 JSON，用於公開 Demo、自動化測試、離線開發與成本控制。資料放在 `src/demo-data/` 目錄。

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

> **中文解說：** OpenAI Provider 僅在伺服器端執行，從環境變數讀取 API Key，回傳結構化 JSON 並以 Zod 驗證輸出，絕不暴露 Key 給前端。

OpenAI provider should:

```text
- Only run server-side
- Read API key from environment variables
- Never expose key to frontend
- Return structured JSON
- Validate model output with Zod
```

## AI Use Cases

> **中文解說：** 五大 AI 使用場景及其輸入/輸出規格。

### Resume Analysis

> **中文解說：** 輸入：履歷文字、目標職缺、使用者技能。輸出：分數、優缺點、偵測技能、ATS 建議、條列改善建議。

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

> **中文解說：** 輸入：JD、career profile、技能、履歷。輸出：匹配分數、必備/缺失技能、Apply 建議、風險與 reasoning。

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

> **中文解說：** 輸入：履歷版本、JD、Job Fit 分析。輸出：定位建議、摘要改寫、條列建議、技能強調、關鍵字。

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

> **中文解說：** 輸入：目標職缺、缺失技能、面試回饋。輸出：路線圖項目、優先級、學習/練習任務、面試題。

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

> **中文解說：** 輸入：面試問題、使用者回答、自我評估、（可選）JD。輸出：弱點、建議練習、路線圖更新、更好的回答建議。

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

> **中文解說：** 啟用真實 AI 時須實作：每使用者每日配額、每操作限制、基本 IP rate limit、AI 請求日誌。範例配額：履歷分析 2 次/天、Job 分析 5 次/天、路線圖 2 次/天、面試回饋 3 次/天。

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

> **中文解說：** 所有 POST/PATCH 請求用 Zod 驗證；AI 輸出儲存前也須驗證；拒絕無效 enum；限制履歷/JD 文字長度；必要時清理使用者輸入。

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

> **中文解說：** 所有 API 回傳一致錯誤格式 `{ error: { code, message } }`。常見 code：UNAUTHORIZED、FORBIDDEN、NOT_FOUND、VALIDATION_ERROR、AI_PROVIDER_ERROR、RATE_LIMITED、INTERNAL_ERROR。

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

> **中文解說：** 後端開發十則：業務邏輯在 services、DB 查詢在 repositories/service、AI 僅後端呼叫、不暴露 API Key、Zod 驗證所有輸入、檢查資料所有權、AI 輸出存 DB 供重用、公開 Demo 用 mock、優先結構化 AI 回應、API 回應穩定且型別化。

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
