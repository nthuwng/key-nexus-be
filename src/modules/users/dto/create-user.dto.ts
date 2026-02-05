import { IsEmail, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import mongoose from 'mongoose';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Họ tên không được để trống' })
  fullName: string;

  @IsEmail({ message: 'Email không hợp lệ' })
  email: string;

  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  password: string;

  @IsString({ message: 'Giới tính phải là một chuỗi' })
  gender: string;

  @IsString({ message: 'Số điện thoại phải là một chuỗi' })
  phone?: string;

  @IsNotEmpty({ message: 'Role ID không được để trống' })
  @IsMongoId({ message: 'Role phải là một MongoId hợp lệ' })
  role: mongoose.Schema.Types.ObjectId;
}

export class RegisterUserDto {
  @IsNotEmpty({ message: 'Họ tên không được để trống' })
  fullName: string;

  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  password: string;

  @IsString()
  gender: string;

  @IsString()
  phone?: string;
}

export class LoginDto {
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @IsNotEmpty()
  password: string;
}
