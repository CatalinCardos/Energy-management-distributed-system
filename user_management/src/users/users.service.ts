import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserPayload } from './payloads/user.payload';
import axios from 'axios';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const userCreated: User = await this.usersRepository.save(createUserDto);
    return userCreated;
  }

  async login(userPayload: UserPayload): Promise<string> {
    const user: User =  await this.usersRepository.findOne({
      where :{
        username: userPayload.username,
        password: userPayload.password
      }
    });

    if(!user){
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, username: user.username, role: user.role};
    const token: string = await this.jwtService.signAsync(payload);

    await this.usersRepository.update(user.id, {
      token
    });

    return token;
  }


  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<User> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.usersRepository.update(id, updateUserDto);
  }

  async remove(id: number) {
    return await this.usersRepository.delete(id);
  }
}
