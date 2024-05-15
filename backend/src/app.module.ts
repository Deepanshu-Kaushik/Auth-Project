import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ApplicationModule } from './application/application.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from './typeorm/entities/application';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { User } from './typeorm/entities/user';
import { Auth } from './typeorm/entities/auth';
import { ApidataModule } from './apidata/apidata.module';
import * as cookieParser from 'cookie-parser';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'jwtAuthBackend',
      entities: [Application, User, Auth],
      synchronize: true,
      // logging: true,
    }),
    ApplicationModule,
    AuthModule,
    UserModule,
    ApidataModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply cookie-parser middleware to all routes
    consumer.apply(cookieParser()).forRoutes('*');
  }
}
