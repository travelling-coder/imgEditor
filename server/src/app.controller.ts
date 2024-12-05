import { Body, Controller, Get, HttpException, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test')
  test1(): string {
    throw new HttpException('Forbidden', 403);
  }

  @Post()
  test(@Body() data: any): any {
    console.log(data); // 打印请求体内容
    return { result: 'ok' };
  }
}
