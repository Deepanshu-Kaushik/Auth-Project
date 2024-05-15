import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { Request, Response } from 'express';
import { CreateUserDto } from './dto/createUser.dto';
import { LoginDto } from './dto/login.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  async handleLogin(@Body() loginDetails: LoginDto, @Res() res: Response) {
    try {
      const email: any = loginDetails.email;

      //apply bcrypt
      const password: any = loginDetails.password;
      const UserCookieName = process.env.UserCookieName;

      const get_user = await this.userService.getUser(email, password);

      if (get_user) {
        res
          .status(200)
          .cookie(UserCookieName, get_user.id, {
            httpOnly: true,
            domain: 'localhost',
          })
          .json({ message: 'login success', userid: get_user.id });
      } else {
        res.status(401).json({ message: 'wrong password' });
      }
    } catch (error) {
      console.log('[user.controller.ts]: handle login error');
      res.status(500).json({ message: 'internal error' });
    }
  }

  @Get('logout')
  async handleLogout(@Req() req: Request, @Res() res: Response) {
    try {
      const userid = req.cookies['userid'];
      if (!userid) throw new Error('id is not in cookie');
      console.log('user id in logout: ', userid);

      const user = await this.userService.getUserByIdThenLogout(Number(userid));
      res.clearCookie('userid').status(200).json(user);
    } catch (error) {
      res.status(203).json({ message: 'logout failed' });
    }
  }

  @Post('signup')
  async handleSignUp(@Body() signUpDto: CreateUserDto, @Res() res: Response) {
    try {
      console.log('Request Body:', signUpDto);

      const create_user = await this.userService.createUser(signUpDto);
      if (create_user) {
        res.status(200).json({ message: 'user created' });
      } else {
        res.status(401).json({ message: 'user already exists' }); //some other reasons as well
      }
    } catch (error) {
      console.log('[user.controller.ts]: handle signUp error');
      res.status(500).json({ message: 'Internal error' });
    }
  }

  @Get('dashboard')
  async getDashboard(@Req() req: Request, @Res() res: Response) {
    try {
      console.log('dashboard controller');

      const userid_temp = req.query.userid;
      const userid = !Number.isNaN(Number(userid_temp))
        ? Number(userid_temp)
        : undefined;
      if (userid === undefined) {
        throw new Error('nan');
      }
      if (this.userService.checkUser(userid)) {
        const appdata = await this.userService.getDashboard(Number(userid));
        res.status(200).json(appdata.apps);
      } else {
        res.status(401).json({ message: 'user does not exists' });
      }
    } catch (error) {
      console.log('[user.controller.ts]: dashboard error');
      res.status(500).json({ message: 'Internal error' });
    }
  }
}
