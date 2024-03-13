import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { DeviceService } from './device.service';
import {
  CreateDeviceDto,
  CreateDeviceDtoFromDevice,
} from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { DevicePayload } from './payloads/device.payload';
import { EventPattern } from '@nestjs/microservices';
import { RolesGuard } from 'src/common/guards/user-role.guard';
import { AuthGuard } from 'src/common/guards/auth-guard';

@Controller('device')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @EventPattern('create_device')
  async createDevice(devicePayload: DevicePayload) {
    const device = await this.deviceService.create({
      idDevice: devicePayload.idDevice,
      maximumConsumption: devicePayload.maximumConsumption,
    } as DevicePayload);
    console.log('Device created: ' + device.idDevice);
  }

  @EventPattern('delete_device')
  async deleteDevice(id: number) {
    await this.deviceService.remove(id);
    console.log('Device deleted: ' + id);
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  async create(@Body() devicePayload: DevicePayload): Promise<CreateDeviceDto> {
    return CreateDeviceDtoFromDevice(await this.deviceService.create(devicePayload));
  }


  @Get(':id')
  @UseGuards(AuthGuard , RolesGuard)
  async findOne(@Param('id') id: string): Promise<CreateDeviceDto> {
    return CreateDeviceDtoFromDevice(await this.deviceService.findOne(+id));
  }


  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  async remove(@Param('id') id: string) {
    return await this.deviceService.remove(+id);
  }

}
