import { Body, Controller, Patch } from '@nestjs/common';
import { ConfirmService } from './confirm.service';

export interface IConfirmPayload {
  customer_id: string;
  origin: string;
  destination: string;
  distance: number;
  duration: string;
  driver: {
    id: number;
    name: string;
  };
  value: number;
}

@Controller('/ride/confirm')
export class ConfirmController {
  constructor(private readonly confirmService: ConfirmService) {}

  @Patch()
  patchConfirm(@Body() payload: IConfirmPayload): any {
    return this.confirmService.patchConfirm(payload);
  }
}
