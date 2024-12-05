import { Module } from '@nestjs/common';
import { MattingService } from './matting.service';
import { MattingController } from './matting.controller';

@Module({
  imports: [],
  controllers: [MattingController],
  providers: [MattingService],
})
export class MattingModule {}
