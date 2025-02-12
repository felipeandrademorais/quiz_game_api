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
import { SeasonsService } from './seasons.service';
import {
  CreateSeasonDto,
  UpdateSeasonDto,
  SeasonFilterDto,
} from './dto/season.dto';
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

@ApiTags('seasons')
@Controller('seasons')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SeasonsController {
  constructor(private readonly seasonsService: SeasonsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a new season' })
  @ApiResponse({ status: 201, description: 'Season successfully created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(@Body() dto: CreateSeasonDto) {
    return this.seasonsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all seasons' })
  @ApiResponse({ status: 200, description: 'Return all seasons' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@Query() filter: SeasonFilterDto) {
    return this.seasonsService.findAll(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a season by id' })
  @ApiResponse({ status: 200, description: 'Return the season' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found' })
  findOne(@Param('id') id: string) {
    return this.seasonsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update a season' })
  @ApiResponse({ status: 200, description: 'Season successfully updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not found' })
  update(@Param('id') id: string, @Body() dto: UpdateSeasonDto) {
    return this.seasonsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete a season' })
  @ApiResponse({ status: 200, description: 'Season successfully deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not found' })
  remove(@Param('id') id: string) {
    return this.seasonsService.remove(id);
  }

  @Post(':id/start')
  @ApiOperation({ summary: 'Start a season' })
  @ApiResponse({ status: 201, description: 'Season successfully started' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  startSeason(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as IUser;
    return this.seasonsService.startSeason(user.id, id);
  }

  @Post(':id/complete')
  @ApiOperation({ summary: 'Complete a season' })
  @ApiResponse({ status: 201, description: 'Season successfully completed' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found' })
  completeSeason(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as IUser;
    return this.seasonsService.completeSeason(user.id, id);
  }

  @Get('user/progress')
  @ApiOperation({ summary: 'Get user progress in all seasons' })
  @ApiResponse({ status: 200, description: 'Return user progress' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getUserProgress(@Req() req: Request) {
    const user = req.user as IUser;
    return this.seasonsService.getUserProgress(user.id);
  }
}
