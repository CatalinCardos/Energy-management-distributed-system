import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Device } from '../../device/entities/device.entity';

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    idUser: number;
    
    @OneToMany(() => Device, (device) => device.user)
    deviceList: Device[];

}