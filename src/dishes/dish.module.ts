import { Module } from '@nestjs/common';
import { DishService } from './dish.service';
import { DishController } from './dish.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dish } from './entities/dish.entity';
import { VendorService } from 'src/vendor/vendor.service';
import { Vendor } from 'src/vendor/entities/vendor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Dish, Vendor])],
  controllers: [DishController],
  providers: [DishService, VendorService],
})
export class DishModule {}
