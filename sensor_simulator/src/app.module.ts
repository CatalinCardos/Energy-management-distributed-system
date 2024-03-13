import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
require('dotenv').config();

@Module({
  imports: [ClientsModule.register([
    {
      name: 'sensor_server',
      transport: Transport.RMQ,
      options: {
        urls: ["amqps://yyhagyhi:WDTRe6gu--EPOU7HEE1mD6mE3krUEykw@sparrow.rmq.cloudamqp.com/yyhagyhi"],
        queue: "energy_queue",
        queueOptions: {
          durable: false
        },
      },
    },
  ])],
  providers: [AppService],
})
export class AppModule {}
