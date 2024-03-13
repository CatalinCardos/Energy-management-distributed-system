import { IsEmail, IsNotEmpty, IsOptional, Length } from 'class-validator';
import { Device } from '../entities/device.entity';

export class CreateDeviceDto {

    id: number; 

    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    address: string;

    @IsNotEmpty()
    energyConsumption: number;

    @IsOptional()
    userId: number;
}

export function CreateDeviceDtoFromDevice(device: Device): CreateDeviceDto {
    const deviceDto: CreateDeviceDto = {
        id: device.id,
        description: device.description,
        address: device.address,
        energyConsumption: device.energyConsumption,
        userId: (device.user ? device.user.idUser : null)
    };
    return deviceDto;
}

