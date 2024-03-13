import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device } from 'src/device/entities/device.entity';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Device)
    private deviceRepository : Repository<Device>,
    @InjectRepository(User)
    private userRepository : Repository<User>,
  ){}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return await this.userRepository.save(createUserDto);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(idUser: number): Promise<User> {
    return await this.userRepository.findOne({ where: { 
      idUser
     } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.userRepository.update(id, updateUserDto);
  }

  async remove(id: number) {
    const devices: Device[] = await this.deviceRepository.find({
      relations: ['user'],
    });
    const devicesToDelete: Device[] = devices.filter(device => device.user?.idUser === id);
    await this.deviceRepository.remove(devicesToDelete);
    await this.userRepository.delete({idUser: id});
  }
}