# CareerOS 測試腳本（testScript.md）

本文件用於本機或 Vercel 環境的功能驗收，涵蓋三種情境：

1. **Public Demo**（免登入，給訪客 / 面試官快速體驗）
2. **展示用 Demo 帳號**（預先 seed，完整登入後流程）
3. **實際使用者**（自行註冊，從零走完產品閉環）

---

## 0. 測試前準備

### 0.1 環境

| 項目 | 要求 |
|------|------|
| 應用可開啟 | 本機 `http://localhost:3000` 或 Vercel 正式 URL（根路徑會導向 `/en` 或 `/zh-TW`） |
| UI 語言 | 英文：`/en/...`；繁中：`/zh-TW/...`（Header / Landing 可切換語言） |
| 資料庫 | Docker Postgres 已啟動（本機埠 **5433**）或 Neon 已連線 |
| `AI_MODE` | `mock`（預設；Public Demo 僅 mock 可用） |
| 已執行（首次或 schema 變更後） | `npm run db:push`、`npm run db:seed` |

### 0.2 帳號對照

| 類型 | Email | Password | 用途 |
|------|-------|----------|------|
| 展示 Demo 帳號 | `demo@careeros.dev` | `demo123456` | 面試官一鍵登入、作品集展示 |
| 實際使用者 | 自行註冊（建議用測試信箱） | 自訂（≥8 字元） | 模擬真實新用戶 |

### 0.3 測試用範例文字（可複製）

**履歷（≥50 字）：**

```text
Frontend Engineer with 4 years building React and TypeScript products.
Shipped Next.js features, improved Core Web Vitals, and collaborated
remotely with design and backend teams. Skills: React, TypeScript,
Next.js, Tailwind CSS, React Query, REST API, Vitest.
```

**職缺 JD（≥50 字）：**

```text
Frontend Engineer (React / Next.js) — Remote

Requirements: 3+ years React, TypeScript, Next.js, REST APIs,
remote collaboration. Nice to have: Playwright, GraphQL.
Responsibilities include UI delivery; occasional backend support.
Salary not listed. Hybrid/remote policy unclear.
```

### 0.4 記錄方式（建議）

每個步驟勾選：**通過 / 失敗 / 略過**，失敗時記 URL、截圖、Console / Network 錯誤。

---

## 一、Public Demo（免登入）— 訪客展示路徑

**目的：** 驗證不需註冊即可體驗 mock AI；**不應**寫入個人資料到資料庫。

| ID | 步驟 | 操作 | 預期結果 |
|----|------|------|----------|
| P-01 | 開啟 Landing | 造訪 `/zh-TW` 或 `/en` | 顯示 CareerOS、三大功能、**公開示範** / **Public demo** 按鈕 |
| P-02 | 進入 Demo | 點 **公開示範** 或造訪 `/zh-TW/demo` | 免登入進入；顯示「無需登入」、Mock AI 標籤 |
| P-03 | 履歷分析 | **履歷分析** 分頁 → 貼上範例履歷 → **分析履歷** | 顯示分數、優勢、待改進、技能；無 500 錯誤 |
| P-04 | 職缺分析 | **職缺契合分析** 分頁 → 貼上範例 JD → **分析職缺契合度** | 顯示匹配分數、建議、Reasoning、缺少技能 |
| P-05 | 無持久化 | 重新整理 `/zh-TW/demo` | 不會出現登入後的 Dashboard；先前分析結果不會變成「已儲存職缺」 |
| P-06 | 引導註冊 | 點 **開始使用** / **登入** | 導向 `/zh-TW/register` 或 `/zh-TW/login` |
| P-07 | 未登入保護 | 直接造訪 `/zh-TW/dashboard` | 導向 `/zh-TW/login` |

---

## 二、展示用 Demo 帳號 — 面試官 / 作品集快速路徑

**目的：** 用 seed 帳號在 5–10 分鐘內展示「登入後完整產品」，無需現場註冊。

**登入：** `/zh-TW/login`（或 `/en/login`）→ `demo@careeros.dev` / `demo123456`

