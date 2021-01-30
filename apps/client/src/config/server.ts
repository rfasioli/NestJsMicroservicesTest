
import { ClassSerializerInterceptor, INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from '../app/app.module';
export class Server {

  private app: INestApplication;

  public async bootstrap(): Promise<Server> {
    this.app = await NestFactory.create<INestApplication>(AppModule, {
      logger: process.env.NODE_ENV === 'production' ? ['log', 'warn', 'error'] : ['debug', 'error', 'log', 'warn', 'verbose']
    });

    this.middlewares();
    const PORT = 3000;
    await this.app.listen(PORT);
    return this;
  }

  private middlewares(): void {
    this.app.useGlobalPipes(new ValidationPipe({ transform: true }));
    this.app.useGlobalInterceptors(new ClassSerializerInterceptor(this.app.get(Reflector)));

    this.app.enableCors();
  }

  public shutdown(): void {
    this.app?.close();
  }

}