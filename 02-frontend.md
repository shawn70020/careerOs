# CareerOS Frontend Specification

> **📖 中文摘要**  
> 本文件定義 CareerOS 前端技術棧、UI/UX 方向、頁面結構、共用元件、資料存取規則、表單驗證、狀態管理、AI 互動體驗與 Demo 模式。前端使用 Next.js App Router + React + TypeScript + Tailwind CSS + shadcn/ui。

## Frontend Framework

> **中文解說：** 前端框架採用 Next.js（App Router）、React、TypeScript、Tailwind CSS 與 shadcn/ui。

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

> **中文解說：** 建議技術棧包含 React Hook Form + Zod 做表單驗證，TanStack Query 與 Zustand 為可選的資料/狀態管理方案，圖示使用 Lucide React。

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

> **中文解說：** 視覺風格應像現代 SaaS Dashboard（參考 Linear、Vercel、Notion），乾淨、極簡、專業、開發者導向。避免過度 playful、大量動畫或複雜視效，優先可讀性、層級清晰、空狀態/載入狀態完善，以及 AI 分析結果的清楚呈現。

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

> **中文解說：** 已登入 App 使用 Dashboard 版型：左側 Sidebar、頂部 Header、主內容區。Sidebar 導覽包含 Dashboard、Career Profile、Resume、Jobs、Learning、Interview、Knowledge Base、Settings。

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

> **中文解說：** App Router 目錄結構分為 `(public)` 公開頁（首頁、登入、註冊）、`(dashboard)` 需登入的功能頁，以及 `api/` 後端路由。各模組（履歷、職缺、學習、面試等）皆有對應的 page 路由。

## Main Frontend Pages

> **中文解說：** 以下為 17 個主要前端頁面及其用途與 UI 需求。

## 1. Landing Page

> **中文解說：** 首頁說明 CareerOS 能做什麼，包含 Hero、問題陳述、核心流程、功能亮點與 Demo CTA。主訊息：分析 JD、客製化履歷、找出技能缺口、每次面試後持續改進。

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

> **中文解說：** 註冊後引導使用者：貼上履歷 → 選擇目標職缺 → 確認偵測技能 → 檢視初始 Career Profile 分析結果。

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

> **中文解說：** Dashboard 顯示應徵管道摘要、已儲存/已投遞職缺、即將到來的面試準備、目前弱點、學習任務與最佳匹配職缺。可用卡片呈現 Job Applications、Resume Score、Weak Areas、Learning Progress、Recent Interview Feedback。

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

> **中文解說：** 顯示基本資訊、目標職缺、工作/專案經驗、技能與 AI 職涯摘要。支援編輯、新增經驗/專案/技能，以及重新執行分析。

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

> **中文解說：** 技能選擇 UI 須支援角色模板、分類勾選、搜尋、自訂技能，以及履歷偵測技能的確認/移除。每個技能 chip 顯示名稱、分類、來源與熟練度。

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

> **中文解說：** 履歷分析頁提供貼上區、分析按鈕、分數、優缺點、ATS 建議與改善建議。須有載入/錯誤狀態、支援 mock 回應，並保持原文可見。

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

> **中文解說：** 管理多個履歷版本：列表、建立、複製、查看詳情、（可選）比較差異、綁定目標職缺。每版含名稱、語言、目標職缺、關聯職缺與日期。

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

> **中文解說：** 顯示履歷預覽、各區塊、條列、AI 建議與變更紀錄。支援編輯、匯出 PDF/Markdown。

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

> **中文解說：** MVP 僅匯出履歷：選版本、預覽、匯出 PDF 或 Markdown。不建公開分享功能。

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

> **中文解說：** 職缺列表顯示公司、職稱、狀態、匹配分數、標籤、工作型態與更新時間。可依狀態、分數、工作型態、標籤、技能篩選。MVP 先用表格，Kanban 後續加入。

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

> **中文解說：** 新增職缺：貼上 JD、手動填寫資訊或貼上 URL 供參考。欄位含公司、職稱、URL、地點、工作型態、薪資與 JD 全文。

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

> **中文解說：** 職缺詳情顯示基本資訊、JD、狀態、標籤、匹配分數、Job Fit 分析、Tailored Application 建議與關聯履歷版本。可執行分析、產生客製化建議、建立職缺專屬履歷、更新狀態。

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

> **中文解說：** 以卡片與清楚區塊呈現整體匹配分數、技術/經驗匹配、遠端/英文準備度、作品集支持、必備/加分/缺失技能、Apply 建議與風險信號。**不可只顯示數字，必須附理由說明。**

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

> **中文解說：** 顯示學習路線圖列表與詳情：目標職缺、關聯職缺、缺口來源、進度與任務。詳情含主題、優先級、理由、預估工作量、學習/練習任務與面試題。

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

> **中文解說：** 面試頁顯示面試紀錄、已儲存問題、面試衍生的弱點與建議練習題。

Display:

```text
- Interview logs
- Saved questions
- Weak areas from interviews
- Suggested practice questions
```

## 16. Add Interview Feedback Page

> **中文解說：** 記錄公司、職缺、日期、階段、問題、回答、優缺點、卡關處與結果。儲存後可觸發回饋分析。

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

> **中文解說：** MVP 簡易筆記系統：列表、建立/編輯、標籤，以及關聯技能/職缺。

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

> **中文解說：** 建議的共用元件目錄結構，涵蓋 layout、shared、career-profile、resume、jobs、learning、interview 等領域元件，便於複用與維護。

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

> **中文解說：** 前端**不可**直接存取資料庫、存放 API Key、做最終權限檢查或直接呼叫 AI。**應**透過後端 API、表單驗證，並妥善處理 loading/error/empty 狀態，UI 狀態與伺服器狀態分離。

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

> **中文解說：** 表單使用 React Hook Form + Zod，前後端皆須驗證。

Use:

```text
React Hook Form + Zod
```

Validation should exist both on frontend and backend.

## State Management

> **中文解說：** 小型 UI 狀態用 local React state；篩選條件可用 URL search params；伺服器資料用 TanStack Query 或 Server Components；僅在必要時使用 Zustand 做全域 client state。

Use local React state for small UI states.

Use URL search params for filters when useful.

Use TanStack Query or server components for server data.

Use Zustand only if global client state becomes necessary.

## AI UX Requirements

> **中文解說：** AI 操作須顯示處理中狀態、重試選項、錯誤訊息，產生後儲存結果且不遺失使用者輸入。常見 AI 操作：履歷分析、Job Fit 分析、客製化履歷建議、學習路線圖、面試回饋分析。

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

> **中文解說：** 產品須支援 Demo 模式：可選 demo 履歷/JD，AI 結果為 mock 或預產，完整流程仍可展示。顯示「Demo Mode」標籤以控制公開部署的 API 成本。

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

> **中文解說：** 遵循基本無障礙：正確 label、鍵盤可操作表單、清楚 focus 狀態、語意化 HTML、良好色彩對比。

Follow basic accessibility practices:

```text
- Proper labels
- Keyboard-accessible forms
- Clear focus states
- Semantic HTML
- Good color contrast
```

## Frontend Development Rules

> **中文解說：** 前端開發十則：全面 TypeScript、小元件、優先 Server Components、Client Components 僅用於互動、業務邏輯不進 UI、複用 card/badge/form/list 元件、必實作 loading/empty/error、不暴露 secrets、領域資料夾、保持 UI 乾淨專業。

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
