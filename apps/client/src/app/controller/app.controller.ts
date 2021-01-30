import { Controller, Get, HttpStatus, Inject, Res } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Response } from 'express';

@Controller()
export class AppController {

  constructor(@Inject('CLIENT_PROXY') private readonly client: ClientProxy) { }

  @Get('/notification')
  emit(@Res() res: Response): void {
    this.client.emit<any>('notification', { text: 'Hello World' });
    res.status(HttpStatus.OK).send('Message sent to test_queue');
  }

  @Get('/print')
  send(@Res() res: Response): void {
    this.client.send('print', { text: 'Hello World' })
      .subscribe((response: any) => {
        res.status(HttpStatus.OK).send(`Message received from test_queue ${response.text}`);
      });
  }

}
