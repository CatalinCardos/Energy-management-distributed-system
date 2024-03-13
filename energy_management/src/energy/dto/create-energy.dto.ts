import { Energy } from '../entities/energy.entity';

export class CreateEnergyDto {
  consumption: number;

  timestamp: Date;

  device: number;
}

export function CreateEnergyDtoFromEnergy(energy: Energy): CreateEnergyDto {
  const energyDto: CreateEnergyDto = {
    consumption: energy.consumption,
    timestamp: energy.timestamp,
    device: energy.device.id,
  };
  return energyDto;
}
