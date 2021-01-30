import { Inject, Module } from '@nestjs/common';
import { ClientProxy, ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './controller/app.controller';
@Module({
  imports: [
    ClientsModule.register([{
      name: 'CLIENT_PROXY',
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://admin:mypass@localhost:5672/test'],
        queue: 'test_queue',
        queueOptions: {
          durable: false
        }
      }
    }])
  ],
  controllers: [AppController],
  providers: [],
  exports: []
})
export class AppModule {

  constructor(
    @Inject('CLIENT_PROXY') private readonly client: ClientProxy
  ) { }

  async onApplicationBootstrap() {
    await this.client.connect();
  }

}
