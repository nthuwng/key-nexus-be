import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IUser } from 'src/modules/users/users.interface';
import { RolesService } from 'src/modules/roles/roles.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private rolesService: RolesService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('JWT_ACCESS_TOKEN_SECRET') || 'default',
    });
  }

  async validate(payload: IUser) {
    const { _id, fullName, email, roleId } = payload;

    //req.user
    return {
      _id,
      fullName,
      email,
      roleId,
    };
  }
}
