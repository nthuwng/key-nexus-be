import {
  PermissionAction,
  PermissionModule,
} from './../../common/constants/permission.constant';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  Permissions,
  Public,
  ResponseMessage,
  User,
} from 'src/decorator/customize';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ResponseMessage('Tạo người dùng thành công')
  @Permissions(`${PermissionModule.USERS}.${PermissionAction.CREATE}`)
  create(@Body() createUserDto: CreateUserDto, @User() user: any) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ResponseMessage('Lấy danh sách người dùng thành công')
  @Permissions(`${PermissionModule.USERS}.${PermissionAction.VIEW}`)
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.usersService.findAll(currentPage, limit, qs);
  }

  @Get(':id')
  @ResponseMessage(`Fetch user by id`)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @Permissions(`${PermissionModule.USERS}.${PermissionAction.DELETE}`)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
