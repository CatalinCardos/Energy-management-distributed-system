import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, CreateUserDtoFromUser } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { DataUserDto, DataUserDtoFromUser } from './dto/get-user.dto';
import { UserPayload } from './payloads/user.payload';
import { DataAdminUserDto, DataAdminUserDtoFromUser } from './dto/get-user-admin.dto';
import { Request } from 'express';
import { Public } from './users.constants';
import { RolesGuard } from './guards/user-role.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<DataUserDto> {
    const userCreated: User = await this.usersService.create(createUserDto);
    return DataUserDtoFromUser(userCreated);
  }

  @Public()
  @Post('login')
  async login(@Body() userPayload: UserPayload): Promise<{token: string}> {
    const token: string = await this.usersService.login(userPayload);

    return {token: token};
  }


  @Get('me')
  async me(
    @Req() request: Request
  ): Promise<DataUserDto> {
    const token: string = request.headers.authorization?.split(' ')[1];
    const user: User = await this.usersService.findOne(request['user'].sub);
    return DataUserDtoFromUser(user);
  }

  @Get()
  @UseGuards(RolesGuard)
  async findAll(): Promise<DataAdminUserDto[]> {
    const users : User[] = await this.usersService.findAll();
    return users.map(user => DataAdminUserDtoFromUser(user));
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  async findOne(@Param('id') id: string): Promise<DataUserDto> {
    const user: User = await this.usersService.findOne(+id);
    const userDto: DataUserDto = DataUserDtoFromUser(user);
    return userDto;
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  async remove(@Param('id') id: string) {
    return await this.usersService.remove(+id);
  }
}
