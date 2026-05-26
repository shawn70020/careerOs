import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const FRONTEND_SKILLS: { name: string; category: string }[] = [
  { name: "HTML", category: "Core" },
  { name: "CSS", category: "Core" },
  { name: "JavaScript", category: "Core" },
  { name: "TypeScript", category: "Core" },
  { name: "React", category: "Frameworks" },
  { name: "Vue", category: "Frameworks" },
  { name: "Next.js", category: "Frameworks" },
  { name: "Nuxt", category: "Frameworks" },
  { name: "Tailwind CSS", category: "Styling" },
  { name: "SCSS", category: "Styling" },
  { name: "CSS Modules", category: "Styling" },
  { name: "Styled Components", category: "Styling" },
  { name: "Responsive Web Design", category: "Styling" },
  { name: "Redux", category: "State Management" },
  { name: "Zustand", category: "State Management" },
  { name: "Pinia", category: "State Management" },
  { name: "Context API", category: "State Management" },
  { name: "REST API", category: "Data Fetching" },
  { name: "GraphQL", category: "Data Fetching" },
  { name: "Axios", category: "Data Fetching" },
  { name: "React Query", category: "Data Fetching" },
  { name: "SWR", category: "Data Fetching" },
  { name: "Vitest", category: "Testing" },
  { name: "Jest", category: "Testing" },
  { name: "React Testing Library", category: "Testing" },
  { name: "Cypress", category: "Testing" },
  { name: "Playwright", category: "Testing" },
  { name: "Vite", category: "Build Tools" },
  { name: "Webpack", category: "Build Tools" },
  { name: "ESLint", category: "Build Tools" },
  { name: "Prettier", category: "Build Tools" },
  { name: "PNPM", category: "Build Tools" },
  { name: "NPM", category: "Build Tools" },
  { name: "Vercel", category: "Deployment" },
  { name: "Netlify", category: "Deployment" },
  { name: "Docker", category: "Deployment" },
  { name: "Nginx", category: "Deployment" },
  { name: "CI/CD", category: "Deployment" },
  { name: "Component Architecture", category: "Architecture" },
  { name: "Frontend Architecture", category: "Architecture" },
  { name: "Performance Optimization", category: "Architecture" },
  { name: "Web Security", category: "Architecture" },
  { name: "SSR", category: "Architecture" },
  { name: "CSR", category: "Architecture" },
  { name: "SEO", category: "Architecture" },
  { name: "Cross-functional Collaboration", category: "Soft Skills" },
  { name: "Code Review", category: "Soft Skills" },
  { name: "Documentation", category: "Soft Skills" },
  { name: "Remote Communication", category: "Soft Skills" },
  { name: "English Communication", category: "Soft Skills" },
];

const DEMO_RESUME = `Frontend Engineer with 4 years experience building React and TypeScript applications.

Experience:
- Developed customer-facing features with React, TypeScript, and Tailwind CSS
- Migrated legacy Vue pages to Next.js with improved Core Web Vitals
- Collaborated remotely with design and backend teams across time zones

Skills: React, TypeScript, Next.js, Vue, Tailwind CSS, React Query, REST API, Vitest`;

const DEMO_JD = `Frontend Engineer (React / Next.js)

We are looking for a frontend engineer to build customer-facing web apps.

Requirements:
- 3+ years React and TypeScript
- Next.js and SSR experience
- REST API integration
- Remote collaboration across time zones

Nice to have: Playwright, GraphQL

Note: Role may include occasional backend support. Salary not listed.`;

async function main() {
  for (const skill of FRONTEND_SKILLS) {
    await prisma.skill.upsert({
      where: { name_category: { name: skill.name, category: skill.category } },
      create: {
        name: skill.name,
        category: skill.category,
        roleTags: ["Frontend Engineer"],
      },
      update: { category: skill.category },
    });
  }

  const passwordHash = await bcrypt.hash("demo123456", 10);
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@careeros.dev" },
    create: {
      email: "demo@careeros.dev",
      name: "Demo Engineer",
      passwordHash,
    },
    update: {},
  });

  const reactSkill = await prisma.skill.findFirst({ where: { name: "React" } });
  const tsSkill = await prisma.skill.findFirst({ where: { name: "TypeScript" } });
  const nextSkill = await prisma.skill.findFirst({ where: { name: "Next.js" } });

  await prisma.careerProfile.upsert({
    where: { userId: demoUser.id },
    create: {
      userId: demoUser.id,
      fullName: "Demo Engineer",
      currentTitle: "Frontend Engineer",
      targetRoles: ["Frontend Engineer"],
      resumeText: DEMO_RESUME,
      onboardingComplete: true,
      strengthsJson: ["React/TypeScript", "Remote collaboration"],
      weaknessesJson: ["Playwright depth"],
    },
    update: { onboardingComplete: true, resumeText: DEMO_RESUME },
  });

  if (reactSkill) {
    await prisma.userSkill.upsert({
      where: { userId_skillId: { userId: demoUser.id, skillId: reactSkill.id } },
      create: { userId: demoUser.id, skillId: reactSkill.id, level: "STRONG", source: "USER_SELECTED" },
      update: {},
    });
  }
  if (tsSkill) {
    await prisma.userSkill.upsert({
      where: { userId_skillId: { userId: demoUser.id, skillId: tsSkill.id } },
      create: { userId: demoUser.id, skillId: tsSkill.id, level: "STRONG", source: "USER_SELECTED" },
      update: {},
    });
  }
  if (nextSkill) {
    await prisma.userSkill.upsert({
      where: { userId_skillId: { userId: demoUser.id, skillId: nextSkill.id } },
      create: { userId: demoUser.id, skillId: nextSkill.id, level: "WORKING_EXPERIENCE", source: "RESUME_DETECTED" },
      update: {},
    });
  }

  const existingResume = await prisma.resumeVersion.findFirst({
    where: { userId: demoUser.id, name: "Base Resume EN" },
  });
  if (!existingResume) {
    await prisma.resumeVersion.create({
      data: {
        userId: demoUser.id,
        name: "Base Resume EN",
        language: "EN",
        markdownContent: `# Demo Engineer\n\n${DEMO_RESUME}`,
        contentJson: {},
      },
    });
  }

  const existingJob = await prisma.job.findFirst({
    where: { userId: demoUser.id, companyName: "Demo Corp" },
  });
  if (!existingJob) {
    await prisma.job.create({
      data: {
        userId: demoUser.id,
        companyName: "Demo Corp",
        jobTitle: "Frontend Engineer",
        description: DEMO_JD,
        workType: "REMOTE",
        status: "INTERESTED",
        tags: ["demo"],
      },
    });
  }

  console.log("Seed complete. Demo: demo@careeros.dev / demo123456");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
