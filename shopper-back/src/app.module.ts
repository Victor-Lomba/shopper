import { Module } from '@nestjs/common';
import { EstimateModule } from './ride/estimate/estimate.module';
import { HistoryModule } from './ride/{customer_id}/history.module';
import { ConfigModule } from '@nestjs/config';
import { ConfirmModule } from './ride/confirm/confirm.module';

@Module({
  imports: [
    HistoryModule,
    ConfirmModule,
    EstimateModule,
    ConfigModule.forRoot(),
  ],
})
export class AppModule {}
