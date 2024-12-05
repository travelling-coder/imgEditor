import { Injectable } from '@nestjs/common';

@Injectable()
export class MattingService {
  execMatting(): string {
    return 'Matting...';
  }
}
