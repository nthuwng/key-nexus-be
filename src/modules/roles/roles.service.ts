import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from './schemas/role.schema';
import mongoose, { Model } from 'mongoose';
import aqp from 'api-query-params';

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

  async findAll(currentPage: string, limit: string, qs: string) {
    const { filter, sort, population ,projection} = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.roleModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.roleModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .select(projection)
      .exec();

    return {
      meta: {
        current: currentPage,
        pageSize: limit,
        pages: totalPages,
        total: totalItems,
      },
      result,
    };
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
