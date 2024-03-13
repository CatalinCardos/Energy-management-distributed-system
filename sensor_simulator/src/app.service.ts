import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { EnergyDto } from './dtos/energy.dto';

@Injectable()
export class AppService {
  constructor(@Inject('sensor_server') private readonly client: ClientProxy){
    
  }

  createEnergy(energy: EnergyDto) {
    console.log("Message sent");
    this.client.emit('create-energy', energy);
  }
}
