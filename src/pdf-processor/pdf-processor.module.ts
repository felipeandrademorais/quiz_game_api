import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { PdfProcessorController } from './pdf-processor.controller';
import { PdfProcessorService } from './pdf-processor.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
    }),
    BullModule.registerQueue({
      name: 'pdf-processing',
    }),
  ],
  controllers: [PdfProcessorController],
  providers: [PdfProcessorService],
})
export class PdfProcessorModule {}
