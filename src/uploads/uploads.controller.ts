import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Param,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { DeleteFileDto } from './dto/delete-file.dto';
import { UploadsService } from './uploads.service';

@ApiTags('uploads')
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post(':bucket')
  @ApiOperation({ summary: 'Upload a file to a storage bucket' })
  @ApiParam({ name: 'bucket', description: 'Target storage bucket' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
      required: ['file'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'File uploaded successfully',
    schema: {
      example: {
        url: 'https://example.supabase.co/storage/v1/object/public/projects/uuid-project.png',
        filename: 'f6ab902a-38ac-4d24-be5e-246ec9a5cc8f-project.png',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid file payload' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
    }),
  )
  async upload(
    @Param('bucket') bucket: string,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({
          maxSize: Number(process.env.MAX_FILE_SIZE ?? 5 * 1024 * 1024),
        })
        .build({
          fileIsRequired: true,
          errorHttpStatusCode: 400,
        }),
    )
    file: Express.Multer.File,
  ) {
    if (!file?.buffer) {
      throw new BadRequestException('File is required');
    }

    return this.uploadsService.uploadFile(file, bucket);
  }

  @Delete(':bucket')
  @ApiOperation({ summary: 'Delete a file from a storage bucket' })
  @ApiParam({ name: 'bucket', description: 'Target storage bucket' })
  @ApiResponse({
    status: 200,
    description: 'File deleted successfully',
    schema: {
      example: {
        success: true,
      },
    },
  })
  @ApiResponse({ status: 404, description: 'File not found' })
  remove(@Param('bucket') bucket: string, @Body() body: DeleteFileDto) {
    return this.uploadsService.deleteFile(body.filename, bucket);
  }
}
