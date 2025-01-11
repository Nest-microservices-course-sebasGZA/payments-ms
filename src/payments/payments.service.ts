import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import Stripe from 'stripe';

import { envs } from '../config/envs';
import { CreatePaymentSessionDto } from './dtos/create-payment-session.dto';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private readonly stripe = new Stripe(envs.stripeKey);

  async createPaymentSession({
    orderId,
    currency,
    items,
  }: CreatePaymentSessionDto) {
    const lineIems = items.map(({ name, quantity, price }) => ({
      price_data: {
        currency,
        product_data: {
          name,
        },
        unit_amount: Math.round(price * 100),
      },
      quantity,
    }));
    const session = await this.stripe.checkout.sessions.create({
      payment_intent_data: {
        metadata: {
          orderId,
        },
      },
      line_items: lineIems,
      mode: 'payment',
      success_url: envs.stripeSuccessUrl,
      cancel_url: envs.stripeCancelUrl,
    });

    return session;
  }

  async stripeWebhook(req: Request, res: Response) {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = envs.stripeEndpointSecret;
    try {
      const event: Stripe.Event = this.stripe.webhooks.constructEvent(
        req['rawBody'],
        sig,
        endpointSecret,
      );

      switch (event.type) {
        case 'charge.succeeded':
          const chargeSucceeded = event.data.object;
          console.log({
            metadata: chargeSucceeded.metadata,
            orderId: chargeSucceeded.metadata.orderId,
          });
          break;

        default:
          this.logger.log(`Event ${event.type} not handled`);
      }
      return res.status(HttpStatus.CREATED).json({
        sig,
      });
    } catch (error) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .send(`Webhook error: ${error.message}`);
      return;
    }
  }
}
