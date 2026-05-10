import { Module } from '@nestjs/common';
import { KosController } from './kos.controller';
import { KosService } from './kos.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [KosController],
  providers: [KosService],
})
export class KosModule {}
