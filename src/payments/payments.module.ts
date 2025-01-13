import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { envs } from '../config/envs';
import { NATS_SERVICE } from '../config/services';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: NATS_SERVICE,
        transport: Transport.NATS,
        options: {
          servers: envs.natsServers,
        },
      },
    ]),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
