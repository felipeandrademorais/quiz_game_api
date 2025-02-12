import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { createWorker } from 'tesseract.js';
import * as fs from 'fs';

interface ProcessedQuestion {
  questionNumber: number;
  questionText: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: string;
  comment: string;
}

interface ProcessedExam {
  examTitle: string;
  questions: ProcessedQuestion[];
}

@Injectable()
export class PdfProcessorService {
  constructor(
    @InjectQueue('pdf-processing') private readonly pdfQueue: Queue,
  ) {}

  async uploadPdf(file: Express.Multer.File) {
    const jobId = `pdf-${Date.now()}`;
    await this.pdfQueue.add('process-pdf', {
      filePath: file.path,
      originalName: file.originalname,
      jobId,
    });
    return { jobId };
  }

  async getProcessingStatus(jobId: string) {
    const job = await this.pdfQueue.getJob(jobId);
    if (!job) {
      return { status: 'not-found' };
    }

    const state = await job.getState();
    const progress = await job.progress();
    return { status: state, progress };
  }

  async getProcessedJson(jobId: string) {
    const job = await this.pdfQueue.getJob(jobId);
    if (!job) {
      throw new Error('Job not found');
    }

    const result = await job.finished();
    if (!result) {
      throw new Error('Processing not completed');
    }

    return result;
  }

  async processPdf(filePath: string): Promise<ProcessedExam> {
    const worker = await createWorker('eng');
    const {
      data: { text },
    } = await worker.recognize(filePath);
    await worker.terminate();

    // Here you would implement the logic to parse the text and extract questions
    // This is a simplified example
    const processedData: ProcessedExam = {
      examTitle: 'Extracted Exam Title',
      questions: [],
    };

    // Clean up the uploaded file
    fs.unlinkSync(filePath);

    return processedData;
  }
}
