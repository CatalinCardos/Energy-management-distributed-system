import { IsNotEmpty } from 'class-validator';

export class DevicePayload {
  @IsNotEmpty()
  idDevice: number;

  @IsNotEmpty()
  maximumConsumption: number;
}
