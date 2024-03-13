import { User } from '../entities/user.entity';
import { UserRole } from '../enums/user.enum';

export class DataAdminUserDto {

    id: number;
    username: string;
    password: string;
    role: UserRole;
  
}

export function DataAdminUserDtoFromUser(user: User) {
    const userDto: DataAdminUserDto = {
        id: user.id,
        username: user.username,
        password: user.password,
        role: user.role,
    };
    return userDto;
}