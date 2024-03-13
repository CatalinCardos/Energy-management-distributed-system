import { Module } from '@nestjs/common';
import { DeviceService } from './device.service';
import { DeviceController } from './device.controller';
import { Device } from './entities/device.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Energy } from 'src/energy/entities/energy.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/common/app.constants';

@Module({
  imports: [TypeOrmModule.forFeature([Device, Energy]),
  JwtModule.register({
    global: true,
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '1d' },
  })],
  controllers: [DeviceController],
  providers: [DeviceService],
})
export class DeviceModule {}
