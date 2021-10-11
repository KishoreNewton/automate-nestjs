import { Injectable, Controller, Get, Post, Put, Delete, Body, Res, Req } from '@nestjs/common';
import { Request, Response  } from 'express';
import { UserHereService } from './user-here.service';
import { CreateUserHereDto } from './dtos/user-here-dtos/create-user-here.dto';
import { UpdateUserHereDto } from './dtos/user-here-dtos/update-user-here.dto';
import { DeleteUserHereDto } from './dtos/user-here-dtos/delete-user-here.dto';

@Injectable()
@Controller('userHere')
export class UserHereController {
  constructor(private readonly userHereService: UserHereService) {}
  
  @Get()
  async fetchAllUserHere() {
    return this.userHereService.fetchAllUserHere();
  }
  
  @Post()
  async createUserHere (
    @Body() createUserHereDto: CreateUserHereDto,
    @Res() res: Response,
    @Req() req: Request
  ) {
    const cookie = req.cookies[process.env.REFRESH_TOKEN];
    const pieUserPayload = await this.userHereService.verifyJWT(cookie);
    const result = await this.userHereService.createUserHere(
      createUserHereDto,
      pieUserPayload
    )

    if (result.hasOwnProperty('code')) return res.status(409).send(result);
    return res.status(201).send(result);
  }

  @Put()
  async updateUserHere (
    @Body() updateUserHereDto: UpdateUserHereDto,
    @Res() res: Response,
    @Req() req: Request
  ) {
    const cookie = req.cookies[process.env.REFRESH_TOKEN];
    const pieUserPayload = await this.userHereService.verifyJWT(cookie);
      
    const result = await this.userHereService.updateUserHere(
      updateUserHereDto,
      pieUserPayload
    );

    if (result.hasOwnProperty('code')) return res.status(409).send(result);
    return res.status(200).send(result);
  }

  @Delete()
  async deleteUserHere (
    @Body() deleteUserHereDto: DeleteUserHereDto
  ) {
    return this.userHereService.deleteUserHere(deleteUserHereDto);
  }
}
  