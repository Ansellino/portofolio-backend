import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { EmploymentType, PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const databaseUrl =
  process.env.SESSION_URL ??
  process.env.TRANSACTION_URL ??
  process.env.DIRECT_URL ??
  process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    'Missing SESSION_URL, TRANSACTION_URL, DIRECT_URL, or DATABASE_URL in environment variables.',
  );
}

const pool = new Pool({ connectionString: databaseUrl });
const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
});

const adminEmail = process.env.ADMIN_EMAIL ?? 'ansellino@gmail.com';
const adminPassword = process.env.ADMIN_PASSWORD ?? 'admin123456';

const profileData = {
  fullName: 'Jeremy Ansellino Gunawan',
  headline: 'Full-Stack Software Engineer',
  bio: "Fresh graduate Full-Stack Software Engineer with a Master's degree and hands-on experience building scalable web applications, APIs, and cloud-based solutions.",
  email: 'ansellino@gmail.com',
  phone: '0812-2957-4140',
  location: 'Tangerang, Banten 15112',
  githubUrl: 'https://github.com/Ansellino',
  linkedinUrl: 'https://linkedin.com/in/jeremy-ansellino-gunawan/',
};

const skillsByCategory: Record<string, string[]> = {
  Languages: ['JavaScript', 'TypeScript'],
  Frameworks: ['React', 'Next.js', 'Vue.js', 'Node.js', 'NestJS', 'Laravel'],
  Styling: ['Tailwind CSS'],
  Databases: ['PostgreSQL', 'MySQL'],
  ORM: ['Prisma'],
  APIs: ['REST API'],
  Tools: ['Git', 'Docker'],
  Cloud: ['Google Cloud Platform'],
};

