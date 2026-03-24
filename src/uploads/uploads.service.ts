import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'node:crypto';

type TransformPreset = 'thumbnail' | 'avatar' | 'logo' | 'full';

@Injectable()
export class UploadsService {
  private readonly supabase: ReturnType<typeof createClient>;
  private readonly buckets = new Set([
    'avatars',
    'projects',
    'certifications',
    'blog',
    'logos',
    'resume',
  ]);

  constructor(private readonly config: ConfigService) {
    const supabaseUrl = this.config.get<string>('SUPABASE_URL');
    const serviceKey = this.config.get<string>('SUPABASE_SERVICE_KEY');

    if (!supabaseUrl || !serviceKey) {
      throw new Error('SUPABASE_URL and SUPABASE_SERVICE_KEY must be set');
    }

    this.supabase = createClient(supabaseUrl, serviceKey);
  }

  async uploadFile(file: Express.Multer.File, bucket: string) {
    this.ensureBucketAllowed(bucket);

    const allowed = new Set([
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/pdf',
    ]);

    if (!allowed.has(file.mimetype)) {
      throw new BadRequestException('Invalid file type');
    }

    const safeOriginalName = file.originalname.replace(/\s+/g, '-');
    const filename = `${randomUUID()}-${safeOriginalName}`;

    const { error } = await this.supabase.storage
      .from(bucket)
      .upload(filename, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      throw new BadRequestException(error.message);
    }

    const { data } = this.supabase.storage.from(bucket).getPublicUrl(filename);
    return { url: data.publicUrl, filename };
  }

  async deleteFile(filename: string, bucket: string) {
    this.ensureBucketAllowed(bucket);
    const { error } = await this.supabase.storage
      .from(bucket)
      .remove([filename]);

    if (error) {
      throw new BadRequestException(error.message);
    }

    return { success: true };
  }

  getTransformedUrl(url: string, preset: TransformPreset) {
    const presets: Record<TransformPreset, string> = {
      thumbnail: 'width=400&height=250&resize=cover',
      avatar: 'width=200&height=200&resize=cover',
      logo: 'width=80&height=80&resize=contain',
      full: 'width=800&resize=contain',
    };

    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${presets[preset]}`;
  }

  private ensureBucketAllowed(bucket: string) {
    if (!this.buckets.has(bucket)) {
      throw new BadRequestException('Invalid bucket');
    }
  }
}
