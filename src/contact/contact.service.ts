import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { paginateResponse } from '../common/utils/paginate';
import { CreateContactDto } from './dto/create-contact.dto';
import nodemailer, { Transporter } from 'nodemailer';

@Injectable()
export class ContactService {
  private readonly transporter: Transporter;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.config.get('SMTP_HOST'),
      port: Number(this.config.get('SMTP_PORT') ?? 587),
      secure: false,
      auth: {
        user: this.config.get('SMTP_USER'),
        pass: this.config.get('SMTP_PASS'),
      },
    });
  }

  async submitMessage(dto: CreateContactDto) {
    const created = await this.prisma.contactMessage.create({
      data: dto,
    });

    const notifyEmail = this.config.get<string>('ADMIN_NOTIFY_EMAIL');
    const fromEmail = this.config.get<string>('SMTP_FROM');

    if (!notifyEmail || !fromEmail) {
      throw new InternalServerErrorException(
        'ADMIN_NOTIFY_EMAIL and SMTP_FROM must be configured',
      );
    }

    await this.transporter.sendMail({
      to: notifyEmail,
      from: fromEmail,
      subject: `[Contact] ${dto.subject}`,
      replyTo: dto.email,
      text: [
        `Name: ${dto.name}`,
        `Email: ${dto.email}`,
        `Subject: ${dto.subject}`,
        '',
        dto.message,
      ].join('\n'),
      html: `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${dto.name}</p>
        <p><strong>Email:</strong> ${dto.email}</p>
        <p><strong>Subject:</strong> ${dto.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${dto.message.replace(/\n/g, '<br/>')}</p>
      `,
    });

    return created;
  }

  async listAll(page = 1, limit = 10) {
    const safePage = Number.isFinite(page) && page > 0 ? page : 1;
    const safeLimit =
      Number.isFinite(limit) && limit > 0 ? Math.min(limit, 50) : 10;

    const [items, total] = await Promise.all([
      this.prisma.contactMessage.findMany({
        orderBy: [{ createdAt: 'desc' }],
        skip: (safePage - 1) * safeLimit,
        take: safeLimit,
      }),
      this.prisma.contactMessage.count(),
    ]);

    return paginateResponse(items, total, safePage, safeLimit);
  }

  async markAsRead(id: string) {
    const found = await this.prisma.contactMessage.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!found) {
      throw new NotFoundException('Message not found');
    }

    return this.prisma.contactMessage.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async remove(id: string) {
    const found = await this.prisma.contactMessage.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!found) {
      throw new NotFoundException('Message not found');
    }

    await this.prisma.contactMessage.delete({ where: { id } });
    return { success: true };
  }
}
