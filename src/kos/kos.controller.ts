import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards, } from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { KosService } from './kos.service';
import { CreateKosDto } from './dto/create-kos.dto';
import { UpdateKosDto } from './dto/update-kos.dto';

@Controller('kos')
export class KosController {
  constructor(private readonly kosService: KosService) {}

  @Post()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.OWNER, Role.ADMIN)
  create(@Body() dto: CreateKosDto, @Req() req: any) {
    return this.kosService.create(dto, req.user.sub);
  }

  @Get()
  findAll() {
    return this.kosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.kosService.findOne(Number(id));
  }

  @Patch(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.OWNER, Role.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateKosDto, @Req() req: any) {
    return this.kosService.update(Number(id), dto, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.OWNER, Role.ADMIN)
  delete(@Param('id') id: string, @Req() req: any) {
    return this.kosService.delete(Number(id), req.user);
  }
}