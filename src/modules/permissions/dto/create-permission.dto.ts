import { IsNotEmpty } from 'class-validator';

export class CreatePermissionDto {
  @IsNotEmpty({ message: 'Key không được để trống' })
  key: string;

  @IsNotEmpty({ message: 'Key không được để trống' })
  description: string;
}
