import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { IUser, IUserProfile } from '../users/users.interface';
import { JwtService } from '@nestjs/jwt';
import ms, { StringValue } from 'ms';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import bcrypt from 'node_modules/bcryptjs';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUserName(username);
    if (user) {
      const isValid = this.usersService.isValidPassword(pass, user.password);
      if (isValid === true) {
        const objUser = {
          ...user.toObject(),
        };

        return objUser;
      }
    }

    return user;
  }

  async login(user: IUser, response: Response) {
    const { _id, fullName, email, roleId } = user;
    const payload = {
      sub: 'token login',
      iss: 'from server',
      _id,
      fullName,
      email,
      roleId,
    };

    const refresh_token = this.createRefreshToken(payload);

    // //update refresh token in db
    const refreshTokenHash = await bcrypt.hash(refresh_token, 10);
    await this.usersService.updateUserToken(refreshTokenHash, _id);

    // //set cookie
    response.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      maxAge: ms(
        (this.configService.get<string>('JWT_REFRESH_EXPIRE') as StringValue) ||
          '1d',
      ),
    });

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        _id,
        fullName,
        email,
        roleId,
      },
    };
  }

  createRefreshToken = (payload: any) => {
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn:
        ms(
          (this.configService.get<string>(
            'JWT_REFRESH_EXPIRE',
          ) as StringValue) || '1d',
        ) / 1000,
    });

    return refresh_token;
  };

  async getAccount(user: IUser) {
    const userData = await this.usersService.findGetAccount(user._id);

    if (!userData || typeof userData === 'string') {
      throw new BadRequestException('Không tìm thấy thông tin tài khoản');
    }

    const result: IUserProfile = {
      _id: userData?._id?.toString() || '',
      fullName: userData.fullName || '',
      email: userData.email || '',
      gender: userData.gender || '',
      phone: userData.phone || '',
      status: userData.status || '',
      roleId: {
        _id: userData.roleId?._id?.toString() || '',
        name: userData.roleId?.name || '',
      },
      permissions: (userData.roleId?.permissions ?? []).map((p: any) => ({
        _id: p._id?.toString(),
        key: p.key,
        method: p.method,
        module: p.module,
        description: p.description,
      })),
    };

    return { user: result };
  }
}
