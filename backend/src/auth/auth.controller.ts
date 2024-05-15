import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';

import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { CodeDto } from './dto/createCode.dto';
import { CodeParam } from 'src/utils/token.params';
import { TokenDto } from './dto/createToken.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('validuser')
  async checkValidUser(@Req() req: Request, @Res() res: Response) {
    try {
      const userid = Number(req.cookies['userid']);
      if (userid) {
        const uservalid = await this.authService.checkValidUser(userid);
        res.status(200).json({ message: 'passed', user: uservalid });
      } else throw new Error('no accesstoken');
    } catch (error) {
      console.log('[auth.cont.ts]: checktokenvalid', error);
      res.status(400).json({ message: 'failed' });
    }
  }

  @Post('authorize') //handles callback url
  async handleAuthCode(
    @Body() codeDto: CodeDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const app_id = await this.authService.verifyClient(codeDto.client_id);
      if (app_id) {
        const tokenObj: CodeParam = {
          client_id: codeDto.client_id,
          scope: codeDto.scope,
          callback_url: codeDto.callback_url,
          appid: Number(app_id),
          userid: codeDto.userid,
        };

        const code = this.authService.createCode(tokenObj, tokenObj.client_id);
        res.status(200).json({ code: code });
      } else {
        res.status(401).json({ message: 'failed' });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'internal error' });
    }
  }

  @Post('token') // handles input code to give token
  async handleAccessToken(@Body() tokenDto: TokenDto, @Res() res: Response) {
    try {
      const verify_secret = await this.authService.verifyClientSecret(
        tokenDto.client_id,
        tokenDto.client_secret,
      );

      if (verify_secret) {
        const code: CodeParam = this.authService.decodeCode(
          tokenDto.code,
          tokenDto.client_id,
        );

        const valid = this.authService.checkValid(code.userid, code.appid);

        if (valid) {
          const tokenjwt = await this.authService.getToken(
            code.userid,
            code.appid,
            code.scope,
            tokenDto.client_secret,
          );

          if (tokenjwt) {
            // const cookieName = 'access_token';

            res.status(200).json({
              access_token: tokenjwt,
              message: 'success',
            });
          }
        } else {
          console.log('verify secret failed');
          res.status(401).json({
            access_token: true,
            message: 'failed',
          });
        }
      }
    } catch (error) {
      console.log('controller failed', error);
      res.status(400).json({
        access_token: true,
        message: 'internal error',
      });
    }
  }

  @Get('authpage')
  async getAuthPage(@Req() req: Request, @Res() res: Response) {
    try {
      const clientid = `${req.query.clientid}`;
      const userid = Number(req.query.userid);

      const data = await this.authService.getAuthPage(clientid, userid);
      res.status(200).json(data);
    } catch (error) {
      res.status(401).json({ message: 'getAuth didnt respond' });
    }
  }
}
