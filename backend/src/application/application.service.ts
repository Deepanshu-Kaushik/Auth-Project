import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Application } from 'src/typeorm/entities/application';
import { Auth } from 'src/typeorm/entities/auth';
import { User } from 'src/typeorm/entities/user';
import { CreateAppParams } from 'src/utils/app.params';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
  ) {}

  findApplications() {
    return this.applicationRepository.find();
  }

  async findApplicationById(appid: any) {
    const appdata = await this.applicationRepository.findOne({
      where: {
        id: appid,
      },
    });
    return appdata;
  }

  async createApplication(userid: any, appDetails: CreateAppParams) {
    try {
      const newApp = this.applicationRepository.create({
        ...appDetails,
        client_id: uuid(),
        client_secret: uuid(),
      });

      const user = await this.userRepository.findOne({
        where: { id: userid },
      });

      newApp.user = user;
      const app = await this.applicationRepository.save(newApp);

      console.log('check3');
      console.log(app);

      return app; //might need changes
    } catch (error) {
      console.log('[app.service.ts]: createapp error');
    }
  }

  async editApplication(appid: any, appDetails: CreateAppParams) {
    try {
      const appdata = await this.applicationRepository.findOne({
        where: {
          id: appid,
        },
      });
      Object.assign(appdata, appDetails);

      return this.applicationRepository.save(appdata);
    } catch (error) {
      console.log('[app service.ts] edit app error');
    }
  }

  maskSecret(secret: any) {
    if (typeof secret !== 'string' || secret.length < 4) {
      return secret; // return unchanged if input is not a string or is too short
    }

    // Replace characters from index 4 to end with '*'
    return secret.substring(0, 4) + '*'.repeat(secret.length - 4);
  }

  async checkApp(appid: any): Promise<boolean> {
    const app = this.applicationRepository.findOne({
      where: {
        id: appid,
      },
    });
    return !!app;
  }

  async getAppsByUserId(userId: number) {
    try {
      const tokens = await this.authRepository.find({
        relations: {
          app: true,
        },
        where: {
          userId: userId,
        },
      });

      return tokens;
    } catch (error) {
      console.log(error);
    }
  }
}