| ID | 步驟 | 路徑 / 操作 | 預期結果 |
|----|------|-------------|----------|
| D-01 | 登入 | `/zh-TW/login` → 輸入 demo 帳密 → 登入 | 進入 `/zh-TW/dashboard`，Header 顯示歡迎語 |
| D-02 | Dashboard | `/zh-TW/dashboard` | 顯示統計卡片（職缺、履歷分數、待加強項目、學習路徑等）；可有 seed 職缺摘要 |
| D-03 | Career Profile | Sidebar → **Career Profile** | 顯示 Demo Engineer、技能、經歷（若有 seed） |
| D-04 | 編輯 Profile | **Edit profile** | 可修改並儲存；回到 Profile 後資料更新 |
| D-05 | Resume 總覽 | **Resume** | 三個入口：Analyzer、Versions、Export |
| D-06 | 履歷分析 | **Resume** → **Analyzer** → 貼履歷 → Analyze | 分數與建議；原文/建議對照（若有 improvement） |
| D-07 | 履歷版本 | **Resume** → **Versions** | 可見 **Base Resume EN**（seed）；可 **Create version** |
| D-08 | 版本預覽 | 點某版本 **View** | 顯示 Markdown / 文字預覽 |
| D-09 | 匯出 | **Resume** → **Export** → 選版本 → **Export Markdown** / **Export PDF** | 下載 `.md` 或 `.pdf` 檔 |
| D-10 | 職缺列表 | **Jobs** | 可見 seed 職缺（如 Demo Corp）或既有職缺 |
| D-11 | 新增職缺 | **Jobs** → **Add job** → 填公司、職稱、JD → Create | 進入該職缺詳情頁 |
| D-12 | Job Fit | 職缺詳情 → **Analyze job fit** | 產生分析；顯示 Latest fit analysis 分數與建議 |
| D-13 | 完整分析頁 | **View full report** 或 `/jobs/[id]/analysis` | 顯示 Overall %、Skill gap、**Job risk analysis** 多筆風險 |
| D-14 | 客製履歷建議 | 職缺詳情 → **Tailored resume suggestions** | 產生 positioning / 建議文字 |
| D-15 | 職缺版履歷 | **Create job resume version** | 建立連結該職缺的履歷版本；**Resume** → **Versions** 可見 |
| D-16 | 面試準備 | 職缺詳情 → 選輸出語言 → **Generate interview questions** | 依分類顯示題目（Technical / Project / Behavioral / Remote）；可 Bilingual |
| D-17 | 學習路線圖 | **Learning** → 選成長方向 chip 或自訂 → **產生學習路徑** | 產生 roadmap；顯示 **技能階段** 摘要、**優先學習** 卡片（3–5 項） |
| D-17b | 路徑結構 | 進入 roadmap 詳情 | 顯示可展開的 **路徑結構** 樹狀 UI；任務依分類分組 |
| D-17c | Prompt 庫 | 某 task → **學習 Prompt 庫** | 五類 Prompt（入門/練習/面試/除錯/專案）；**複製** 可用 |
| D-17d | 職缺缺口路徑 | 職缺分析頁 → **依缺口產生學習路徑** | 產生以 JD 缺口為主的 roadmap（`JOB_ANALYSIS`） |
| D-18 | 學習資源 | 進入 roadmap → 某 task | 顯示缺口、學習目標、練習專案、相關技能；Practice / 面試題列表 |
| D-19 | 任務筆記 | 某 task → 輸入 note → **Save note** | 筆記儲存；重新整理仍保留（**非**完整 Knowledge Base） |
| D-20 | 任務狀態 | 任務上 **Start** / **Done** | 狀態更新成功 |
| D-21 | 面試回饋 | **Interview** → **Record feedback** → 填寫 → **Save & analyze** | 建立 log；顯示 AI Summary、Weak areas、Suggested practice |
| D-21b | 路徑更新 | 分析後（需已有 roadmap） | 面試詳情顯示 **學習路徑已更新** 與變更列表；可連至 Learning |
| D-22 | 面試詳情 | 點某筆 log | 可見紀錄內容與分析結果 |
| D-23 | Dashboard 連動 | 回 **Dashboard** | Weak areas / Learning tasks / Recent jobs 有更新跡象 |
| D-24 | Settings | **Settings** | 顯示 AI Mode 等環境資訊 |
| D-25 | Knowledge Base 導向 | 造訪 `/zh-TW/knowledge-base` | **重新導向** `/zh-TW/learning`（MVP 不做完整 KB） |
| D-26 | 登出 | Header → **登出** | 回 `/zh-TW`；再訪 `/zh-TW/dashboard` 需登入 |

---

## 三、實際使用者 — 註冊登入與完整閉環

**目的：** 模擬新用戶從註冊到「下一次申請更好」的完整產品迴圈。

**建議：** 使用新信箱，例如 `test+careeros001@example.com`，避免與 demo 帳號混淆。

### 3.1 註冊與 Onboarding

