import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Energy } from './entities/energy.entity';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { EnergyPayload } from './payloads/energy.payload';
import { Device } from 'src/device/entities/device.entity';
import { io } from 'socket.io-client';

const socket = io("http://localhost:3003");

@Injectable()
export class EnergyService {
  constructor(
    @InjectRepository(Energy)
    private energyRepository: Repository<Energy>,
    @InjectRepository(Device)
    private deviceRepository: Repository<Device>,
  ) {}

  async create(energyPayload: EnergyPayload): Promise<Energy> {
    const newEnergy : Energy = this.energyRepository.create({
      consumption: energyPayload.consumption,
      timestamp: energyPayload.timestamp,
    });

    const device = await this.deviceRepository.findOne({
      where: { idDevice: energyPayload.deviceId },
    });

    if (!device) {
      throw new HttpException('Energy not found', HttpStatus.NOT_FOUND);
    }

    newEnergy.device = device;
    const responseEnergy: Energy = await this.energyRepository.save(newEnergy);

    await this.handleEnergyEvent(responseEnergy);

    return responseEnergy;
  }

  async findAll(id: number): Promise<Energy[]> {
    const energy = await this.energyRepository.find({
      where: {
        device: {
          idDevice: id,
        },
      },
      relations: ['device'],
    });

    if (!energy) {
      throw new HttpException('Energy not found', HttpStatus.NOT_FOUND);
    }

    //compute consumption for each hour
    energy.forEach((energy) => {
      const date = new Date(energy.timestamp);
      energy.timestamp = new Date(
        Date.UTC(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          date.getHours(),
          0,
          0,
        ),
      );
    });

    const energyForOneHour: Energy[] = energy.reduce((acc : Energy[], curr) => {
      const found = acc.findIndex(
        (element) => element.timestamp.getTime() === curr.timestamp.getTime() && element.timestamp.getTimezoneOffset() === curr.timestamp.getTimezoneOffset(),
      );
      
      if (found === -1) {
        return acc.concat([curr]);
      } else {
        
        acc[found].consumption += curr.consumption;
        return acc;
      }
    }
    , []);

    return energyForOneHour;
  }

  async findOne(id: number): Promise<Energy> {
    const energy = await this.energyRepository.findOne({
      where: { id },
      relations: ['device'],
    });

    if (!energy) {
      throw new HttpException('Energy not found', HttpStatus.NOT_FOUND);
    }

    return energy;
  }

  async remove(id: number) {
    return await this.energyRepository.delete(id);
  }

  public async getConsumptionForOneHour(idDevice: number, date: Date) {
    const dateCopy = new Date(date);
  
    dateCopy.setHours(dateCopy.getHours() - 1);

    const allConsumption: Energy[] = await this.energyRepository.find({
      where: { device: { idDevice: idDevice }},
    });

    const consumptionForOneHour: number = allConsumption.reduce((acc, curr) => {

      const dateCurr = new Date(curr.timestamp);
      dateCurr.setHours(dateCurr.getHours() + 2);

      if (dateCurr <= date && dateCurr >= dateCopy) {
        return acc + curr.consumption;
      }
      return acc;
    }, 0);

    
    if (allConsumption) {
      return consumptionForOneHour;
    }
  }

  public async handleEnergyEvent(energy: Energy) {
    const date = new Date(energy.timestamp);
    date.setHours(date.getHours() + 2);
    energy.timestamp = date;

    const hourlyConsumption: number = await this.getConsumptionForOneHour(energy.device.idDevice, energy.timestamp);
    const device = await this.deviceRepository.findOne({ where: { idDevice: energy.device.idDevice} });

    console.log('device:', device);
    console.log('hourlyConsumption', hourlyConsumption);
    if (hourlyConsumption > device.maximumConsumption) {
      socket.emit('alert', {
        deviceId: energy.device.idDevice,
        hourlyConsumption: hourlyConsumption,
      });
    }
  }

}
