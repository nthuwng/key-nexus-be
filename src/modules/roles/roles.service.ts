import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from './schemas/role.schema';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class RolesService {
  @InjectModel(Role.name)
  private roleModel: Model<RoleDocument>;

  async create(createRoleDto: CreateRoleDto) {
    const newRole = await this.roleModel.create({
      ...createRoleDto,
    });
    return {
      id: newRole._id,
      createdAt: newRole.createdAt,
    };
  }

  findAll() {
    return `This action returns all roles`;
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return new BadRequestException(`Not found role`);
    }

    return await this.roleModel.findById(id).populate({
      path: 'permissions',
      select: { _id: 1, key: 1, description: 1 },
    });
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
