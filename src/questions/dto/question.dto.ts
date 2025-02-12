import { IsString, IsUUID, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateQuestionDto {
  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty()
  @IsString()
  optionA: string;

  @ApiProperty()
  @IsString()
  optionB: string;

  @ApiProperty()
  @IsString()
  optionC: string;

  @ApiProperty()
  @IsString()
  optionD: string;

  @ApiProperty()
  @IsString()
  answer: string;

  @ApiProperty()
  @IsString()
  explanation: string;

  @ApiProperty()
  @IsUUID()
  seasonId: string;

  @ApiProperty()
  @IsNumber()
  orderIndex: number;
}

export class UpdateQuestionDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  optionA?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  optionB?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  optionC?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  optionD?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  answer?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  explanation?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  orderIndex?: number;
}

export class SubmitAnswerDto {
  @ApiProperty()
  @IsString()
  answer: string;
}

export class QuestionFilterDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  seasonId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  page?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  limit?: number;
}
