import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { DishService } from './dish.service';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';
import { ApiTags } from '@nestjs/swagger';
import { VendorAuthGuard } from 'src/userAuth/vendorGuards/vendor_jwt_at.guard';

@ApiTags('Dish')
@Controller('dish')
@UseGuards(VendorAuthGuard)
export class DishController {
  constructor(private readonly dishService: DishService) {}

  @Post(':vendorId')
  createDish(
    @Param('vendorId') vendorId: number,
    @Body() createDishDto: CreateDishDto,
  ) {
    return this.dishService.createDish(vendorId, createDishDto);
  }

  @Get()
  getAllDishes() {
    return this.dishService.getAllDishes();
  }

  @Get(':id')
  getDish(@Param('id') id: number) {
    return this.dishService.getDish(id);
  }

  @Patch(':id')
  updateDish(@Param('id') id: number, @Body() updateDishDto: UpdateDishDto) {
    return this.dishService.updateDish(id, updateDishDto);
  }

  @Delete(':id')
  deleteDish(@Param('id') id: string) {
    return this.dishService.deleteDish(+id);
  }

  @Patch(':id/toggle-availability')
  toggleAvailability(@Param('id') id: string) {
    return this.dishService.toggleAvailability(+id);
  }
}
