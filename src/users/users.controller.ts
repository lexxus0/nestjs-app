import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Patch,
  UseFilters,
  HttpException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.schema';
import { HttpExceptionFilter } from 'src/http-exception.filter';

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

  @Get(':id') // validate id
  async findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Post()
  async create(@Body() user: User): Promise<User> {
    return this.usersService.create(user);
  }

  @Patch(':id')
  async update(@Param(':id') id: string, @Body() user: User): Promise<User> {
    return this.usersService.update(id, user);
  }

  @Delete(':id')
  async delete(@Param(':id') id: string): Promise<any> {
    return this.usersService.delete(id);
  }
}
