import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  RegisterDto,
  LoginDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  UpdatePasswordDto,
} from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Request } from 'express';
import { IUser } from './interfaces/user.interface';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async register(@Body() dto: RegisterDto): Promise<IUser> {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'User successfully logged in' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Request password reset' })
  @ApiResponse({ status: 200, description: 'Reset token sent' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password using token' })
  @ApiResponse({ status: 200, description: 'Password successfully reset' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @Post('update-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update password' })
  @ApiResponse({ status: 200, description: 'Password successfully updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updatePassword(@Req() req: Request, @Body() dto: UpdatePasswordDto) {
    const user = req.user as IUser;
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return this.authService.updatePassword(user.id, dto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProfile(@Req() req: Request) {
    return req.user;
  }
}
