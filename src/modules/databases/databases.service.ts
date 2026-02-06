import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import {
  Permission,
  PermissionDocument,
} from '../permissions/schemas/permission.schema';
import { Role, RoleDocument } from '../roles/schemas/role.schema';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { Model } from 'mongoose';
import { INIT_PERMISSIONS, SUPER_ADMIN_ROLE, USER_ROLE } from './sample';

@Injectable()
export class DatabasesService {
  private readonly logger = new Logger(DatabasesService.name);
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,

    @InjectModel(Permission.name)
    private permissionModel: Model<PermissionDocument>,

    @InjectModel(Role.name)
    private roleModel: Model<RoleDocument>,

    private configService: ConfigService,
    private userServices: UsersService,
  ) {}

  async onModuleInit() {
    const isInit = this.configService.get<string>('SHOULD_INIT');
    if (Boolean(isInit)) {
      const countPermissions = await this.permissionModel.countDocuments();
      const countRoles = await this.roleModel.countDocuments();
      const countUsers = await this.userModel.countDocuments();

      if (countPermissions === 0) {
        await this.permissionModel.insertMany(INIT_PERMISSIONS);
      }

      if (countRoles === 0) {
        await this.roleModel.insertMany([
          {
            name: SUPER_ADMIN_ROLE,
          },
        ]);

        await this.roleModel.insertMany([
          {
            name: USER_ROLE,
          },
        ]);
      }

      if (countUsers === 0) {
        const adminRole = await this.roleModel
          .findOne({ name: SUPER_ADMIN_ROLE })
          .select('_id');

        const userRole = await this.roleModel
          .findOne({ name: USER_ROLE })
          .select('_id');

        await this.userModel.insertMany([
          {
            fullName: "I'm  Super Admin",
            email: 'superadmin@gmail.com',
            password: this.userServices.getHashPassword(
              this.configService.get<string>('INIT_PASSWORD') || '123456',
            ),
            roleId: adminRole?._id,
            gender: 'male',
            phone: '0123456789',
          },
          {
            fullName: "I'm Normal User",
            email: 'user@gmail.com',
            password: this.userServices.getHashPassword(
              this.configService.get<string>('INIT_PASSWORD') || '123456',
            ),
            roleId: userRole?._id,
            gender: 'male',
            phone: '0123456789',
          },
        ]);
      }

      if (countPermissions > 0 && countRoles > 0 && countUsers > 0) {
        this.logger.log('>>>>>>>>>>> ALREADY INIT SAMPLE DATA');
      }
    }
  }
}
