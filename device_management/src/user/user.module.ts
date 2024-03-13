import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from 'src/device/entities/device.entity';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/common/guards/auth-guard';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/common/app.constants';

@Module({
  imports: [TypeOrmModule.forFeature([User, Device]),
  JwtModule.register({
    global: true,
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '1d' },
  })],
  controllers: [UserController],
  providers: [UserService,{
    provide: APP_GUARD,
    useClass: AuthGuard,
  }],
})
export class UserModule {}
