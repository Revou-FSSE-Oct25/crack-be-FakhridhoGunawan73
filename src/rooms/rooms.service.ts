import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRoomDto} from './dto/create-room.dto'; 
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomsService {
    constructor(private prisma: PrismaService) {}

    async create(dto: CreateRoomDto, user: any) {
        const kos = await this.prisma.kos.findUnique({
            where: { id: dto.kosId },
        });

        if (!kos) {
            throw new NotFoundException('Kos not found');
        }

        if (user.role !== 'ADMIN' && kos.ownerId !== user.sub) {
            throw new ForbiddenException('You can only add room to your own kos');
        }

        return this.prisma.room.create({
            data: {
                kosId: dto.kosId,
                roomNumber: dto.roomNumber,
                type: dto.type,
                price: dto.price,
                capacity: dto.capacity,
                facilities: dto.facilities,
                imageUrl: dto.imageUrl,
                isAvailable: dto.isAvailable,
            },
        });
    }

    findAll(query: { minPrice?: string; maxPrice?: string; capacity?: string; isAvailable?: string; }) {
        const { minPrice, maxPrice, capacity, isAvailable } = query;

        const min = minPrice ? Number(minPrice) : undefined;
        const max = maxPrice ? Number(maxPrice) : undefined;
        const roomCapacity = capacity ? Number(capacity) : undefined;

        return this.prisma.room.findMany({
            where: {
                ...(!Number.isNaN(min) || !Number.isNaN(max)? {
                    price: {
                        ...(min !== undefined && !Number.isNaN(min) && { gte: min}),
                        ...(max !== undefined && !Number.isNaN(max) && { lte: max}),
                    },
                }
            : {}),
                ...(roomCapacity !== undefined &&
                    !Number.isNaN(roomCapacity) && {
                    capacity: roomCapacity,
                }),

                ...(isAvailable === 'true' || isAvailable === 'false'? {
                    isAvailable: isAvailable === 'true',
                }
            : {}),
            },
            include: {
                kos: true,
            },
        });
    }

    findOne(id: number) {
        return this.prisma.room.findUnique({
            where: {id},
            include: {
                kos: true,
                bookings: true,
            },
        });
    }

    async update(id: number, dto: UpdateRoomDto, user: any) {
        const room = await this.prisma.room.findUnique({
            where: { id },
            include: { kos: true},
        });

        if (!room) {
            throw new NotFoundException('Room not found');
        }

        if (user.role !== 'ADMIN' && room.kos.ownerId !== user.sub) {
            throw new ForbiddenException('You can only update your own room');
        }

        return this.prisma.room.update({
            where: { id },
            data: dto,
        });
    }

    async remove(id: number, user: any) {
        const room = await this.prisma.room.findUnique({
            where: { id },
            include: { kos:true },
        });

        if (!room) {
            throw new NotFoundException('Room not found');
        }

        if (user.role !== 'ADMIN' && room.kos.ownerId !== user.sub) {
            throw new ForbiddenException('You can only delete your own room')
        }

        return this.prisma.room.delete({
            where: { id },
        });
    }
}
