import { User } from '../entities/user.entity';
import { IsNotEmpty, IsOptional, Length } from 'class-validator';
import { UserRole } from '../enums/user.enum';

export class CreateUserDto {

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  role: UserRole;
  
}

export function CreateUserDtoFromUser(user: User): CreateUserDto {
  const userDto: CreateUserDto = {
    username: user.username,
    password: user.password,
    role: user.role,
  };
  return userDto;
}

