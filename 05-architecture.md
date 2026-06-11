# CareerOS System Architecture

> **📖 中文摘要**  
> 本文件描述 CareerOS 系統架構：五層架構（Frontend → API → Domain Services → AI Provider → PostgreSQL）、各層職責、AI 工作流程、資料流、目錄結構、安全與速率限制、MVP 範圍、未來擴展與建議開發順序。

## Architecture Summary

> **中文解說：** CareerOS 是以 Next.js 建置的全端 AI SaaS Portfolio 專案，五層架構：Frontend UI → Backend API → Domain Services → AI Provider Layer → PostgreSQL。

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

> **中文解說：** 高層流程：使用者操作 UI → 前端呼叫 API → API 驗證輸入與 auth → Service 執行業務邏輯 → Prisma 讀寫 DB → AI service 按需呼叫 mock/真實 Provider → 結果存 DB → 前端展示。

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

> **中文解說：** 架構須展示：全端應用設計、前後端分離、認證與資料所有權、資料庫建模、AI 工作流整合、成本可控的 Demo 模式、Provider 抽象與 production 級程式組織。

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

> **中文解說：** 架構圖：Frontend（Next.js/React）經 HTTP 呼叫 Backend API（Route Handlers + Auth/Validation/Quota）→ Domain Services → 分岔至 Prisma/PostgreSQL 與 AI Service（MockProvider / OpenAIProvider）。

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

> **中文解說：** 前端負責 UI 渲染、互動、表單、client 驗證、呼叫 API、loading/error/empty 狀態與 AI 輸出展示。**不可**直接存 DB、直接呼叫 AI、存 API Key 或做最終授權決策。

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

> **中文解說：** 後端負責認證、授權、驗證、業務邏輯、DB 存取、AI 編排、速率限制與匯出。所有路由流程：取得使用者 → Zod 驗證 → 檢查所有權 → 呼叫 service → 回傳型別化回應。

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

> **中文解說：** 業務邏輯集中在 services：CareerProfileService、SkillService、ResumeService、JobService、JobAnalysisService、LearningRoadmapService、InterviewService 等，各負責對應領域的 CRUD 與 AI 分析。

## AI Architecture

> **中文解說：** AI 架構採 Provider 模式，支援 mock（公開 Demo）與 openai（開發/Admin 測試）兩種模式，並預留未來替換 Provider 的能力。

## Why Provider-Based AI Architecture

> **中文解說：** 產品多處需要 AI，但公開 Portfolio 部署須避免 API 成本失控，因此須支援 Mock 模式、真實 AI 模式與未來 Provider 替換。

The product needs AI for many features, but public portfolio deployment should avoid uncontrolled API cost.

So the system should support:

```text
- Mock AI mode for public demo
- Real AI mode for development or admin testing
- Future provider replacement
```

## AI Modes

> **中文解說：** 環境變數 `AI_MODE=mock` 或 `AI_MODE=openai` 切換 AI 模式。

```text
AI_MODE=mock
AI_MODE=openai
```

## Mock Mode

> **中文解說：** Mock 模式用於公開 Demo、成本控制、穩定展示結果、離線開發與測試。回傳 `demo-data/` 下的預產 JSON 或 seeded DB 資料。

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

> **中文解說：** OpenAI 模式用於本地開發、Admin 測試與真實 AI PoC。API Key 僅存伺服器環境變數、Zod 驗證輸出、結果存 DB、套用配額與 rate limit。

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

> **中文解說：** 每個 AI 工作流遵循統一模式：前端操作 → API → auth → rate limit → 從 DB 載入資料 → 建 prompt → 呼叫 Provider → 驗證結構化輸出 → 存 DB → 回傳前端。

## AI Workflows

> **中文解說：** 以下為五大 AI 工作流的端到端流程。

## 1. Resume Analysis Flow

> **中文解說：** 貼上履歷 → POST analyze → 驗證 → AI 分析 → 提取優缺點/技能/ATS 建議 → 使用者確認技能 → 存 DB。

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

> **中文解說：** 建立職缺 → 點 Analyze → 載入 profile/skills/resume → AI 分析 JD → 產生匹配分數/缺失技能/建議/風險 → 報告存 DB。

```text
User creates job with JD
→ User clicks Analyze
→ Backend loads career profile + skills + resume
→ AI or rule-based service analyzes JD
→ System generates match score, missing skills, recommendation, risks
→ Report saved to database
```

## 3. Tailored Resume Flow

> **中文解說：** 開啟 Job 分析 → Generate Tailored Resume → 載入 job/resume/analysis → AI 建議定位/關鍵字/條列 → 使用者建立職缺專屬履歷版本。

