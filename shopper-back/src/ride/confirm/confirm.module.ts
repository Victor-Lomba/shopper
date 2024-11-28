import { Module } from '@nestjs/common';
import { ConfirmController } from './confirm.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfirmService } from './confirm.service';

@Module({
  controllers: [ConfirmController],
  providers: [ConfirmService, PrismaService],
})
export class ConfirmModule {}
