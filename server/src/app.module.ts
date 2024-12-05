import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MattingModule } from './matting/matting.module';

@Module({
  imports: [MattingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
