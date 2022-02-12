import { Controller, Get, Post, Body, Param, HttpCode } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  home(): string {
    return this.appService.home();
  }

  @Get('/link/:token')
  @HttpCode(200)
  GetLink(@Param() params: { token: string }) {
    const url = this.appService.getLink(params.token);

    return url;
  }

  @Post('/link')
  @HttpCode(200)
  postLink(@Body() body: { url: string }): {
    status: string;
    code: number;
    data: { url: string; token: string };
  } {
    const { token, url } = this.appService.postLink(body.url);

    return {
      status: 'success',
      code: 200,
      data: {
        token,
        url,
      },
    };
  }
}
