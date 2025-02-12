import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateQuestionDto,
  UpdateQuestionDto,
  QuestionFilterDto,
} from './dto/question.dto';

@Injectable()
export class QuestionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateQuestionDto) {
    return this.prisma.question.create({
      data: {
        content: dto.content,
        answer: dto.answer,
        explanation: dto.explanation,
        orderIndex: dto.orderIndex,
        season: { connect: { id: dto.seasonId } },
      },
    });
  }

  async findAll(filter: QuestionFilterDto) {
    const { seasonId, page = 1, limit = 10 } = filter;
    const skip = (page - 1) * limit;

    const where = seasonId ? { seasonId } : {};

    const [questions, total] = await Promise.all([
      this.prisma.question.findMany({
        where,
        skip,
        take: limit,
        orderBy: { orderIndex: 'asc' },
      }),
      this.prisma.question.count({ where }),
    ]);

    return {
      data: questions,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, userId: string) {
    const question = await this.prisma.question.findUnique({
      where: { id },
      include: {
        season: {
          include: {
            progress: {
              where: { userId },
            },
          },
        },
      },
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    if (!question.season.progress.length) {
      throw new ForbiddenException('You must start the season first');
    }

    return question;
  }

  async update(id: string, dto: UpdateQuestionDto) {
    await this.findOne(id, '');

    return this.prisma.question.update({
      where: { id },
      data: {
        ...(dto.content && { content: dto.content }),
        ...(dto.answer && { answer: dto.answer }),
        ...(dto.explanation && { explanation: dto.explanation }),
        ...(dto.orderIndex && { orderIndex: dto.orderIndex }),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id, '');

    await this.prisma.question.delete({
      where: { id },
    });

    return { message: 'Question deleted successfully' };
  }

  async submitAnswer(id: string, answer: string, userId: string) {
    const question = await this.findOne(id, userId);
    const seasonProgress = question.season.progress[0];

    if (seasonProgress.isCompleted) {
      throw new BadRequestException('Season is already completed');
    }

    const existingAttempt = await this.prisma.questionAttempt.findFirst({
      where: {
        questionId: id,
        userId,
      },
    });

    if (existingAttempt) {
      throw new BadRequestException('You have already attempted this question');
    }

    const isCorrect = answer.toLowerCase() === question.answer.toLowerCase();
    const points = isCorrect ? 10 : 0;

    return this.prisma.questionAttempt.create({
      data: {
        questionId: id,
        userId,
        answer,
        isCorrect,
        points,
        startTime: new Date(),
        endTime: new Date(),
      },
      include: {
        question: {
          select: {
            answer: true,
            explanation: true,
          },
        },
      },
    });
  }

  async findBySeasonId(seasonId: string, userId: string) {
    const season = await this.prisma.season.findUnique({
      where: { id: seasonId },
      include: {
        progress: {
          where: { userId },
        },
      },
    });

    if (!season) {
      throw new NotFoundException('Season not found');
    }

    if (!season.progress.length) {
      throw new ForbiddenException('You must start the season first');
    }

    return this.prisma.question.findMany({
      where: { seasonId },
      orderBy: { orderIndex: 'asc' },
      include: {
        attempts: {
          where: { userId },
        },
      },
    });
  }

  async getUserProgress(userId: string) {
    return this.prisma.questionAttempt.findMany({
      where: { userId },
      include: {
        question: true,
      },
    });
  }
}
