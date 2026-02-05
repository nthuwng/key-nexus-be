import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  @InjectModel(User.name) private userModel: Model<UserDocument>;

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
      role: createUserDto.role,
    });
    return {
      _id: newUser?._id,
      createdAt: newUser?.createdAt,
    };
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
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
      path: 'role',
      select: { name: 1 },
    });
  }

  isValidPassword(password: string, hashPassword: string) {
    return bcrypt.compareSync(password, hashPassword);
  }

  updateUserToken = async (refreshTokenHash: string, _id: string) => {
    return await this.userModel.updateOne({ _id }, { refreshTokenHash });
  };
}
