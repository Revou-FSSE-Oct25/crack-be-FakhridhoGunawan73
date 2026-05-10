import { Controller, Body, Post, Req, UseGuards, Get, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';

@Controller('bookings')
export class BookingsController {
    constructor(private bookingsService: BookingsService) {}

    @UseGuards(JwtGuard)
    @Post()
    createBooking(@Req() req, @Body() dto: CreateBookingDto) {
        return this.bookingsService.createBooking(req.user.sub, dto);
    }

    @UseGuards(JwtGuard, RolesGuard)
    @Roles('ADMIN','OWNER')
    @Get()
    getBookings(@Req() req) {
        return this.bookingsService.getBookings(req.user);
    }

    @UseGuards(JwtGuard, RolesGuard)
    @Roles('ADMIN', 'OWNER')
    @Patch( ':id/status')
    updateBookingStatus(@Param('id', ParseIntPipe) id: number, @Req() req, @Body() dto: UpdateBookingStatusDto) {
        return this.bookingsService.updateBookingStatus(id, req.user, dto);
    }
}
