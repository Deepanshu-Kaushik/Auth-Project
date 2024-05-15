import { Module } from '@nestjs/common';
import { ApidataController } from './apidata.controller';
import { ApidataService } from './apidata.service';

@Module({
  controllers: [ApidataController],
  providers: [ApidataService]
})
export class ApidataModule {}
