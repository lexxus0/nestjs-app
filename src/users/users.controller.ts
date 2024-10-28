import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseFilters,
  HttpException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.schema';
import { HttpExceptionFilter } from 'src/http-exception.filter';
import { ValidateObjectIdPipe } from 'src/pipes/validate-object-id.pipe';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
@UseFilters(HttpExceptionFilter)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<User[]> {
    const users = await this.usersService.findAll();
    if (users.length === 0) throw new HttpException('Users not found', 404);
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ValidateObjectIdPipe) id: string): Promise<User> {
    const user = await this.usersService.findOne(id);
    if (user === null) throw new HttpException('User not found', 404);
    return user;
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Patch(':id')
  async update(
    @Param('id', ValidateObjectIdPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.usersService.update(id, updateUserDto);
    if (user === null) throw new HttpException('User not found', 404);
    return user;
  }

  @Delete(':id')
  async delete(@Param('id', ValidateObjectIdPipe) id: string): Promise<any> {
    return this.usersService.delete(id);
  }
}
