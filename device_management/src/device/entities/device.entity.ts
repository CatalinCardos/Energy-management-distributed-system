import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Device {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    description: string;

    @Column()
    address: string;

    @Column()
    energyConsumption: number;

    @ManyToOne(() => User, (user) => user.deviceList)
    user: User;
    
}