| ID | 步驟 | 操作 | 預期結果 |
|----|------|------|----------|
| U-01 | 註冊 | `/register` → Name、Email、Password（≥8）→ Register | 成功後導向 `/onboarding`（非 demo 既有資料） |
| U-02 | Onboarding 步驟 1 | 填 Full name → 貼履歷 → **Analyze & continue** | 進入步驟 2；有履歷分數 |
| U-03 | Onboarding 步驟 2 | 確認 **Target role**（Frontend Engineer）→ Continue | 進入步驟 3 |
| U-04 | Onboarding 步驟 3 | 勾選技能（含 detected）→ Continue | 至少選一項才可繼續 |
| U-05 | Onboarding 步驟 4 | Review → **Complete onboarding** | 導向 `/dashboard`；Profile 已建立 |
| U-06 | 重複註冊 | 同一 Email 再註冊 | 顯示 Email already registered 或類似錯誤 |

### 3.2 登入 / 登出

| ID | 步驟 | 操作 | 預期結果 |
|----|------|------|----------|
| U-07 | 登出後登入 | Sign out → `/login` → 新帳密 | 進入自己的 Dashboard，**看不到** demo 使用者資料 |
| U-08 | 錯誤密碼 | 故意輸入錯誤密碼 | 顯示 Invalid email or password；不進入 Dashboard |

### 3.3 Career Profile 與技能

| ID | 步驟 | 操作 | 預期結果 |
|----|------|------|----------|
| U-09 | 檢視 Profile | `/career-profile` | 顯示 onboarding 時姓名、目標職缺、技能 |
| U-10 | 編輯 Profile | **Edit profile** → 修改 → Save | 變更持久化 |
| U-11 | 技能來源 | 確認技能 chip 存在 | 含 USER_SELECTED / RESUME_DETECTED 等（依 onboarding） |

### 3.4 Resume Intelligence

| ID | 步驟 | 操作 | 預期結果 |
|----|------|------|----------|
| U-12 | 分析履歷 | `/resume/analyzer` → 貼履歷 → Analyze | Mock 分析結果；Career Profile 可更新 strengths（若實作有寫入） |
| U-13 | 建立版本 | `/resume/versions` → New version（名稱 + Markdown） | 列表出現新版本 |
| U-14 | 編輯預覽 | 點 **View** | 內容與建立時一致 |
| U-15 | 匯出 PDF | `/resume/export` → 選版本 → Export PDF | 下載 PDF 可開啟 |
| U-16 | 匯出 MD | Export Markdown | 下載 `.md` 內容正確 |

### 3.5 Jobs、Job Fit、Job Risk、Tailored

| ID | 步驟 | 操作 | 預期結果 |
|----|------|------|----------|
| U-17 | 建立職缺 | `/jobs/new` → 填寫 → Create | 進入職缺詳情 |
| U-18 | 列表 | `/jobs` | 新職缺出現在列表 |
| U-19 | Job Fit | **Analyze job fit** | 有 overall score、recommendation |
| U-20 | Skill gap | 分析頁 | Missing skills 列表 |
| U-21 | Job Risk | 分析頁 **Job risk analysis** | 多種風險類型（如 vague requirements、no salary 等） |
| U-22 | Tailored | **Tailored resume suggestions** | 有 positioning / bullet 建議 |
| U-23 | 職缺履歷版 | **Create job resume version** | 新版本 `relatedJob` 關聯正確 |

### 3.6 Interview Preparation（MVP 必測）

| ID | 步驟 | 操作 | 預期結果 |
|----|------|------|----------|
| U-24 | 英文題 | 選 **English** → Generate | 題目與 answer direction 為英文 |
| U-25 | 中文題 | 選 **Traditional Chinese** → Regenerate | 顯示中文（依 mock 資料） |
| U-26 | 雙語 | 選 **Bilingual** | 同題顯示 EN + 中文 |
| U-27 | 分類 | 檢查區塊 | Technical、Project Experience、Behavioral、Remote Collaboration |

### 3.7 Learning Roadmap 與任務筆記

| ID | 步驟 | 操作 | 預期結果 |
|----|------|------|----------|
| U-28 | 產生路線圖 | `/learning` → 選成長方向 → **產生學習路徑** | 導向 roadmap 詳情；有技能階段、優先卡片、路徑樹、多個 tasks |
| U-28b | Prompt 複製 | 某 task → Prompt 庫 → **複製** | 剪貼簿有 Prompt 文字 |
| U-29 | 學習資源 | 展開某 task | 顯示缺口/目標/練習專案、Prompt 庫、Practice tasks、Interview questions |
| U-30 | 任務筆記 | 某 task → 輸入 note → Save → 重新整理 | 筆記仍在 |
| U-31 | 刪除筆記 | **Delete note** | 筆記清空 |
| U-32 | 完成任務 | **Done** | 狀態為 Completed |

