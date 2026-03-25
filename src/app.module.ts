import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import AuthModule from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { ExperiencesModule } from './experiences/experiences.module';
import { CertificationsModule } from './certifications/certifications.module';
import { EducationModule } from './education/education.module';
import { SkillsModule } from './skills/skills.module';
import { ProfileModule } from './profile/profile.module';
import { UploadsModule } from './uploads/uploads.module';
import { BlogModule } from './blog/blog.module';
import { ContactModule } from './contact/contact.module';
import { ResumeModule } from './resume/resume.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([{ name: 'default', ttl: 60000, limit: 20 }]),
    PrismaModule,
    AuthModule,
    ProjectsModule,
    ExperiencesModule,
    CertificationsModule,
    EducationModule,
    SkillsModule,
    ProfileModule,
    UploadsModule,
    BlogModule,
    ContactModule,
    ResumeModule,
  ],
})
export class AppModule {}