```text
User opens job analysis
→ User clicks Generate Tailored Resume Suggestions
→ Backend loads job, resume version, and analysis report
→ AI suggests positioning, keywords, bullet changes
→ User creates job-specific resume version
```

## 4. Learning Roadmap Flow

> **中文解說：** 識別技能缺口 → 產生路線圖 → AI/模板建立 roadmap items → 存 DB → Dashboard 顯示學習進度。

```text
System identifies skill gaps
→ User generates roadmap
→ AI / template service creates roadmap items
→ Roadmap and tasks saved to database
→ Dashboard shows learning progress
```

## 5. Interview Feedback Flow

> **中文解說：** 記錄面試回饋 → 分析問題與卡關處 → 識別弱點 → 更新/新增 WeakArea → 更新 Learning Roadmap → 展示建議練習計畫。

```text
User records interview feedback
→ Backend analyzes questions and stuck points
→ System identifies weak areas
→ Weak areas are saved or updated
→ Learning roadmap is updated
→ User sees suggested practice plan
```

## Resume Export Flow

> **中文解說：** MVP 僅匯出履歷：選版本 → 預覽 → Export PDF/Markdown → 後端產檔 → 下載。不實作公開分享、報告分享或 recruiter 頁面。

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

> **中文解說：** 以下描述各領域的資料流動路徑。

## Career Profile Data Flow

> **中文解說：** Onboarding → 貼履歷 → 技能偵測 → 使用者確認 → 存 Career Profile → Dashboard 使用摘要。

```text
Onboarding
→ Resume text input
→ Skill detection
→ User confirms skills
→ Career profile saved
→ Dashboard uses profile summary
```

## Job Data Flow

> **中文解說：** 新增 Job → 存 JD → Job Fit 分析 → 存報告 → 產生 Tailored 建議 → 建立職缺專屬履歷版本。

```text
Add Job
→ Store JD
→ Analyze job fit
→ Store analysis report
→ Generate tailored suggestions
→ Create job-specific resume version
```

## Learning Data Flow

> **中文解說：** 技能缺口 → 產生路線圖 → 學習任務 → 完成任務 → Dashboard 顯示進度。

```text
Skill gaps
→ Roadmap generation
→ Learning tasks
→ Task completion
→ Progress shown on dashboard
```

## Feedback Loop Data Flow

> **中文解說：** 面試紀錄 → 回饋分析 → 弱點更新 → 路線圖更新 → 下次應徵更好（核心成長循環）。

```text
Interview log
→ Feedback analysis
→ Weak area update
→ Learning roadmap update
→ Better next application
```

## Suggested Directory Structure

> **中文解說：** 建議目錄：`app/`（public/dashboard/api）、`components/`（依領域分組）、`server/`（services/repositories/ai/auth/validations）、`lib/`、`demo-data/`、`prisma/`。

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

> **中文解說：** 安全規則：所有資料屬於特定使用者；API 須驗證 auth 與所有權；AI Key 僅在伺服器；公開 Demo 用 mock；限制文字長度；AI 端點 rate limit；禁止存取他人匯出。

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

> **中文解說：** 真實 AI 模式須實作配額（履歷 2/天、Job 5/天、Tailored 3/天、路線圖 2/天、面試 3/天）。MVP 可簡單實作：用 AIRequestLog 計數當日請求，超額拒絕。

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

> **中文解說：** 後端 API 回傳一致錯誤格式 `{ error: { code, message } }`，前端須清楚展示這些錯誤。

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

> **中文解說：** MVP 須實作：App Router、Auth、PostgreSQL+Prisma、Career Profile、角色技能、Mock Provider 的履歷/Job Fit/Tailored/Roadmap/Interview 分析、Resume Export。OpenAI Provider 可實作但公開 Demo 不必啟用。

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

> **中文解說：** 未來擴展：BYOK（自帶 API Key）、特定使用者啟用真實 OpenAI、語音面試模擬、LinkedIn/Gmail/Calendar 整合、團隊/導師審閱模式、更多職缺模板。

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

> **中文解說：** 建議七階段開發順序：Phase 1 基礎（Next.js/Prisma/Auth/Layout）→ Phase 2 Career Profile → Phase 3 Resume → Phase 4 Jobs → Phase 5 Tailored → Phase 6 Learning/Feedback → Phase 7 Export/Polish。

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

> **中文解說：** Cursor 開發十則：前後端/DB/AI 分離、service 層放業務邏輯、Provider interface 呼叫 AI、預設 mock、AI 輸出存 DB、前端不直接呼叫 AI、不暴露 Key、驗證所有輸入、檢查所有權、先建 MVP 避免過度工程。

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
