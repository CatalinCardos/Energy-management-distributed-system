import { IsDate, IsDateString, IsNotEmpty } from 'class-validator';

export class EnergyPayload {
  @IsNotEmpty()
  consumption: number;

  @IsNotEmpty()
  @IsDateString()
  timestamp: Date;

  @IsNotEmpty()
  deviceId: number;
}
