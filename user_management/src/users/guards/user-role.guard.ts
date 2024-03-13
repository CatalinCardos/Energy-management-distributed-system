import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UsersService } from '../users.service';
import { request } from 'http';
import { User } from '../entities/user.entity';
import { UserRole } from '../enums/user.enum';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly userService: UsersService) {}

    async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {

    const request = context.switchToHttp().getRequest();

    const userId = request['user'].sub;
    const user: User = await this.userService.findOne(userId);

    return user.role === UserRole.ADMIN;
  }
}
