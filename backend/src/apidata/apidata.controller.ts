import { Body, Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ApidataGuard } from './apidata.guard';

@Controller('apidata')
export class ApidataController {
  @Get('testapi')
  @UseGuards(ApidataGuard)
  async getTest(
    // @Body() createAppDto: CreateAppDto,
    // @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
        
        res.status(200).json({message: 'Success - Acl implemented through routes'})
    } catch (error) {
        res.status(401).json({message: 'Failed'})
    }
  }
}
