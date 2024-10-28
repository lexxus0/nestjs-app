import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { User, UserSchema } from './user.schema';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
