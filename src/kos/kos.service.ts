import { Injectable, ForbiddenException, NotAcceptableException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateKosDto } from './dto/create-kos.dto';
import { UpdateKosDto } from './dto/update-kos.dto';

@Injectable()
export class KosService {
    constructor(private prisma: PrismaService) {}

    create(dto: CreateKosDto, ownerId: number) {
        return this.prisma.kos.create({
            data: {
                name: dto.name,
                address: dto.address,
                city: dto.city,
                description: dto.description,
                ownerId,
            },
        });
    }

    findAll(query: { name?: string; city?: string}) {
        const { name, city } = query;

        return this.prisma.kos.findMany({
            where: {
                ...(name && {
                    name: {
                        contains: name,
                        mode: 'insensitive',
                    },
                }),
                ...(city && {
                    city: {
                        contains: city,
                        mode: 'insensitive',
                    },
                }),
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                rooms: true,
            },
        });
    }

    findOne(id: number) {
        return this.prisma.kos.findUnique({
            where: { id },
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                rooms: true,
            },
        });
    }
    
    async update(id: number, dto: UpdateKosDto, user: any) {
        const kos = await this.prisma.kos.findUnique({
            where: { id },
        });
        if (!kos) {
            throw new NotAcceptableException('Kos not found');
        }
    
        if (user.role !== 'ADMIN' && kos.ownerId !== user.sub) {
            throw new ForbiddenException('You can only update your own kos');
        }
    
        return this.prisma.kos.update({
            where: { id },
            data: dto,
        });
    }

    async delete(id: number, user: any) {
        const kos = await this.prisma.kos.findUnique({
            where: { id },
        });

        if (!kos) {
            throw new NotAcceptableException('Kos not found');
        }

        if (user.role !== 'ADMIN' && kos.ownerId !== user.sub) {
            throw new ForbiddenException('You can only delete your own kos');
        }

        return this.prisma.kos.delete({
            where: { id },
        });
    }
}
