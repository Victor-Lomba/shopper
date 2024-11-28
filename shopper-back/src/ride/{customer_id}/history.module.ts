import { Module } from '@nestjs/common';
import { HistoryController } from './history.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { HistoryService } from './history.service';

@Module({
  controllers: [HistoryController],
  providers: [HistoryService, PrismaService],
})
export class HistoryModule {}
