import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import {
  CreateQuestionDto,
  UpdateQuestionDto,
  SubmitAnswerDto,
  QuestionFilterDto,
} from './dto/question.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Request } from 'express';
import { IUser } from '../auth/interfaces/user.interface';

@ApiTags('questions')
@Controller('questions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a new question' })
  @ApiResponse({ status: 201, description: 'Question successfully created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(@Body() dto: CreateQuestionDto) {
    return this.questionsService.create(dto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all questions' })
  @ApiResponse({ status: 200, description: 'Return all questions' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  findAll(@Query() filter: QuestionFilterDto) {
    return this.questionsService.findAll(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a question by id' })
  @ApiResponse({ status: 200, description: 'Return the question' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found' })
  findOne(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as IUser;
    return this.questionsService.findOne(id, user.id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update a question' })
  @ApiResponse({ status: 200, description: 'Question successfully updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not found' })
  update(@Param('id') id: string, @Body() dto: UpdateQuestionDto) {
    return this.questionsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete a question' })
  @ApiResponse({ status: 200, description: 'Question successfully deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not found' })
  remove(@Param('id') id: string) {
    return this.questionsService.remove(id);
  }

  @Post(':id/submit')
  @ApiOperation({ summary: 'Submit an answer for a question' })
  @ApiResponse({ status: 201, description: 'Answer successfully submitted' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found' })
  submitAnswer(
    @Param('id') id: string,
    @Body() dto: SubmitAnswerDto,
    @Req() req: Request,
  ) {
    const user = req.user as IUser;
    return this.questionsService.submitAnswer(id, dto.answer, user.id);
  }

  @Get('season/:seasonId')
  @ApiOperation({ summary: 'Get all questions for a season' })
  @ApiResponse({
    status: 200,
    description: 'Return all questions for the season',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found' })
  findBySeasonId(@Param('seasonId') seasonId: string, @Req() req: Request) {
    const user = req.user as IUser;
    return this.questionsService.findBySeasonId(seasonId, user.id);
  }

  @Get('user/progress')
  @ApiOperation({ summary: 'Get user progress in all questions' })
  @ApiResponse({ status: 200, description: 'Return user progress' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getUserProgress(@Req() req: Request) {
    const user = req.user as IUser;
    return this.questionsService.getUserProgress(user.id);
  }
}
