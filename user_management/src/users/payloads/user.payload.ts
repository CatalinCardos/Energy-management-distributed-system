import {IsNotEmpty} from 'class-validator';

export class UserPayload {

    @IsNotEmpty()
    username: string;
  
    @IsNotEmpty()
    password: string;
} 