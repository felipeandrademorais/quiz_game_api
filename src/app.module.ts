import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SeasonsModule } from './seasons/seasons.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { PdfProcessorModule } from './pdf-processor/pdf-processor.module';
import { QuestionsModule } from './questions/questions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    SeasonsModule,
    AuthModule,
    PdfProcessorModule,
    QuestionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
