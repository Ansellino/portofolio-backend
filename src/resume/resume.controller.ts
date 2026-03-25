import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ResumeService } from './resume.service';

@ApiTags('resume')
@Controller()
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @Get('resume/download')
  @ApiOperation({ summary: 'Download resume PDF' })
  @ApiResponse({
    status: 200,
    description: 'Resume PDF downloaded',
    schema: {
      type: 'string',
      format: 'binary',
    },
  })
  async download(@Res() res: Response) {
    const pdfBuffer = await this.resumeService.generateResumePdf();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="jeremy-ansellino-resume.pdf"',
    );
    res.send(pdfBuffer);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('admin/resume/preview')
  @ApiOperation({ summary: 'Preview resume PDF for admin' })
  @ApiResponse({
    status: 200,
    description: 'Resume PDF preview generated',
    schema: {
      type: 'string',
      format: 'binary',
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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
