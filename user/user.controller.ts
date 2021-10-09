import { Injectable, Controller, Get, Post, Put, Delete, Body, Res, Req } from '@nestjs/common';
import { Request, Response  } from 'express';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/user-dtos/create-user.dto';
import { UpdateUserDto } from './dtos/user-dtos/update-user.dto';
import { DeleteUserDto } from './dtos/user-dtos/delete-user.dto';

@Injectable()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  
  @Get()
  async fetchAllUser() {
    return this.userService.fetchAllUser();
  }
  
  @Post()
  async createUser (
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response,
    @Req() req: Request
  ) {
    const cookie = req.cookies[process.env.REFRESH_TOKEN];
    const pieUserPayload = await this.userService.verifyJWT(cookie);
    const result = await this.userService.createUser(
      createUserDto,
      pieUserPayload
    )

    if (result.hasOwnProperty('code')) return res.status(409).send(result);
    return res.status(201).send(result);
  }

  @Put()
  async updateUser (
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: Response,
    @Req() req: Request
  ) {
    const cookie = req.cookies[process.env.REFRESH_TOKEN];
    const pieUserPayload = await this.userService.verifyJWT(cookie);
      
    const result = await this.userService.updateUser(
      updateUserDto,
      pieUserPayload
    );

    if (result.hasOwnProperty('code')) return res.status(409).send(result);
    return res.status(200).send(result);
  }

  @Delete()
  async deleteUser (
    @Body() deleteUserDto: DeleteUserDto
  ) {
    return this.userService.deleteUser(deleteUserDto);
  }
}
  