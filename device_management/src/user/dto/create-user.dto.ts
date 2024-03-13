import { IsNotEmpty } from "class-validator";
import { User } from "../entities/user.entity";

export class CreateUserDto {

    @IsNotEmpty()
    idUser: number;

}

export function CreateUserDtoFromUser(user: User): CreateUserDto {
    const userDto: CreateUserDto = {
        idUser: user.idUser,
    };
    return userDto;
}

