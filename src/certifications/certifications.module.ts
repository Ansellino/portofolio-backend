import { Module } from '@nestjs/common';
import { AdminCertificationsController } from './admin-certifications.controller';
import { CertificationsController } from './certifications.controller';
import { CertificationsService } from './certifications.service';

@Module({
  controllers: [CertificationsController, AdminCertificationsController],
  providers: [CertificationsService],
})
export class CertificationsModule {}
