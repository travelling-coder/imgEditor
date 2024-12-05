import { Controller, Get } from '@nestjs/common';
import { MattingService } from './matting.service';

@Controller('/matting')
export class MattingController {
  constructor(private readonly mattingService: MattingService) {}

  @Get()
  execMatting(): string {
    return this.mattingService.execMatting();
  }
}
