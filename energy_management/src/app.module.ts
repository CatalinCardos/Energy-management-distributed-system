import { Module } from '@nestjs/common';
import { EnergyModule } from './energy/energy.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { DeviceModule } from './device/device.module';
import { AlertModule } from './websocket/alert.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), EnergyModule, DeviceModule, AlertModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
