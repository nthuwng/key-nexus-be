import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class UsersService {
  @InjectModel(User.name) private userModel: Model<UserDocument>;

  async create(createUserDto: CreateUserDto) {
    const newUser = await this.userModel.create({
      name: createUserDto.name,
      email: createUserDto.email,
      password: createUserDto.password,
      age: +createUserDto.age,
      gender: createUserDto.gender,
      address: createUserDto.address,
    });

    return {
      _id: newUser._id,
      createdAt: newUser.createdAt,
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
      { new: true } // Trả về bản ghi sau khi đã cập nhật
    );
  }
}
