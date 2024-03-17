import { Controller, Get, Res } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get('/')
  home(@Res() res) {
    res.send('Welcome to foodit backend api');
  }
}
