import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/user';
import { Application } from 'src/typeorm/entities/application';
import { Auth } from 'src/typeorm/entities/auth';

@Module({
  imports: [TypeOrmModule.forFeature([User, Application, Auth])],
  controllers: [UserController],
  providers: [UserService]
})

export class UserModule {}
