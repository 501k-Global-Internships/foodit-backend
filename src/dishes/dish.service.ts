import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Dish } from './entities/dish.entity';
import { Repository } from 'typeorm';
import { VendorService } from 'src/vendor/vendor.service';
import { DatabaseExceptionFilter } from 'src/shared/database-error-filter';
import { DishResponseDto } from './dto/dish-response.dto';

@Injectable()
export class DishService {
  constructor(
    @InjectRepository(Dish) private dishesRepository: Repository<Dish>,
    private readonly vendorService: VendorService,
  ) {}
  async createDish(
    vendorId: number,
    createDishDto: CreateDishDto,
  ): Promise<DishResponseDto> {
    const vendor = await this.vendorService.getVendor(vendorId);
    const dish = this.dishesRepository.create(createDishDto);
    dish.vendor = vendor;
    try {
      const savedDish = await this.dishesRepository.save(dish);

      return savedDish.DishResponseObject();
    } catch (error) {
      throw new DatabaseExceptionFilter('Error creating dish');
    }
  }

  getAllDishes(): Promise<Dish[]> {
    return this.dishesRepository.find(); // Return Response in descending Order
  }

  async getDish(id: number): Promise<Dish> {
    const dish = await this.dishesRepository.findOne({ where: { id } });
    if (!dish) throw new NotFoundException(`Dish with id ${id} not found`);
    return dish;
  }

  async updateDish(id: number, updateDishDto: UpdateDishDto): Promise<Dish> {
    const dish = await this.getDish(id);
    Object.assign(dish, updateDishDto);
    return this.dishesRepository.save(dish);
  }

  async deleteDish(id: number): Promise<string> {
    await this.dishesRepository.delete({ id });
    return `Dish with the id ${id} deleted successfully`;
  }

  async toggleAvailability(id: number): Promise<Dish> {
    const dish = await this.getDish(id);
    dish.isAvailable = !dish.isAvailable;
    return this.dishesRepository.save(dish);
  }
}
