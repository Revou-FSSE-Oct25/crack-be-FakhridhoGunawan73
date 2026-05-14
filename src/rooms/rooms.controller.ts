import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.OWNER, Role.ADMIN)
  create(@Body() dto: CreateRoomDto, @Req() req: any) {
    return this.roomsService.create(dto, req.user);
  }

  @Get()
  findAll(@Query() query: { minPrice?: string;maxPrice?: string;capacity?: string; isAvailable: string; }) {
    return this.roomsService.findAll(query);
  }

  @Get('kos/:kosId')
  findByKos(@Param('kosId') kosId: string) {
    return this.roomsService.findByKos(Number(kosId));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomsService.findOne(Number(id));
  }

  @Patch(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.OWNER, Role.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateRoomDto, @Req() req: any) {
    return this.roomsService.update(Number(id), dto, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.OWNER, Role.ADMIN)
  remove(@Param('id') id: string, @Req() req: any) {
    return this.roomsService.remove(Number(id), req.user);
  }
}