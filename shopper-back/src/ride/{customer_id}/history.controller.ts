import { Param, Query, Controller, Get } from '@nestjs/common';
import { HistoryService } from './history.service';

export interface IHistoryPayload {
  customer_id: string;
}

@Controller('/ride')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get('/:customer_id')
  getHistoryById(
    @Query('driver_id') driver_id,
    @Param('customer_id') customer_id,
  ) {
    return this.historyService.getHistoryById(customer_id, driver_id);
  }
}
