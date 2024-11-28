import { Module } from '@nestjs/common';
import { EstimateController } from './estimate.controller';
import { EstimateService } from './estimate.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [EstimateController],
  providers: [EstimateService, PrismaService],
})
export class EstimateModule {}