async function main() {
  const passwordHash = bcrypt.hashSync(adminPassword, 10);

  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {
      password: passwordHash,
      name: 'Jeremy Ansellino Gunawan',
    },
    create: {
      email: adminEmail,
      password: passwordHash,
      name: 'Jeremy Ansellino Gunawan',
    },
  });

  const existingProfile = await prisma.profile.findFirst({
    where: { email: profileData.email },
    select: { id: true },
  });

  if (existingProfile) {
    await prisma.profile.update({
      where: { id: existingProfile.id },
      data: profileData,
    });
  } else {
    await prisma.profile.create({ data: profileData });
  }

  const createdSkills = await Promise.all(
    Object.entries(skillsByCategory).flatMap(([category, names], categoryIdx) =>
      names.map((name, indexInCategory) =>
        prisma.skill.upsert({
          where: { name },
          update: {
            category,
            sortOrder: categoryIdx * 10 + indexInCategory,
          },
          create: {
            name,
            category,
            sortOrder: categoryIdx * 10 + indexInCategory,
          },
        }),
      ),
    ),
  );

  const skillMap = new Map(createdSkills.map((skill) => [skill.name, skill.id]));

  const projects = [
    {
      title: 'LearnBook',
      slug: 'learnbook',
      description: 'Capstone project from RevoU focused on modern learning management workflows.',
      content: 'RevoU Capstone project with full-stack implementation and collaborative features.',
      isFeatured: true,
      startDate: new Date('2025-10-01'),
      endDate: new Date('2025-12-31'),
      sortOrder: 1,
      skillNames: ['TypeScript', 'Next.js', 'Node.js', 'PostgreSQL', 'Prisma'],
    },
    {
      title: 'Healthcare Management System',
      slug: 'healthcare-management-system',
      description: 'Healthcare dashboard and operations system built during Prasunet internship.',
      content: 'Prasunet internship project focused on patient data flow and operational reporting.',
      isFeatured: false,
      startDate: new Date('2025-03-01'),
      endDate: new Date('2025-04-30'),
      sortOrder: 2,
      skillNames: ['JavaScript', 'Node.js', 'REST API', 'MySQL'],
    },
    {
      title: 'Lembur Mangrove Patikang',
      slug: 'lembur-mangrove-patikang',
      description: 'Digital platform for UMNGrove to support mangrove conservation initiatives.',
      content: 'UMNGrove project for campaign information, outreach, and community updates.',
      isFeatured: false,
      startDate: new Date('2024-11-01'),
      endDate: new Date('2025-01-31'),
      sortOrder: 3,
      skillNames: ['Vue.js', 'Node.js', 'PostgreSQL', 'Docker'],
    },
  ];

  for (const project of projects) {
    const { skillNames, ...projectData } = project;
    const skillIds = skillNames
      .map((skillName) => skillMap.get(skillName))
      .filter((skillId): skillId is string => Boolean(skillId));

    await prisma.project.upsert({
      where: { slug: project.slug },
      update: {
        ...projectData,
        isPublished: true,
        skills: {
          deleteMany: {},
          create: skillIds.map((skillId) => ({ skillId })),
        },
      },
      create: {
        ...projectData,
        isPublished: true,
        skills: {
          create: skillIds.map((skillId) => ({ skillId })),
        },
      },
    });
  }

  const workExperiences = [
    {
      company: 'Google Cloud/Dicoding',
      position: 'Cloud Arcade Facilitator',
      employmentType: EmploymentType.CONTRACT,
      startDate: new Date('2025-06-01'),
      endDate: new Date('2025-10-31'),
      location: 'Indonesia',
      responsibilities: [
        'Facilitated cloud learning sessions for participants.',
        'Guided learners in completing Google Cloud quests and labs.',
      ],
      sortOrder: 1,
      isPublished: true,
    },
    {
      company: 'Tokocrypto',
      position: 'Freelance Analyst',
      employmentType: EmploymentType.FREELANCE,
      startDate: new Date('2025-04-01'),
      endDate: new Date('2025-06-30'),
      location: 'Indonesia',
      responsibilities: [
        'Analyzed operational and product data for reporting insights.',
        'Prepared analysis artifacts to support team decisions.',
      ],
      sortOrder: 2,
      isPublished: true,
    },
    {
      company: 'UMNGrove',
      position: 'Full Stack Developer',
      employmentType: EmploymentType.FULL_TIME,
      startDate: new Date('2024-10-01'),
      endDate: new Date('2025-03-31'),
      location: 'Tangerang, Indonesia',
      responsibilities: [
        'Developed frontend and backend features for conservation platform.',
        'Integrated APIs and maintained database-backed modules.',
      ],
      sortOrder: 3,
      isPublished: true,
    },
  ];

  for (const item of workExperiences) {
    const existing = await prisma.workExperience.findFirst({
      where: {
        company: item.company,
        position: item.position,
        startDate: item.startDate,
      },
      select: { id: true },
    });

    if (existing) {
      await prisma.workExperience.update({
        where: { id: existing.id },
        data: item,
      });
    } else {
      await prisma.workExperience.create({ data: item });
    }
  }

  const educations = [
    {
      institution: 'Bina Nusantara University',
      degree: "Master's",
      fieldOfStudy: 'Computer Science',
      gpa: '3.67',
      startDate: new Date('2023-05-01'),
      endDate: new Date('2025-01-31'),
      description: 'Graduate studies focused on software engineering and system design.',
      sortOrder: 1,
    },
    {
      institution: 'RevoU',
      degree: 'Program',
      fieldOfStudy: 'Full-Stack Software Engineering',
      gpa: null,
      startDate: new Date('2025-06-01'),
      endDate: new Date('2026-02-28'),
      description: 'Intensive full-stack software engineering program.',
      sortOrder: 2,
    },
  ];

  for (const item of educations) {
    const existing = await prisma.education.findFirst({
      where: {
        institution: item.institution,
        degree: item.degree,
        startDate: item.startDate,
      },
      select: { id: true },
    });

    if (existing) {
      await prisma.education.update({
        where: { id: existing.id },
        data: item,
      });
    } else {
      await prisma.education.create({ data: item });
    }
  }

  const certifications = [
    {
      name: 'Full Stack Software Engineering',
      issuer: 'RevoU',
      issueDate: new Date('2026-02-01'),
      category: 'Software Engineering',
      sortOrder: 1,
    },
    {
      name: 'Google Cloud Arcade Facilitator',
      issuer: 'Google Cloud/Dicoding',
      issueDate: new Date('2025-10-01'),
      category: 'Cloud',
      sortOrder: 2,
    },
    {
      name: 'Alibaba Cloud Certified Associate',
      issuer: 'Alibaba Cloud',
      issueDate: new Date('2025-08-01'),
      category: 'Cloud',
      sortOrder: 3,
    },
    {
      name: 'Code Generation Using IBM Granite',
      issuer: 'IBM SkillsBuild',
      issueDate: new Date('2025-06-01'),
      category: 'AI',
      sortOrder: 4,
    },
    {
      name: 'MERN Stack Course',
      issuer: 'WPU Course',
      issueDate: new Date('2025-05-01'),
      category: 'Web Development',
      sortOrder: 5,
    },
    {
      name: 'Complete Full-Stack Bootcamp',
      issuer: 'Udemy',
      issueDate: new Date('2025-01-01'),
      category: 'Web Development',
      sortOrder: 6,
    },
    {
      name: 'SQL and PostgreSQL Guide',
      issuer: 'Udemy',
      issueDate: new Date('2024-12-01'),
      category: 'Database',
      sortOrder: 7,
    },
    {
      name: 'Bangkit Academy (Top 50 Capstone)',
      issuer: 'Google',
      issueDate: new Date('2021-07-01'),
      category: 'Capstone',
      sortOrder: 8,
    },
    {
      name: 'Belajar Dasar Pemrograman JavaScript',
      issuer: 'Dicoding',
      issueDate: new Date('2021-06-01'),
      category: 'Programming',
      sortOrder: 9,
    },
  ];

  for (const item of certifications) {
    const existing = await prisma.certification.findFirst({
      where: {
        name: item.name,
        issuer: item.issuer,
        issueDate: item.issueDate,
      },
      select: { id: true },
    });

    if (existing) {
      await prisma.certification.update({
        where: { id: existing.id },
        data: item,
      });
    } else {
      await prisma.certification.create({ data: item });
    }
  }

  console.log('Seed completed successfully');
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
