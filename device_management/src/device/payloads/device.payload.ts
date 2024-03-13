import { IsNotEmpty, IsOptional } from 'class-validator';
import { Device } from '../entities/device.entity';

export class DevicePayload {

    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    address: string;

    @IsNotEmpty()
    energyConsumption: number;

    @IsOptional()
    userId: number;
}