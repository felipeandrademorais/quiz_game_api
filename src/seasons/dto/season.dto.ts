import {
  IsString,
  IsDateString,
  IsArray,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSeasonDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsDateString()
  startDate: string;

  @ApiProperty()
  @IsDateString()
  endDate: string;
}

export class UpdateSeasonDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  endDate?: string;
}

export class SeasonProgressDto {
  @ApiProperty()
  @IsUUID()
  seasonId: string;
}

export class SeasonFilterDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  page?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  limit?: number;
}
