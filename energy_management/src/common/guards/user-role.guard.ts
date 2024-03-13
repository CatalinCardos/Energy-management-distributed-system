import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { UserRole } from '../enums/user.enum';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor() {}

    async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {

    const request = context.switchToHttp().getRequest();
    const userRole = request['user'].role;

    return userRole === UserRole.ADMIN;
  }
}
