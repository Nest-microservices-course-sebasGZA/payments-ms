import { Body, Controller, Get, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentSessionDto } from './dtos/create-payment-session.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-payment-session')
  createPaymentSession(
    @Body() createPaymentSessionDto: CreatePaymentSessionDto,
  ) {
    return this.paymentsService.createPaymentSession(createPaymentSessionDto);
  }

  @Get('success')
  success() {
    return {
      ok: true,
      message: 'Payment successful',
    };
  }

  @Get('cancel')
  cancel() {
    return {
      ok: false,
      message: 'Payment cancelled',
    };
  }

  @Post('webhook')
  async stripeWebhook() {
    return 'stipe webhook';
  }
}
