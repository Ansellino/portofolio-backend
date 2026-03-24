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
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { DeleteFileDto } from './dto/delete-file.dto';
import { UploadsService } from './uploads.service';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post(':bucket')
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
  remove(@Param('bucket') bucket: string, @Body() body: DeleteFileDto) {
    return this.uploadsService.deleteFile(body.filename, bucket);
  }
}
