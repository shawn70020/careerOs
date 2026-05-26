# CareerOS MVP 最終產品與技術決策

本文件為 MVP **唯一**技術與產品決策來源。開發不得自行更換主技術棧。

## 產品定位

- 目標使用者：軟體工程師
- MVP 聚焦：**Frontend Engineer**
- 主要目標：**作品集展示**，功能接近真實可用產品

核心閉環：

```text
Real Resume → Career Profile → Target Job Analysis → Tailored Resume
→ Skill Gap → Learning Roadmap → Interview Preparation → Interview Feedback
→ Weak Areas → Improved Next Application
```

---

## 1. 架構與基礎設施

| 項目 | 決策 |
|------|------|
| 認證 | Auth.js + Prisma Adapter + PostgreSQL |
| MVP 登入 | Email + Password |
| Google OAuth | Phase 2 |
| Public Demo | **免登入**（`/demo`） |
| 本機 DB | Docker PostgreSQL |
| 正式 DB | Neon PostgreSQL |
| 部署 | Vercel（預設 `https://careeros.vercel.app`） |
| AI | `AI_MODE=mock` 預設；MockProvider + OpenAIProvider 架構保留 |

環境變數：`DATABASE_URL`, `AUTH_SECRET`, `AUTH_URL`, `AI_MODE`, `OPENAI_API_KEY`

---

## 2. UI 與 AI 輸出語言

| 範圍 | 語言 |
|------|------|
| UI 介面 | **English**（`/en/...`）與 **繁體中文**（`/zh-TW/...`），URL 前綴切換 |
| AI 輸出 / 履歷版本 | English、Traditional Chinese、Bilingual（與 UI 語言獨立） |

實作 UI i18n：`next-intl`、`src/messages/en.json`、`src/messages/zh-TW.json`、`LocaleSwitcher`  
實作 AI 輸出：`src/lib/output-language.ts`、`OutputLanguageSelect`

---

## 3. 面試準備（MVP 要做）

- 從 JD 產生面試題（簡化版）
- 分類：Technical、Project Experience、Behavioral、Remote Collaboration
- 建議回答方向；支援 EN / 中文 / Bilingual
- **不做**：語音面試、即時追問、評分、完整 mock chat

實作：`POST /api/jobs/[id]/interview-prep`、`InterviewPrepPanel`

---

## 4. Job Risk Analysis（取代 Unwanted job types）

分析 JD 風險，例如：模糊需求、職責過多、前後端 DevOps 混合、遠端政策不清、無薪資、資深度不合理等。

實作：`jobRisksJson` on `JobAnalysisReport`，見 job fit 分析頁

---

## 5. Learning（技能成長指引）

Learning = **成長指引 + 路徑 + Prompt 庫**，不是課程平台或知識庫。

MVP 包含：技能階段分析、成長方向輸入、個人化路徑（含樹狀結構、優先卡片）、可複製學習 Prompt、練習建議、職缺缺口路徑、面試回饋更新路徑、任務筆記。

MVP **不做**：完整文章/課程、影片、測驗、錯題本、間隔重複、KB 搜尋、YouTube 匯入、每日排程、語音學習、複雜心智圖。

## 6. Knowledge Base

MVP **不做**完整 Knowledge Base。僅 **Learning Roadmap 任務筆記**。

`/knowledge-base` → redirect `/learning`

---

## 7. 其他產品規則

| 項目 | 決策 |
|------|------|
| 註冊 | 開放；Public Demo 不存個人資料 |
| Demo 帳號 | `demo@careeros.dev` / `demo123456` |
| Landing | 產品文案；三核心功能；無個人照/pricing/FAQ |
| 自訂網域 | 暫無；用 Vercel 預設網域 |
| 角色 seed | 僅 Frontend Engineer |
| 技能 | 見 `prisma/seed.ts` 分類清單 |
| Export | PDF（@react-pdf/renderer）+ Markdown only |

---

## 8. 開發優先順序（Phase 1–9）

1. Foundation  
2. Demo Mode  
3. Career Profile  
4. Job Analysis（含 Job Risk）  
5. Resume Intelligence  
6. Learning Roadmap + task notes  
7. Interview Prep & Feedback  
8. Resume Export  
9. Polish & Deploy  

---

## 8. 本機啟動

```bash
docker compose up -d
cp .env.example .env
npm install
npm run db:push
npm run db:seed
npm run dev
```

正式環境：Neon `DATABASE_URL` + Vercel 環境變數；`AUTH_URL` 設為正式 Vercel URL。
