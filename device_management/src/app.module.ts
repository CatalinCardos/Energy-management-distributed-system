import { Module } from '@nestjs/common';
import { DeviceModule } from './device/device.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { UserModule } from './user/user.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), DeviceModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
