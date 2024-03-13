import { Energy } from 'src/energy/entities/energy.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Device {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  idDevice: number;

  @Column()
  maximumConsumption: number;

  @OneToMany(() => Energy, (energy) => energy.device)
  energyList: Energy[];
}
