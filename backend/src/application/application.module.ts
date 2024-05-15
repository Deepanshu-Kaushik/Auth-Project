import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from 'src/typeorm/entities/application';
import { ApplicationController } from './application.controller';
import { ApplicationService } from './application.service';
import { User } from 'src/typeorm/entities/user';
import { Auth } from 'src/typeorm/entities/auth';

@Module({
  imports: [TypeOrmModule.forFeature([Application, User, Auth])],
  controllers: [ApplicationController],
  providers: [ApplicationService],
})
export class ApplicationModule {}
