import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { EstimateService } from './estimate.service';

export interface IEstimatePayload {
  customer_id: string;
  origin: string;
  destination: string;
}

@Controller('/ride/estimate')
export class EstimateController {
  constructor(private readonly estimateService: EstimateService) {}

  @Post()
  @HttpCode(200)
  postEstimate(@Body() payload: IEstimatePayload): any {
    return this.estimateService.postEstimate(payload);
  }
}
