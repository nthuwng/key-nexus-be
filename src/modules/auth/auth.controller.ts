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
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '../../common/guards/local-auth.guard';
import type { Response, Request } from 'express';
import {
  Permissions,
  Public,
  ResponseMessage,
  User,
} from 'src/decorator/customize';
import type { IUser } from '../users/users.interface';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Public()
  @ResponseMessage('Đăng nhập thành công')
  @Post('login')
  handleLogin(@Req() req, @Res({ passthrough: true }) response: Response) {
    return this.authService.login(req.user, response);
  }

  @ResponseMessage('Lấy thông tin người dùng thành công')
  @Get('profile')
  getProfile(@User() user: IUser) {
    return this.authService.getAccount(user);
  }
}
