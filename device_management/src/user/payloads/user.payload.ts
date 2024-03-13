import { IsNotEmpty } from 'class-validator';

export class UserPayload {
    
    @IsNotEmpty()
    id: number;
}