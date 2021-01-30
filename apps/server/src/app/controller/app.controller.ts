import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';

@Controller()
export class AppController {

  private logger: Logger = new Logger('AppController');

  @EventPattern('notification')
  async handleNotification(@Payload() data: any, @Ctx() context: RmqContext): Promise<void> {
    this.logger.log(`Pattern: ${context.getPattern()}`);
    this.logger.log(JSON.stringify(data));
  }

  @MessagePattern('print')
  async handlePrint(@Payload() data: any, @Ctx() context: RmqContext): Promise<any> {
    this.logger.log(`Pattern: ${context.getPattern()}`);
    return data;
  }

  @EventPattern('from-java')
  async handleFromJava(@Payload() data: any, @Ctx() context: RmqContext): Promise<void> {
    this.logger.log(`Pattern: ${context.getPattern()}`);
    this.logger.log(JSON.stringify(data));
  }

}
