import { HttpStatus, Injectable } from '@nestjs/common';
import { envs } from 'src/config/envs';
import Stripe from 'stripe';
import { CreatePaymentSessionDto } from './dtos/create-payment-session.dto';
import { Request, Response } from 'express';

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(envs.STRIPE_KEY);

  async createPaymentSession({ currency, items }: CreatePaymentSessionDto) {
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
        metadata: {},
      },
      line_items: lineIems,
      mode: 'payment',
      success_url: 'http://localhost:3003/payments/success',
      cancel_url: 'http://localhost:3003/payments/cancel',
    });

    return session;
  }

  async stripeWebhook(req: Request, res: Response) {
    const sig = req.headers['stripe-signature'];
    return res.status(HttpStatus.OK).json({
      sig,
    });
  }
}
