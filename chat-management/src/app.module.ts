import { Module } from '@nestjs/common';
import { ChatModule } from './websocket/alert.module';

@Module({
  imports: [ChatModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
