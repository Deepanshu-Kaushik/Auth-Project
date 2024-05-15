import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from 'src/typeorm/entities/application';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Auth } from 'src/typeorm/entities/auth';
import { User } from 'src/typeorm/entities/user';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: '123',
      signOptions: { expiresIn: '1h' }, // Set token expiration time
    }),
    TypeOrmModule.forFeature([Auth, Application, User]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
