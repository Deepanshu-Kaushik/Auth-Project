import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Application } from 'src/typeorm/entities/application';
import { Auth } from 'src/typeorm/entities/auth';
import { User } from 'src/typeorm/entities/user';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { CodeParam } from 'src/utils/token.params';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  private readonly JWT_SECRET = '123';

  constructor(
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,

    private jwtService: JwtService,
  ) {}

  async verifyClient(client_id: string) {
    const app = await this.applicationRepository.findOne({
      where: { client_id: client_id },
    });
    return app?.id;
  }

  async verifyClientSecret(
    client_id: any,
    client_secret: any,
  ): Promise<boolean> {
    const app = await this.applicationRepository.findOne({
      where: { client_id: client_id },
    });

    if (app && app.client_secret == client_secret) return true;

    return false;
  }

  decodeCode(token: string, jwtSecret: string): any {
    try {
      const decoded = jwt.verify(token, jwtSecret);
      return decoded;
    } catch (error) {
      console.log(
        '[auth.service.ts]: decodeCode :wrong jwt or secret not found',
      );
    }
  }

  createCode(token: CodeParam | object, client_id: string) {
    try {
      if (token) {
        const code = jwt.sign(token, client_id);
        return code;
      }
    } catch (error) {
      console.log(
        '[auth.service.ts]: createCode :wrong jwt or secret not found',
      );
    }
  }

  async getToken(
    user_id: number,
    app_id: number,
    scope: any,
    client_secret: string,
  ) {
    try {
      const existing_token = await this.authRepository.findOne({
        where: {
          userId: user_id,
          appId: app_id,
        },
      });

      if (existing_token) {
        await this.authRepository.remove(existing_token);
      }

      const token = uuid();
      const tokenjwt = this.createCode({ token: token }, client_secret);
      const new_token = this.authRepository.create({
        token: token,
        exp: 1200,
        iat: new Date(),
        jwt: tokenjwt,
      });

      // relations handling
      const app = await this.applicationRepository.findOne({
        where: { id: app_id },
      });
      new_token.app = app;

      const user = await this.userRepository.findOne({
        where: { id: user_id },
      });
      new_token.user = user;

      const saved_token = await this.authRepository.save(new_token);

      if (saved_token) return saved_token.jwt;
    } catch (error) {
      console.log('From the error block');
      return false;
    }
  }

  getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  async checkValid(userid: number, appid: number) {
    try {
      const token_exists = this.authRepository.findOne({
        where: { userId: userid, appId: appid },
      });
      if (token_exists) {
        return false;
      } else return true;
    } catch (error) {
      console.log('auth.service.ts: checkvalid error');
    }
  }

  async checkValidToken(accesstokenjwt: string) {
    try {
      const token = await this.authRepository.findOne({
        where: { jwt: accesstokenjwt },
      });
      // complete this
      if (token) return true;
      else return false;
    } catch (error) {
      console.log('auth.service.ts: checkvalidtoken error');
      return false;
    }
  }

  async checkValidUser(userid: number) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userid },
      });
      // complete this
      return user.active;
    } catch (error) {
      console.log('auth.service.ts: checkvaliduser error');
      return false;
    }
  }

  async getAuthPage(clientid: string, userid: number): Promise<object> {
    try {
      const app = await this.applicationRepository.findOne({
        where: { client_id: clientid },
      });

      const user = await this.userRepository.findOne({
        where: { id: userid },
      });

      const result = {
        userName: user.name,
        appName: app.name,
        redirectUrl: app.homepage_url,
      };

      return result;
    } catch (error) {
      console.log('auth.service.ts: getAuthPage error');
    }
  }
}
