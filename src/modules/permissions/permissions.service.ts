import { Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission, PermissionDocument } from './schemas/permission.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PermissionsService {
  @InjectModel(Permission.name)
  private permissionModel: Model<PermissionDocument>;

  async create(createPermissionDto: CreatePermissionDto) {
    const newPermission = await this.permissionModel.create({
      key: createPermissionDto.key,
      description: createPermissionDto.description,
    });
    return {
      id: newPermission._id,
      createdAt: newPermission.createdAt,
    };
  }

  findAll() {
    return `This action returns all permissions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} permission`;
  }

  update(id: number, updatePermissionDto: UpdatePermissionDto) {
    return `This action updates a #${id} permission`;
  }

  remove(id: number) {
    return `This action removes a #${id} permission`;
  }
}
