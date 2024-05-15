import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/user';
import { Repository } from 'typeorm';
import { CreateUserParams } from 'src/utils/user.params';
import { Application } from 'src/typeorm/entities/application';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Application)
    private appRepository: Repository<Application>,
  ) {}

  async getUser(email: string, password: string): Promise<User | null> {
    try {
      const user = await this.userRepository.findOne({
        where: { email: email },
      });
      if (user && (await this.comparePasswords(password, user.password))) {
        user.active = true;
        const newuser = await this.userRepository.save(user);
        return newuser; // can be optimized to give user.id
      } else {
        return null;
      }
    } catch (error) {
      console.log('[user.service.ts]: getUser error ');
    }
  }

  async createUser(signupDetails: CreateUserParams) {
    try {
      // logic to check if same email id already exists or not.
      const userexists = this.checkEmail(signupDetails.email);

      if (userexists) {
        const hashedPassword = await this.hashPassword(signupDetails.password);

        const newUser = this.userRepository.create({
          // ...signupDetails,
          name: signupDetails.name,
          email: signupDetails.email,
          password: hashedPassword,
          admin: 'Admin123',
          twofa: 'NA',
          active: false,
          passotp: '3456',
          passexp: '12000',
        });

        return this.userRepository.save(newUser);
      }
    } catch (error) {
      console.log('[user.service.ts]: createUser error ');
    }
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10); // 10 = salt
  }

  async comparePasswords(
    enteredPassword: string,
    storedPasswordHash: string,
  ): Promise<boolean> {
    return bcrypt.compare(enteredPassword, storedPasswordHash);
  }

  async checkUser(userid: any): Promise<boolean> {
    const user = this.userRepository.findOne({
      where: {
        id: userid,
      },
    });
    return !!user;
  }

  async checkEmail(emailid: string): Promise<boolean> {
    const user = this.userRepository.findOne({
      where: {
        email: emailid,
      },
    });
    return !!user;
  }

  async getDashboard(userid: number) {
    // process.env.TZ
    const user = await this.userRepository.findOne({
      where: {
        id: userid,
      },
      relations: {
        apps: true,
      },
    });
    return user;
  }

  async getUserByIdThenLogout(userid: number): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: {
          id: userid,
        },
      });
      if (user) {
        user.active = false;
        const newuser = await this.userRepository.save(user);
        return newuser;
      }
      throw Error;
    } catch (error) {
      console.log('user.service.ts:  getUserByIdThenLogout error');
      return error;
    }
  }
}
