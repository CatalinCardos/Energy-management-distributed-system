import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  const app1 = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [
          process.env.RABBITMQ_URL,
        ],
        queue: 'device_queue',
        queueOptions: {
          durable: false,
        },
      },
    },
  );

  const app2 = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [
          process.env.RABBITMQ_URL_ENERGY,
        ],
        queue: 'energy_queue',
        queueOptions: {
          durable: false,
        },
      },
    },
  );

  await app.listen(3003).then(await app1.listen().then(await app2.listen())).then(() => console.log('Microservice are listening'));
}
bootstrap();
