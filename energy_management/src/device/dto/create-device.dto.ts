import { Device } from '../entities/device.entity';

export class CreateDeviceDto {
  idDevice: number;
}

export function CreateDeviceDtoFromDevice(device: Device): CreateDeviceDto {
  return {
    idDevice: device.idDevice,
  };
}
