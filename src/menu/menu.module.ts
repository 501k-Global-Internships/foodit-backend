import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { DishService } from 'src/dishes/dish.service';
import { VendorService } from 'src/vendor/vendor.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu } from './entities/menu.entity';
import { Vendor } from 'src/vendor/entities/vendor.entity';
import { Dish } from 'src/dishes/entities/dish.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Menu, Vendor, Dish])],
  controllers: [MenuController],
  providers: [MenuService, DishService, VendorService],
})
export class MenuModule {}
