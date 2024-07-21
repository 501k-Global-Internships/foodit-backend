import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { DishCategory } from 'src/shared/constants';

export class CreateDishDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(DishCategory)
  category: DishCategory;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  eta: number;

  @IsBoolean()
  @IsOptional()
  isAvailable: boolean;
}
