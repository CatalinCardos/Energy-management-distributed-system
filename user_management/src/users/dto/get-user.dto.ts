import { User } from '../entities/user.entity';
import { UserRole } from '../enums/user.enum';

export class DataUserDto {

    id: number;
    username: string;
    role: UserRole;
  
}

export function DataUserDtoFromUser(user: User) {
    const userDto: DataUserDto = {
        id: user.id,
        username: user.username,
        role: user.role,
    };
    return userDto;
}