import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ResumeService } from './resume.service';

@Controller()
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @Get('resume/download')
  async download(@Res() res: Response) {
    const pdfBuffer = await this.resumeService.generateResumePdf();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="jeremy-ansellino-resume.pdf"',
    );
    res.send(pdfBuffer);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/resume/preview')
  async preview(@Res() res: Response) {
    const pdfBuffer = await this.resumeService.generateResumePdf();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'inline; filename="resume-preview.pdf"',
    );
    res.send(pdfBuffer);
  }
}
