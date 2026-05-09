import { Controller, Body, Post, Req, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtGuard } from './guards/jwt.guard';
import { Roles } from './decorators/roles.decorator';
import { RolesGuard } from './guards/roles.guard';
import { Role } from '@prisma/client';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    register(@Body() dto: RegisterDto){
        return this.authService.register(dto);
    }

    @Post('login')
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }

    @Get('profile')
    @UseGuards(JwtGuard)
    profile(@Req() req: any) {
        return {
            message: 'Profile accesssed successfully',
            user: req ['user'],
        };
    }

    @Get('owner-test')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(Role.OWNER, Role.ADMIN)
    ownerTest() {
        return {
            message: 'Only OWNER or ADMIN can accsess this route',
        };
    } 
}

