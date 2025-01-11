import { IsNumber, IsPositive, IsString } from 'class-validator';

export class PaymentSessionItemsDto {
  @IsString()
  name: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsNumber()
  @IsPositive()
  quantity: number;
}
