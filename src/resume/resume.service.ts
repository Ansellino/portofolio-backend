import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import PDFDocument from 'pdfkit';

@Injectable()
export class ResumeService {
  constructor(private readonly prisma: PrismaService) {}

  async generateResumePdf(): Promise<Buffer> {
    const [profile, experiences, education, projects, certifications, skills] =
      await Promise.all([
        this.prisma.profile.findFirst(),
        this.prisma.workExperience.findMany({
          where: { isPublished: true },
          orderBy: [{ sortOrder: 'asc' }, { startDate: 'desc' }],
          take: 3,
        }),
        this.prisma.education.findMany({
          orderBy: [{ sortOrder: 'asc' }, { startDate: 'desc' }],
          take: 2,
        }),
        this.prisma.project.findMany({
          where: { isPublished: true, isFeatured: true },
          orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
          take: 3,
        }),
        this.prisma.certification.findMany({
          where: { isPublished: true },
          orderBy: [{ sortOrder: 'asc' }, { issueDate: 'desc' }],
          take: 9,
        }),
        this.prisma.skill.findMany({
          orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }, { name: 'asc' }],
        }),
      ]);

    const groupedSkills = skills.reduce<Record<string, string[]>>((acc, skill) => {
        if (!acc[skill.category]) {
          acc[skill.category] = [];
        }
        acc[skill.category].push(skill.name);
        return acc;
      },
      {},
    );

    const fullName = profile?.fullName ?? 'Jeremy Ansellino Gunawan';
    const headline = profile?.headline ?? 'Full-Stack Software Engineer';
    const contactLine = [profile?.email, profile?.phone, profile?.location]
      .filter(Boolean)
      .join(' | ');

    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 40, bottom: 40, left: 40, right: 40 },
      info: {
        Title: `${fullName} - Resume`,
        Author: fullName,
      },
    });

    const chunks: Buffer[] = [];

    await new Promise<Buffer>((resolve, reject) => {
      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const primaryBlue = '#2E75B6';
      const bodyColor = '#2C3E50';
      const mutedColor = '#7F8C8D';

      const startSection = (title: string) => {
        doc.moveDown(0.7);
        doc
          .font('Helvetica-Bold')
          .fontSize(12)
          .fillColor(primaryBlue)
          .text(title);
        const y = doc.y + 2;
        doc
          .moveTo(doc.page.margins.left, y)
          .lineTo(doc.page.width - doc.page.margins.right, y)
          .lineWidth(1)
          .strokeColor(primaryBlue)
          .stroke();
        doc.moveDown(0.5);
      };

      const safeText = (text?: string | null) => text?.trim() || '-';

      doc
        .font('Helvetica-Bold')
        .fontSize(18)
        .fillColor(bodyColor)
        .text(fullName);
      doc.font('Helvetica').fontSize(10).fillColor(bodyColor).text(headline);
      doc
        .font('Helvetica')
        .fontSize(9)
        .fillColor(mutedColor)
        .text(contactLine || '-');

      startSection('About Me');
      doc
        .font('Helvetica')
        .fontSize(10)
        .fillColor(bodyColor)
        .text(safeText(profile?.bio), { align: 'left' });

      startSection('Work Experience');
      experiences.forEach((exp) => {
        const period = `${exp.startDate.getFullYear()} - ${exp.endDate ? exp.endDate.getFullYear() : 'Present'}`;
        doc
          .font('Helvetica-Bold')
          .fontSize(10)
          .fillColor(bodyColor)
          .text(`${exp.position} - ${exp.company}`);
        doc
          .font('Helvetica')
          .fontSize(9)
          .fillColor(mutedColor)
          .text(`${period} | ${exp.employmentType.replace('_', ' ')}`);
        if (exp.description) {
          doc
            .font('Helvetica')
            .fontSize(10)
            .fillColor(bodyColor)
            .text(exp.description);
        }
        doc.moveDown(0.4);
      });

      startSection('Education');
      education.forEach((edu) => {
        const period = `${edu.startDate.getFullYear()} - ${edu.endDate ? edu.endDate.getFullYear() : 'Present'}`;
        const gpa = edu.gpa ? ` | GPA ${edu.gpa.toString()}` : '';
        doc
          .font('Helvetica-Bold')
          .fontSize(10)
          .fillColor(bodyColor)
          .text(`${edu.degree} - ${edu.institution}`);
        doc
          .font('Helvetica')
          .fontSize(9)
          .fillColor(mutedColor)
          .text(`${edu.fieldOfStudy} | ${period}${gpa}`);
        doc.moveDown(0.4);
      });

      startSection('Featured Projects');
      projects.forEach((project) => {
        doc
          .font('Helvetica-Bold')
          .fontSize(10)
          .fillColor(bodyColor)
          .text(project.title);
        doc
          .font('Helvetica')
          .fontSize(10)
          .fillColor(bodyColor)
          .text(project.description);
        doc.moveDown(0.4);
      });

      startSection('Certifications');
      certifications.forEach((cert) => {
        const issue = cert.issueDate.getFullYear();
        doc
          .font('Helvetica')
          .fontSize(10)
          .fillColor(bodyColor)
          .text(`- ${cert.name} (${cert.issuer}, ${issue})`);
      });

      startSection('Skills');
      Object.entries(groupedSkills).forEach(([category, names]) => {
        doc
          .font('Helvetica-Bold')
          .fontSize(10)
          .fillColor(bodyColor)
          .text(`${category}:`, { continued: true });
        doc
          .font('Helvetica')
          .fontSize(10)
          .fillColor(bodyColor)
          .text(` ${names.join(', ')}`);
      });

      doc.end();
    });

    return Buffer.concat(chunks);
  }
}
