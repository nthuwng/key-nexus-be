import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import aqp from 'api-query-params';
import { Role, RoleDocument } from '../roles/schemas/role.schema';

@Injectable()
export class UsersService {
  @InjectModel(User.name) private userModel: Model<UserDocument>;
  @InjectModel(Role.name) private roleModel: Model<RoleDocument>;

  getHashPassword = (password: string) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
  };

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = this.getHashPassword(createUserDto.password);
    const newUser = await this.userModel.create({
      fullName: createUserDto.fullName,
      email: createUserDto.email,
      password: hashedPassword,
      gender: createUserDto.gender,
      phone: createUserDto.phone,
      roleId: createUserDto.roleId,
    });
    return {
      _id: newUser?._id,
      createdAt: newUser?.createdAt,
    };
  }

  async findAll(currentPage: string, limit: string, qs: string) {
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.userModel
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

  findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'Not found user';
    const user = this.userModel
      .findOne({ _id: id })
      .select('-password')
      .populate({
        path: 'roleId',
        select: { name: 1, _id: 1 },
      });

    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return 'Not found user';
    }

    const foundUser = await this.userModel.findOne({ _id: id });

    if (foundUser?.email === 'huwngdev@gmail.com') {
      throw new BadRequestException('Cannot delete admin user');
    }

    return await this.userModel.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date() },
      { new: true }, // Trả về bản ghi sau khi đã cập nhật
    );
  }

  findOneByUserName(username: string) {
    return this.userModel.findOne({ email: username }).populate({
      path: 'roleId',
      select: { name: 1 },
    });
  }

  isValidPassword(password: string, hashPassword: string) {
    return bcrypt.compareSync(password, hashPassword);
  }

  updateUserToken = async (refreshTokenHash: string, _id: string) => {
    return await this.userModel.updateOne({ _id }, { refreshTokenHash });
  };

  async getPermissionsByUserId(userId: string): Promise<string[]> {
    const user = (await this.userModel
      .findById(userId)
      .populate({
        path: 'roleId',
        populate: { path: 'permissions' },
      })
      .lean()) as any;

    if (!user || !user.roleId || !user.roleId?.permissions) return [];

    return user.roleId.permissions.map((p: any) => p.key);
  }

  async findGetAccount(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'Not found user';
    const user = await this.userModel
      .findOne({ _id: id })
      .select('-password -refreshTokenHash')
      .populate({
        path: 'roleId',
        select: { name: 1, _id: 1, permissions: 1 },
        populate: {
          path: 'permissions',
          select: { key: 1, method: 1, module: 1, description: 1 },
        },
      });

    const role = await this.roleModel
      .findOne({ _id: user?.roleId })
      .populate({
        path: 'permissions',
        select: { key: 1, method: 1, module: 1, description: 1 },
      })
      .select({ _id: 1, name: 1, permissions: 1 });

    const result = { ...user?.toObject(), roleId: role };

    return result;
  }
}
