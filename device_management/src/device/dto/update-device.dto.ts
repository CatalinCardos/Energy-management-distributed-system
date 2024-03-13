import { PartialType } from '@nestjs/mapped-types';
import { DevicePayload } from '../payloads/device.payload';

export class UpdateDeviceDto extends PartialType(DevicePayload) {
    
}
