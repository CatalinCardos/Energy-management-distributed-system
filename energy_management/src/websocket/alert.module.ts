import { Module } from "@nestjs/common";
import { AlertGateway } from "./alert.gateway";

@Module({
    providers: [AlertGateway]
  })
  
  export class AlertModule {}