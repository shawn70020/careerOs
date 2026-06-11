# CareerOS Overview

> **📖 中文摘要**  
> CareerOS 是專為軟體工程師設計的 AI 求職與技能成長平台。從真實履歷出發，分析職缺描述（JD）、優化履歷定位、產生客製化應徵策略、建立以工作為導向的學習路線圖，並依面試回饋持續改進。本文檔定義產品定位、核心原則、功能模組、MVP 範圍與排除項目。

## Product Name

> **中文解說：** 產品正式名稱為 **CareerOS**（職涯作業系統）。

**CareerOS**

## Product Positioning

> **中文解說：** CareerOS 是 AI 驅動的軟體工程師求職與技能成長平台，從真實履歷與工作經驗出發，協助分析 JD、優化履歷、產生應徵策略、建立學習路線，並依面試回饋持續改進。

CareerOS is an AI-powered job search and skill growth platform for software engineers.

The product helps users start from their real resume and real work experience, analyze target job descriptions, optimize resume positioning, generate tailored application strategies, build job-oriented learning roadmaps, and continuously improve based on interview feedback.

This is not a simple resume generator. It is a career growth workspace that connects:

```text
Resume Profile
→ Job Description Analysis
→ Tailored Resume Strategy
→ Skill Gap Diagnosis
→ Learning Roadmap
→ Interview Preparation
→ Interview Feedback
→ Updated Weak Areas
→ Better Next Application
```

> **中文解說：** CareerOS 不是單純的履歷產生器，而是一個串連「履歷 → JD 分析 → 客製化策略 → 技能缺口 → 學習路線 → 面試準備 → 面試回饋 → 弱點更新 → 下次更好應徵」的職涯成長工作區。

## Core Product Goal

The goal is to help job seekers answer these questions:

```text
1. What are my real strengths?
2. Which jobs fit me best?
3. How should I adjust my resume for each job?
4. What skills am I missing for my target role?
5. What should I study first?
6. What interview questions should I prepare?
7. After an interview, how can I improve for the next one?
```

> **中文解說：** 產品核心目標是幫求職者回答七個關鍵問題：我的真實優勢是什麼？哪些工作最適合我？如何針對不同職缺調整履歷？目標職缺缺哪些技能？應該先學什麼？面試該準備哪些問題？面試後如何改進以應對下一次？

## Target Users

Primary target users:

```text
- Software engineers looking for new jobs
- Frontend engineers preparing for remote jobs
- Engineers transitioning from Vue to React / Next.js
- Developers who want to improve their resume and interview readiness
- Job seekers who want a structured system instead of scattered notes
```

Initial product focus:

```text
Frontend Engineer / React / Next.js / TypeScript / Remote Job Search
```

The product should be extensible to other roles later.

> **中文解說：** 主要目標用戶為正在求職的軟體工程師，尤其包含前端工程師、遠端職缺準備者、Vue 轉 React/Next.js 的開發者，以及希望用結構化系統取代零散筆記的求職者。初期聚焦 **Frontend Engineer / React / Next.js / TypeScript / 遠端求職**，後續可擴展至其他職缺類型。

## Core Product Principles

> **中文解說：** 三大核心原則：（1）誠實履歷強化；（2）以職缺為導向的成長；（3）回饋循環。以下各小節分別說明。

### 1. Honest Resume Enhancement

> **中文解說：** 系統不應鼓勵使用者偽造經歷，而是協助更清楚說明真實經驗、凸顯相關優勢、適度重新框架弱點，並避免誇大或捏造內容。

The system should not encourage users to fake experience.

It should help users:

```text
- Explain real experience more clearly
- Highlight relevant strengths
- Reframe weak points appropriately
- Match real experience to job requirements
- Avoid exaggeration or fabricated claims
```

The product should avoid:

```text
- Inventing fake work experience
- Adding technologies the user has never used
- Creating fake metrics
- Overstating ownership
- Turning learning experience into professional experience
```

### 2. Job-Oriented Growth

> **中文解說：** 學習建議必須以目標職缺、JD 要求、現有履歷與技能、面試回饋及重複出現的弱點為依據，而非隨機推薦。

Learning recommendations should not be random.

The roadmap should be based on:

```text
- Target role
- Job description requirements
- User's current resume
- User's detected skills
- Interview feedback
- Repeated weak areas
```

### 3. Feedback Loop

> **中文解說：** 每次應徵與面試都應讓下一次更好。系統從 JD、履歷版本、技能缺口、面試問題、使用者回饋與弱點中持續學習並優化建議。

Every job application and interview should improve the next attempt.

The system should learn from:

```text
- Job descriptions
- Resume versions
- Skill gaps
- Interview questions
- User feedback
- Weak areas
```

## Core Feature Modules

> **中文解說：** 以下為 12 個核心功能模組，涵蓋帳號、履歷、職缺、學習、面試與匯出等完整求職流程。

## 1. User Account and Onboarding

> **中文解說：** 使用者可註冊、登入、建立職涯檔案、上傳或貼上履歷、選擇目標職缺並確認偵測到的技能。MVP 認證可使用 Auth.js 或 Clerk。

