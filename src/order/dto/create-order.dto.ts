import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  vendorId: number;

  @IsArray()
  @IsNumber({}, { each: true })
  dishIds: number[];
}