### 3.8 Interview Feedback 與弱點閉環

| ID | 步驟 | 操作 | 預期結果 |
|----|------|------|----------|
| U-33 | 新增回饋 | `/interview/logs/new` → 填公司、好壞、卡關、範例題 → Save & analyze | 導向 log 詳情；有 AI Summary |
| U-34 | 弱點 | log 詳情 | Identified weak areas 列表 |
| U-35 | 練習建議 | log 詳情 | Suggested practice 列表 |
| U-36 | Dashboard | `/dashboard` | Active weak areas / learning tasks 反映新資料 |
| U-37 | 手動分析 | 若 log 無 summary → **Analyze feedback with AI** | 補上分析結果 |

### 3.9 資料隔離（重要）

| ID | 步驟 | 操作 | 預期結果 |
|----|------|------|----------|
| U-38 | 與 demo 隔離 | 登出 → 登入 `demo@careeros.dev` | **看不到** 新註冊使用者的 jobs / notes |
| U-39 | 再登入新帳號 | 登回自己的帳號 | 自己的資料仍在；看不到 demo 專屬 seed 以外的混淆 |

---

## 四、產品核心閉環驗收（一次跑完）

適合展示或回歸測試時，用**單一帳號**連續操作，確認「不是零散功能」而是完整迴圈：

```text
1. 登入（demo 或自註冊帳號）
2. Career Profile 已有履歷與技能
3. Resume Analyzer 分析 → 建立 Resume Version
4. Jobs 新增 JD → Job Fit + Job Risk 分析
5. Tailored Resume Suggestions → 建立職缺版履歷
6. Interview Prep from JD（建議 Bilingual）
7. Learning Roadmap 產生 → 任務寫 note → 標記 Done
8. Interview Feedback 記錄 → AI 分析 → Dashboard 出現 Weak areas
9. Resume Export PDF/MD
10. Sign out
```

**預期：** 全程無未處理 500；資料在重新整理後仍保留（Public Demo 除外）。

---

## 五、不在 MVP 範圍（測到算異常或 Phase 2）

以下**不應**作為 MVP 通過條件；若出現可記為「超出範圍」：

| 功能 | 說明 |
|------|------|
| 完整 Knowledge Base | `/knowledge-base` 應導向 `/learning` |
| 語音面試 / Mock interview chat | 未實作 |
| DOCX 匯出 | 未實作 |
| 公開分享連結 | 未實作 |
| Google OAuth | Phase 2 |
| Kanban 職缺看板 | 未實作（列表即可） |
| 訪客使用真實 OpenAI | Public Demo 在 `AI_MODE=mock` 外應 403 |
| Unwanted job types 欄位 | 已改為 Job Risk Analysis |

---

## 六、常見失敗對照

| 現象 | 可能原因 | 建議處理 |
|------|----------|----------|
| `db:push` P1000 | 連到 Windows Postgres 而非 Docker | `.env` 使用 `localhost:5433` |
| 登入後跳回 login | `AUTH_SECRET` 或 `AUTH_URL` 錯誤 | 檢查 `.env` |
| `/zh-TW/demo` 403 | `AI_MODE` 非 `mock` | 改為 `mock` |
| Analyze 無反應 | 文字少於 50 字 | 使用本文件範例文字 |
| Demo 帳號無資料 | 未 seed | `npm run db:seed` |
| 新註冊看到 demo 資料 | 登錯帳號 | 確認 Email 不同 |

---

## 七、測試完成簽核（可列印）

| 區塊 | 通過項 / 總項 | 測試人 | 日期 | 環境 |
|------|----------------|--------|------|------|
| Public Demo（P-01～P-07） | /7 | | | 本機 / Vercel |
| Demo 帳號（D-01～D-26） | /26 | | | |
| 實際使用者（U-01～U-39） | /39 | | | |
| 核心閉環（第四節） | 是 / 否 | | | |

---

## 附錄：快速指令（測試日當天）

```powershell
# 僅在 DB 未啟動或首次設定時需要
docker compose up -d
npm run db:push    # schema 有變更時
npm run db:seed    # 首次或要重置 demo 資料時

# 每次開發測試
npm run dev
```

**展示建議順序（給面試官）：** `P-01`～`P-04`（`/zh-TW/demo`）→ `D-01`～`D-16`（demo 登入核心）→ 視時間 `D-17`～`D-26`。

**完整驗收入口：** 跑完 **第三節 U-01～U-39** 或 **第四節閉環** 其一即可代表 MVP 功能覆蓋完成。
