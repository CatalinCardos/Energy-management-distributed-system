import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  UseGuards,
} from '@nestjs/common';
import { DeviceService } from './device.service';
import {
  CreateDeviceDto,
  CreateDeviceDtoFromDevice,
} from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { Device } from './entities/device.entity';
import { DevicePayload } from './payloads/device.payload';
import { ClientProxy } from '@nestjs/microservices';
import { RolesGuard } from 'src/common/guards/user-role.guard';
import { User } from 'src/user/entities/user.entity';
import { AuthGuard } from 'src/common/guards/auth-guard';

@Controller('devices')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService,
    @Inject('DEVICE_SERVICE') private readonly client: ClientProxy
    ) {}

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  async findAll(): Promise<CreateDeviceDto[]> {
    const devices: Device[] = await this.deviceService.findAll();
    return devices.map((device) => CreateDeviceDtoFromDevice(device));
  }
  
  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  async create(@Body() devicePayload: DevicePayload): Promise<CreateDeviceDto> {
    const device: Device = await this.deviceService.create(devicePayload);
    this.client.emit('create_device', {idDevice: device.id, maximumConsumption: device.energyConsumption});
    return CreateDeviceDtoFromDevice(device);
  }

  @Get('user/:id')
  @UseGuards(AuthGuard)
  async findDevicesByUser(@Param('id') id: string): Promise<CreateDeviceDto[]> {
    const devices: Device[] = await this.deviceService.findDevicesByUser(+id);
    return devices.map((device) => CreateDeviceDtoFromDevice(device));
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  async findOne(@Param('id') id: string): Promise<CreateDeviceDto> {
    const devie: Device = await this.deviceService.findOne(+id);
    return CreateDeviceDtoFromDevice(devie);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  async update(
    @Param('id') id: string,
    @Body() updateDeviceDto: UpdateDeviceDto,
  ) {
    console.log(updateDeviceDto);
    return await this.deviceService.update(+id, updateDeviceDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  async remove(@Param('id') id: string) {
    this.client.emit('delete_device', id);
    await this.deviceService.remove(+id);
  }
}
