import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY, PERMISSIONS_KEY } from 'src/decorator/customize';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException(
        'Bạn cần đăng nhập để thực hiện hành động này',
      );
    }

    if (user.roleId?.name === 'SUPER_ADMIN') {
      return true;
    }

    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    const targetEndPoint = request.route?.path as string;

    if (
      targetEndPoint &&
      (targetEndPoint.startsWith('/api/v1/auth') ||
        targetEndPoint.includes('/auth/'))
    ) {
      return true;
    }

    if (!requiredPermissions || requiredPermissions.length === 0) {
      throw new ForbiddenException(
        'API này chưa được khai báo permission hoặc không đủ quyền truy cập',
      );
    }

    const userPermissions = await this.usersService.getPermissionsByUserId(
      user._id,
    );

    const hasPermission = requiredPermissions.some((permission) =>
      userPermissions.includes(permission),
    );

    if (!hasPermission) {
      throw new ForbiddenException('Bạn không có quyền truy cập vào API này');
    }

    return true;
  }
}
