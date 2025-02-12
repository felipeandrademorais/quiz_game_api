import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateSeasonDto,
  UpdateSeasonDto,
  SeasonFilterDto,
} from './dto/season.dto';

@Injectable()
export class SeasonsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSeasonDto) {
    return this.prisma.season.create({
      data: {
        title: dto.title,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
      },
    });
  }

  async findAll(filter: SeasonFilterDto) {
    const { date, page = 1, limit = 10 } = filter;
    const skip = (page - 1) * limit;

    const where = date
      ? {
          startDate: { lte: new Date(date) },
          endDate: { gte: new Date(date) },
        }
      : {};

    const [seasons, total] = await Promise.all([
      this.prisma.season.findMany({
        where,
        skip,
        take: limit,
        include: {
          _count: {
            select: {
              questions: true,
              progress: true,
            },
          },
        },
        orderBy: { startDate: 'desc' },
      }),
      this.prisma.season.count({ where }),
    ]);

    return {
      data: seasons,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const season = await this.prisma.season.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { orderIndex: 'asc' },
        },
      },
    });

    if (!season) {
      throw new NotFoundException('Season not found');
    }

    return season;
  }

  async update(id: string, dto: UpdateSeasonDto) {
    await this.findOne(id);

    return this.prisma.season.update({
      where: { id },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.startDate && { startDate: new Date(dto.startDate) }),
        ...(dto.endDate && { endDate: new Date(dto.endDate) }),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.season.delete({
      where: { id },
    });

    return { message: 'Season deleted successfully' };
  }

  async startSeason(userId: string, seasonId: string) {
    const season = await this.findOne(seasonId);
    const now = new Date();

    if (now < season.startDate || now > season.endDate) {
      throw new ForbiddenException('Season is not currently available');
    }

    const existingProgress = await this.prisma.seasonProgress.findUnique({
      where: {
        userId_seasonId: {
          userId,
          seasonId,
        },
      },
    });

    if (existingProgress) {
      if (existingProgress.isCompleted) {
        throw new BadRequestException('You have already completed this season');
      }
      return existingProgress;
    }

    return this.prisma.seasonProgress.create({
      data: {
        userId,
        seasonId,
      },
    });
  }

  async completeSeason(userId: string, seasonId: string) {
    const progress = await this.prisma.seasonProgress.findUnique({
      where: {
        userId_seasonId: {
          userId,
          seasonId,
        },
      },
    });

    if (!progress) {
      throw new NotFoundException('Season progress not found');
    }

    if (progress.isCompleted) {
      throw new BadRequestException('Season is already completed');
    }

    return this.prisma.seasonProgress.update({
      where: {
        userId_seasonId: {
          userId,
          seasonId,
        },
      },
      data: {
        isCompleted: true,
        endTime: new Date(),
      },
    });
  }

  async getUserProgress(userId: string) {
    return this.prisma.seasonProgress.findMany({
      where: { userId },
      include: {
        season: true,
      },
    });
  }
}
