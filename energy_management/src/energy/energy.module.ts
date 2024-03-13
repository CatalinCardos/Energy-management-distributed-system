import { Module } from '@nestjs/common';
import { EnergyService } from './energy.service';
import { EnergyController } from './energy.controller';
import { Energy } from './entities/energy.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from 'src/device/entities/device.entity';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/common/app.constants';

require('dotenv').config();

@Module({
  imports: [TypeOrmModule.forFeature([Energy, Device]),
    RabbitMQModule.forRoot(RabbitMQModule, {
      uri: process.env.RABBITMQ_URL_ENERGY,
    }),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    })],
  controllers: [EnergyController],
  providers: [EnergyService],
})
export class EnergyModule {}
