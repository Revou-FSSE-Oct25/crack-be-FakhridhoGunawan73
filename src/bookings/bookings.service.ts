import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingStatus } from '@prisma/client';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';

@Injectable()
export class BookingsService {
    constructor(private prisma: PrismaService) {}

    async createBooking(userId: number, dto: CreateBookingDto) {
        const room = await this.prisma.room.findUnique({
            where: { id: dto.roomId},
        });

        if (!room) {
            throw new NotFoundException('Room not Found');
        }

        const startDate = new Date(dto.startDate);
        const endDate = new Date(dto.endDate);

        if (endDate <= startDate) {
            throw new BadRequestException('End date must be after start date');
        }

        const existingBooking = await this.prisma.booking.findFirst({
            where: {
                userId,
                roomId: dto.roomId,
                status: {
                    in: ['PENDING', 'APPROVED'],
                },
            },
        });

        if (existingBooking) {
            throw new BadRequestException('You already have an active booking for this room');
        }

        return this.prisma.booking.create({
            data: {
                userId,
                roomId: dto.roomId,
                startDate,
                endDate,
                notes: dto.notes,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                    }
                },
                room: {
                    include: {
                        kos: true,
                    }
                }
            },
        });
    }

    async getBookings(user: any) {
        
        if (user.role === 'ADMIN') {
            return this.prisma.booking.findMany({
                orderBy: {
                    createdAt: 'desc',
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            role: true,
                        },
                    },
                    room: {
                        include: {
                            kos: true,
                        },
                    },
                },
            });
        }

        if (user.role === 'OWNER') {
            return this.prisma.booking.findMany({
                where: {
                    room: {
                        kos: {
                            ownerId: user.sub,
                        },
                    },
                },              
                orderBy: {
                    createdAt: 'desc',
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            role: true,
                        },
                    },
                    room: {
                        include: {
                            kos: true,
                        },
                    },
                },
            });
        }
        return [];
    }

    async updateBookingStatus( bookingId: number,user: any, dto: UpdateBookingStatusDto ) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
            include: {
                room: {
                    include: {
                        kos: true,
                    },
                },
            },
        });

        if (!booking) {
            throw new NotFoundException('Booking not found');
        }

        if (user.role === 'OWNER' && booking.room.kos.ownerId !== user.sub) {
            throw new ForbiddenException('You can only update booking for your own kos');
        }

        if (dto.status !== BookingStatus.APPROVED && dto.status !== BookingStatus.REJECTED) {
            throw new BadRequestException('Status can only be APPROVED or REJECTED');
        }

        if (booking.status !== BookingStatus.PENDING) {
            throw new BadRequestException('Only Pending booking can be updated');
        }

        return this.prisma.booking.update({
            where: { id: bookingId },
            data: {
                status: dto.status,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                    },
                },
                room: {
                    include: {
                        kos: true,
                    },
                },
            },
        });
    }

    async getMyBookings(userId: number) {
        return this.prisma.booking.findMany({
            where: {
                userId,
            },
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                room: {
                    include: {
                        kos: true,
                    },
                },
            },
        });
    }
}
