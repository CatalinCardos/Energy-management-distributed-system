import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, CreateUserDtoFromUser } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Public } from 'src/common/app.constants';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/common/guards/user-role.guard';


@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(RolesGuard)
  async create(@Body() createUserDto: CreateUserDto): Promise<CreateUserDto> {
    const user: User = await this.userService.create(createUserDto);
    return CreateUserDtoFromUser(user);
  }

  @Get()
  @UseGuards(RolesGuard)
  async findAll(): Promise<CreateUserDto[]> {
    const user: User[] = await this.userService.findAll();
    return user.map(user => CreateUserDtoFromUser(user));
  }

  @Get(':idUser')
  @UseGuards(RolesGuard)
  async findOne(@Param('idUser') idUser: string): Promise<number> {
    const user: User = await this.userService.findOne(+idUser);
    return user.id;
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  async remove(@Param('id') id: string) {
    return await this.userService.remove(+id);
  }
}