Users can:

```text
- Register
- Login
- Create a career profile
- Upload or paste a resume
- Select target role
- Confirm detected skills
```

MVP authentication can use Auth.js or Clerk.

## 2. Career Profile

> **中文解說：** 使用者的核心檔案，包含基本資訊、工作與專案經驗、技能、目標職缺及履歷原文，是 AI 分析的主要輸入來源。

The user's core profile.

Includes:

```text
- Basic info
- Work experience
- Project experience
- Skills
- Target roles
- Resume source text
```

The Career Profile is the main input for AI analysis.

## 3. Skill System

> **中文解說：** 技能系統以職缺角色為基礎，提供預設技能選項供勾選，並支援從履歷自動偵測技能、手動新增自訂技能，以及使用者確認後才儲存。每項技能含名稱、分類、來源、熟練度與佐證。

The skill system should be role-based and selectable.

Flow:

```text
1. User selects a role, such as Frontend Engineer
2. System shows predefined skill options for that role
3. User selects relevant skills
4. User can manually add custom skills
5. System can detect skills from pasted resume
6. User confirms detected skills before saving
```

Example Frontend skills:

```text
Core:
- HTML
- CSS
- JavaScript
- TypeScript
- React
- Vue
- Next.js
- Nuxt

Styling:
- Tailwind CSS
- SCSS
- CSS Modules
- RWD
- Design System

State and Data:
- Redux
- Zustand
- Pinia
- React Query
- SWR
- Axios
- REST API
- GraphQL

Testing:
- Vitest
- Jest
- React Testing Library
- Cypress
- Playwright

Build and Tooling:
- Vite
- Webpack
- ESLint
- Prettier
- PNPM
- NPM

Deployment:
- Vercel
- Netlify
- Docker
- Nginx
- CI/CD

Architecture:
- Component Architecture
- Frontend Architecture
- Performance Optimization
- Web Security
- SSR / CSR
- SEO
```

Each user skill should support:

```text
- Skill name
- Category
- Source: system / resume_detected / user_added
- Level: beginner / familiar / working_experience / strong
- Evidence
- Years of experience, optional
```

## 4. Resume Intelligence

> **中文解說：** 履歷智慧功能支援貼上履歷、分析品質、改善摘要與條列描述、檢查 ATS 友善度，並可建立多個履歷版本。系統須同時顯示原文與改寫建議，並說明修改原因及標示可能的誇大風險。

Users can:

```text
- Paste resume text
- Upload resume in future versions
- Analyze resume quality
- Improve resume summary
- Improve work experience bullet points
- Improve project descriptions
- Check ATS friendliness
- Create multiple resume versions
```

Important behavior:

```text
- The system should show original text and improved text
- The system should explain why it changed something
- The system should flag possible exaggeration risk
```

## 5. Job Tracker

> **中文解說：** 職缺追蹤器讓使用者建立與管理職缺，包含公司、職稱、JD、技能需求及完整應徵管道狀態（從 Saved 到 Offer/Rejected）。MVP 先以列表呈現，Kanban 看板可後續加入。

Users can create and manage jobs.

Each job contains:

```text
- Company name
- Job title
- Job URL
- Location
- Work type: remote / hybrid / onsite
- Salary range, optional
- Job description
- Required skills
- Nice-to-have skills
- Status
- Tags
```

Job pipeline statuses:

```text
- Saved
- Analyzing
- Interested
- Not Suitable
- Ready to Apply
- Applied
- HR Screen
- Technical Interview
- Final Interview
- Offer
- Rejected
- Withdrawn
```

MVP can show this as a simple list first. Kanban board can be added later.

## 6. Job Fit Analysis

> **中文解說：** 結合使用者職涯檔案與 JD，分析必備/加分技能、資深度、技術與經驗匹配度、遠端與英文準備度、缺失技能及風險，並給出 Apply 建議（Strong Apply / Worth Applying / Stretch Role / Not Recommended）及理由。

Given a user's Career Profile and a Job Description, the system should analyze:

```text
- Must-have skills
- Nice-to-have skills
- Seniority level
- Hidden expectations
- Technical match
- Experience match
- Remote readiness
- English readiness
- Portfolio support
- Missing skills
- Job risks
- Apply recommendation
```

Apply recommendation types:

```text
- Strong Apply
- Worth Applying
- Stretch Role
- Not Recommended
```

The system should explain why.

## 7. Tailored Application

> **中文解說：** 針對每個職缺，系統建議應強調哪些技能、重寫哪些經歷條列、展示哪些專案、補充哪些關鍵字，以及如何定位候選人，並可建立綁定該職缺的履歷版本。

For each job, the system can recommend resume adjustments:

```text
- Which skills to emphasize
- Which experience bullets to rewrite
- Which projects to feature
- Which keywords are missing
- Which irrelevant sections can be reduced
- How to position the candidate for this job
```

The system can create a resume version tied to a job.

## 8. Learning (Skill Growth Guidance)

