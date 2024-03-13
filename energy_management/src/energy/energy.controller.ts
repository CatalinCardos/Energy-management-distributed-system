import {
  Controller,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { EnergyService } from './energy.service';
import {
  CreateEnergyDto,
  CreateEnergyDtoFromEnergy,
} from './dto/create-energy.dto';
import { EnergyPayload } from './payloads/energy.payload';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { EventPattern } from '@nestjs/microservices';
import { RolesGuard } from 'src/common/guards/user-role.guard';
import { AuthGuard } from 'src/common/guards/auth-guard';

require('dotenv').config();

@Controller('energy')
export class EnergyController {
  constructor(private readonly energyService: EnergyService) {}

  @EventPattern('create-energy')
  async createEnergy(energyPayload: EnergyPayload) {
    const energy = await this.energyService.create(energyPayload)
    console.log(energy)
  }

  @Get('/byDevice/:id')
  @UseGuards(AuthGuard)
  async findOne(@Param('id') id: string) : Promise<CreateEnergyDto[]> {
    const energies = await this.energyService.findAll(+id);
    return energies.map((energy) => CreateEnergyDtoFromEnergy(energy));
  }


}
