import { IsArray, IsMongoId, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class CreateRoleDto {
  @IsNotEmpty({ message: 'Tên vai trò không được để trống' })
  name: string;

  @IsArray({ message: 'permissions phải là một mảng' })
  @IsMongoId({
    each: true,
    message: 'Mỗi phần tử trong permissions phải là một ObjectId hợp lệ',
  })
  @IsNotEmpty({ message: 'permissions không được để trống' })
  permissions?: mongoose.Schema.Types.ObjectId[];
}
