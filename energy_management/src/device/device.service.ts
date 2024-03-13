import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { Device } from './entities/device.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { DevicePayload } from './payloads/device.payload';
import { Energy } from 'src/energy/entities/energy.entity';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(Device)
    private deviceRepository: Repository<Device>,
    @InjectRepository(Energy)
    private energyRepository: Repository<Energy>,
  ) {}

  async create(devicePayload: DevicePayload): Promise<Device> {
    const device = await this.deviceRepository.findOne({
      where: {
        idDevice: devicePayload.idDevice,
      },
    });
    if (device) {
      return device;
    }

    const newDevice = this.deviceRepository.create(devicePayload);
    if (!newDevice) {
      throw new HttpException('Device cannot be saved', HttpStatus.CONFLICT);
    }

    return this.deviceRepository.save(newDevice);
  }

  async findOne(id: number): Promise<Device> {
    const device = await this.deviceRepository.findOne({
      where: { idDevice: id },
    });
    if (!device) {
      throw new HttpException('Device not found', HttpStatus.NOT_FOUND);
    }
    return device;
  }

  async remove(id: number) {
    const device: Device = await this.deviceRepository.findOne({
      where: { idDevice: id },
    });
    if (!device) {
      throw new HttpException('Device not found', HttpStatus.NOT_FOUND);
    }

    const energy = await this.energyRepository.find({
      where: { device: device },
    });

    if (energy.length > 0) {
      await this.energyRepository.remove(energy);
    }

    return await this.deviceRepository.remove(device);
  }
}
