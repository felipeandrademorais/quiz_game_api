import {
  Controller,
  Post,
  Get,
  Param,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  StreamableFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PdfProcessorService } from './pdf-processor.service';
import { ApiTags, ApiConsumes, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('pdf-processor')
@Controller('pdf-processor')
export class PdfProcessorController {
  constructor(private readonly pdfProcessorService: PdfProcessorService) {}

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadPdf(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (file.mimetype !== 'application/pdf') {
      throw new BadRequestException(
        'Invalid file type. Only PDF files are allowed',
      );
    }

    return this.pdfProcessorService.uploadPdf(file);
  }

  @Get('status/:jobId')
  @ApiResponse({
    status: 200,
    description: 'Returns the current status of the PDF processing job',
  })
  async getProcessingStatus(@Param('jobId') jobId: string) {
    return this.pdfProcessorService.getProcessingStatus(jobId);
  }

  @Get('download/:jobId')
  @ApiResponse({
    status: 200,
    description: 'Returns the processed JSON file',
  })
  async downloadJson(@Param('jobId') jobId: string) {
    const result = await this.pdfProcessorService.getProcessedJson(jobId);
    return result;
  }
}
