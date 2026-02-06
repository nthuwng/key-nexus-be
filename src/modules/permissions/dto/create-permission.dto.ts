import { IsNotEmpty } from 'class-validator';

export class CreatePermissionDto {
  @IsNotEmpty({ message: 'Key không được để trống' })
  key: string;

  @IsNotEmpty({ message: 'method không được để trống' })
  method: string;

  @IsNotEmpty({ message: 'module không được để trống' })
  module: string;

  @IsNotEmpty({ message: 'description không được để trống' })
  description: string;
}
