import { Injectable } from '@nestjs/common';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device } from './entities/device.entity';
import { DevicePayload } from './payloads/device.payload';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(Device)
    private deviceRepository : Repository<Device>,
    ) {}

  async create(devicePayload: DevicePayload): Promise<Device> {
    return await this.deviceRepository.save({
      ...devicePayload,
      user: {
        id: devicePayload.userId || null
      }
    });
  }

  async findAll(): Promise<Device[]> {
    return await this.deviceRepository.find({
      relations: ['user']
    });
  }

  async findOne(id: number): Promise<Device> {
    return await this.deviceRepository.findOne({
      where: { id }, 
      relations: ['user']
    });
  }

  async findDevicesByUser(userId: number): Promise<Device[]> {
    return await this.deviceRepository.find({
      where: { user: {
        idUser: userId
      }}, 
      relations: ['user']
    });
  }

  async update(id: number, updateDeviceDto: UpdateDeviceDto) {
    return await this.deviceRepository.update(id, 
      {
        description: updateDeviceDto.description,
        address: updateDeviceDto.address,
        energyConsumption: updateDeviceDto.energyConsumption,
        user: {
          id: updateDeviceDto.userId || null
        }
      }); 
  }

  async remove(id: number) {
    await this.deviceRepository.delete(id);
  }
}


