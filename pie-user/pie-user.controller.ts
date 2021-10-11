import {
  Injectable,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Res,
  Req
} from '@nestjs/common';
import { Request, Response } from 'express';
import { PieUserService } from './pie-user.service';
import { CreatePieUserDto } from './dtos/pie-user-dtos/create-pie-user.dto';
import { UpdatePieUserDto } from './dtos/pie-user-dtos/update-pie-user.dto';
import { DeletePieUserDto } from './dtos/pie-user-dtos/delete-pie-user.dto';

@Injectable()
@Controller('pieUser')
export class PieUserController {
  constructor(private readonly pieUserService: PieUserService) {}

  @Get()
  async fetchAllPieUser() {
    return this.pieUserService.fetchAllPieUser();
  }

  @Post()
  async createPieUser(
    @Body() createPieUserDto: CreatePieUserDto,
    @Res() res: Response,
    @Req() req: Request
  ) {
    const cookie = req.cookies[process.env.REFRESH_TOKEN];
    const pieUserPayload = await this.pieUserService.verifyJWT(cookie);
    const result = await this.pieUserService.createPieUser(
      createPieUserDto,
      pieUserPayload
    );

    if (result.hasOwnProperty('code')) return res.status(409).send(result);
    return res.status(201).send(result);
  }

  @Put()
  async updatePieUser(
    @Body() updatePieUserDto: UpdatePieUserDto,
    @Res() res: Response,
    @Req() req: Request
  ) {
    const cookie = req.cookies[process.env.REFRESH_TOKEN];
    const pieUserPayload = await this.pieUserService.verifyJWT(cookie);

    const result = await this.pieUserService.updatePieUser(
      updatePieUserDto,
      pieUserPayload
    );

    if (result.hasOwnProperty('code')) return res.status(409).send(result);
    return res.status(200).send(result);
  }

  @Delete()
  async deletePieUser(@Body() deletePieUserDto: DeletePieUserDto) {
    return this.pieUserService.deletePieUser(deletePieUserDto);
  }
}
