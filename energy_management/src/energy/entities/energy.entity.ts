import { Device } from 'src/device/entities/device.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Energy {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('double')
  consumption: number;

  @Column()
  timestamp: Date;

  @ManyToOne((type) => Device, (device) => device.energyList)
  device: Device;
}
