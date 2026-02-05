import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY, PERMISSIONS_KEY } from 'src/decorator/customize';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    const request = context.switchToHttp().getRequest();
    const user = request.user;

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

    if (user.role?.name === 'ADMIN') {
      return true;
    }

    if (!user || !user.permissions) {
      throw new ForbiddenException('Bạn không có quyền truy cập vào API này');
    }

    const userPermissions = user.permissions.map((p) => p.key);

    const hasPermission = requiredPermissions.some((permission) =>
      userPermissions.includes(permission),
    );

    if (!hasPermission) {
      throw new ForbiddenException('Bạn không có quyền truy cập vào API này');
    }

    return true;
  }
}
