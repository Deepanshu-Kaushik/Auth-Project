import { Body, Controller, Get, Patch, Post, Req, Res } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { CreateAppDto } from './dto/createApp.dto';
import { Request, Response } from 'express';

@Controller('application')
export class ApplicationController {
  constructor(private applicationService: ApplicationService) {}

  @Get('/getAll')
  getApplication() {
    return this.applicationService.findApplications();
  }

  @Get('/getAppById')
  async getApplicationById(@Req() req: Request, @Res() res: Response) {
    try {
      const appid = req.query.appid;
      const appdata = await this.applicationService.findApplicationById(appid);
      appdata.client_secret = this.applicationService.maskSecret(
        appdata.client_secret,
      );
      if (appdata) res.status(200).json(appdata);
      else res.status(401).json({ message: 'app not found' });
    } catch (error) {
      console.log('[app controller] get app by id error');
      res.status(500).json({ message: 'internal error' });
    }
  }

  @Get('/displaySecret')
  async displaySecret(@Req() req: Request, @Res() res: Response) {
    try {
      const appid = req.query.appid;
      const appdata = await this.applicationService.findApplicationById(appid);

      if (appdata) res.status(200).json(appdata);
      else res.status(401).json({ message: 'app not found' });
    } catch (error) {
      console.log('[app controller] get app by id error');
      res.status(500).json({ message: 'internal error' });
    }
  }

  @Post('/create')
  async createApplication(
    @Body() createAppDto: CreateAppDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const userid = req.query.userid;
      if (userid) {
        const createdApp = await this.applicationService.createApplication(
          userid,
          createAppDto,
        );
        res.status(200).json({
          status: 1,
          appid: createdApp.id,
        });
      }
      res.status(401).json({
        status: 1,
        message: 'userid not mentioned',
      });
    } catch (error) {
      console.log('[application.controller.ts]: createApp error');
      res.status(500).json({
        status: 1,
        message: 'Internal error',
      });
    }
  }

  @Patch('/edit')
  async editApplication(
    @Body() createAppDto: CreateAppDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const appid = req.query.appid;
      if (this.applicationService.checkApp(appid)) {
        //not optimized in terms of calls to database
        const editapp = await this.applicationService.editApplication(
          appid,
          createAppDto,
        );
        res.status(200).json(editapp);
      } else {
        res.status(401).json({ message: 'app not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal server error ' });
      console.log('[app controller] edit app error');
    }
  }

  @Get('/loggedInApps')
  async getLoggedInApps(@Req() req: Request, @Res() res: Response) {
    try {
      const userid = Number(req.query.userid);
      const apps = await this.applicationService.getAppsByUserId(userid);
      if (apps) res.status(200).json(apps);
      else res.status(401).json({ message: 'app not found' });
    } catch (error) {
      res.status(500).json({ message: `Internal server error ${error}` });
      console.log('[app controller] edit app error');
    }
  }
}
