import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { KosModule } from './kos/kos.module';
import { RoomsModule } from './rooms/rooms.module';
import { BookingsModule } from './bookings/bookings.module';

@Module({
  imports: [PrismaModule, AuthModule, KosModule, RoomsModule, BookingsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