> **中文解說：** 學習模組**不是**課程平台或知識庫，而是提供「下一步學什麼」的優先卡片、學習理由、AI 提示詞庫、練習專案構想，以及路線圖樹狀結構。輸入來源包含履歷、技能、成長方向、JD 缺口與面試弱點。完整文章、影片課程、測驗等延後實作。

Learning is **not** a course platform or knowledge base. It provides:

```text
- What to learn next (priority cards)
- Why it matters (gaps, career impact)
- How to learn with AI (copyable prompt library)
- Simple practice project ideas
- Roadmap tree structure (guidance, not full curriculum)
```

Inputs for roadmap generation:

```text
- Resume and profile
- User skills (selected + detected)
- Growth direction (preset or custom)
- Job analysis missing skills (optional jobId)
- Interview feedback weak areas
```

Roadmap items include:

```text
- Skill / topic, category, priority, reason
- Gap, suggested goal, difficulty, career impact
- Practice idea + learning prompts (5 types)
- Task notes (user reflections — not full KB)
```

Deferred: full articles, video courses, quizzes, flashcards, spaced repetition, KB search.

## 9. Interview Preparation

> **中文解說：** 面試準備功能可從 JD 產生可能的面試問題，支援中英文答案準備，涵蓋技術、專案、行為與遠端協作等類別，並可儲存問題供日後複習。

Users can:

```text
- Generate likely interview questions from a job description
- Prepare answers in English and Chinese
- Practice technical, project, behavioral, and remote-work questions
- Save questions for later review
```

Question categories:

```text
- JavaScript
- TypeScript
- React
- Next.js
- Vue
- Frontend architecture
- Performance
- Web security
- System design
- Behavioral
- Remote collaboration
```

## 10. Interview Feedback Loop

> **中文解說：** 面試後使用者可記錄公司、職缺、日期、階段、問題、回答、優缺點與卡關處。系統分析後更新弱點、學習路線圖、建議練習題與履歷定位備註——這是產品的核心成長循環。

After an interview, users can record:

```text
- Company
- Job
- Interview date
- Interview stage
- Questions asked
- User's answer
- What went well
- What went badly
- Where the user got stuck
- Result
```

The system analyzes feedback and updates:

```text
- Weak areas
- Learning roadmap
- Suggested practice questions
- Resume positioning notes
```

This is the core growth loop.

## 11. Knowledge Base

> **中文解說：** 知識庫讓使用者儲存學習筆記、面試問題、AI 解說、錯題本與職缺專屬準備筆記。MVP 保持簡單：筆記列表、詳情、標籤，以及關聯技能/職缺。

Users can save:

```text
- Learning notes
- Interview questions
- AI-generated explanations
- Mistake book items
- Job-specific preparation notes
```

MVP can keep this simple:

```text
- Notes list
- Note detail
- Tags
- Related skill
- Related job
```

## 12. Export

> **中文解說：** MVP 僅支援履歷匯出：選擇版本、預覽、匯出 PDF 或 Markdown。公開分享連結、技能報告、職缺匹配報告等不在 MVP 範圍內。

MVP only supports resume export.

Users can:

```text
- Select a resume version
- Preview the resume
- Export as PDF
- Export as Markdown
```

Do not include in MVP:

```text
- Public sharing links
- Skill report export
- Job fit report export
- Learning roadmap export
- Interview report export
```

## MVP Scope

> **中文解說：** MVP 須包含 14 項核心功能：認證、職涯檔案、履歷分析、角色技能選擇、技能偵測確認、職缺管理、Job Fit 分析、客製化履歷建議、學習路線圖、面試回饋、弱點更新、Dashboard、履歷預覽與 PDF/Markdown 匯出。

The MVP should include:

```text
1. Authentication
2. Career Profile creation
3. Resume paste and analysis
4. Role-based skill selection
5. Resume skill detection and user confirmation
6. Job creation with pasted JD
7. Job Fit Analysis
8. Tailored Resume Suggestions
9. Learning Roadmap generation
10. Interview Feedback recording
11. Weak Area update
12. Dashboard overview
13. Resume version preview
14. Resume export as PDF / Markdown
```

## Out of Scope for MVP

> **中文解說：** MVP 階段不建置：LinkedIn/Gmail/Calendar 整合、自動爬蟲職缺、付費、團隊工作區、公開分享、語音面試模擬、DOCX 匯出、完整後台管理與複雜分析。

Do not build these initially:

```text
- LinkedIn integration
- Gmail integration
- Calendar integration
- Auto job crawling
- Payment
- Team workspace
- Public sharing
- Voice interview simulation
- DOCX export
- Full admin panel
- Complex analytics
```

## Suggested Product One-Liner

```text
CareerOS helps software engineers analyze job descriptions, tailor resumes, identify skill gaps, generate learning roadmaps, and improve continuously based on interview feedback.
```

> **中文解說（產品一句話）：** CareerOS 幫助軟體工程師分析職缺描述、客製化履歷、找出技能缺口、產生學習路線圖，並依面試回饋持續改進。
