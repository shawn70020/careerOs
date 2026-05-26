# CareerOS Overview

## Product Name

**CareerOS**

## Product Positioning

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

## Core Product Principles

### 1. Honest Resume Enhancement

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

## 1. User Account and Onboarding

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
