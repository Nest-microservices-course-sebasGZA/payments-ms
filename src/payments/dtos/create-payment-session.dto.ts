import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsString,
  ValidateNested,
} from 'class-validator';

import { PaymentSessionItemsDto } from './payment-session-items.dto';

export class CreatePaymentSessionDto {
  @IsString()
  currency: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PaymentSessionItemsDto)
  items: PaymentSessionItemsDto[];
}
