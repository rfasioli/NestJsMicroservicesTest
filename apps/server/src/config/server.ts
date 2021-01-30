
import { ClassSerializerInterceptor, INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from '../app/app.module';
export class Server {

  private app: INestApplication;

  public async bootstrap(): Promise<Server> {
    this.app = await NestFactory.create<INestApplication>(AppModule, {
      logger: process.env.NODE_ENV === 'production' ? ['log', 'warn', 'error'] : ['debug', 'error', 'log', 'warn', 'verbose']
    });

    this.middlewares();
    await this.app.startAllMicroservicesAsync();
    return this;
  }

  private middlewares(): void {
    this.app.useGlobalPipes(new ValidationPipe({ transform: true }));
    this.app.useGlobalInterceptors(new ClassSerializerInterceptor(this.app.get(Reflector)));

    this.app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://admin:mypass@localhost:5672/test'],
        queue: 'test_queue',
        queueOptions: {
          durable: true,
        }
      }
    });
  }

  public shutdown(): void {
    this.app?.close();
  }

}