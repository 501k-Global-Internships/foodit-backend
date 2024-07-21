import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VendorService } from 'src/vendor/vendor.service';
import { Menu } from './entities/menu.entity';
import { DishService } from 'src/dishes/dish.service';
import { DatabaseExceptionFilter } from 'src/shared/database-error-filter';

@Injectable()
export class MenuService {
  private logger: Logger;
  constructor(
    @InjectRepository(Menu) private menusRepository: Repository<Menu>,
    private readonly vendorService: VendorService,
    private readonly dishesService: DishService,
  ) {
    this.logger = new Logger(MenuService.name);
  }
  async createMenu(
    vendorId: number,
    createMenuDto: CreateMenuDto,
  ): Promise<Menu> {
    const vendor = await this.vendorService.getVendor(vendorId);
    const menu = this.menusRepository.create(createMenuDto);
    menu.vendor = vendor;
    menu.dishes = await Promise.all(
      createMenuDto.dishIds.map((dishId) => this.dishesService.getDish(dishId)),
    );
    try {
      // const savedMenu = await this.menusRepository.save(menu);
      return this.menusRepository.save(menu);

      // return savedDish.DishResponseObject();
    } catch (error) {
      throw new DatabaseExceptionFilter('Error creating menu');
    }
  }

  async getAllMenus(): Promise<Menu[]> {
    console.log('............................................');
    this.logger.warn('Hereeeeeeeeeeeeeeeeeeeee');
    const menus = await this.menusRepository.find({ relations: ['dishes'] }); // Return Response in descending Order
    console.log(menus);
    return menus;
  }

  async getMenu(id: number): Promise<Menu> {
    const menu = await this.menusRepository.findOne({
      where: { id },
      relations: ['dishes'],
    });
    if (!menu) throw new NotFoundException(`Menu with id ${id} not found`);
    return menu;
  }

  async updateMenu(id: number, updateMenuDto: UpdateMenuDto): Promise<Menu> {
    const menu = await this.getMenu(id);
    Object.assign(menu, updateMenuDto);
    if (updateMenuDto.dishIds) {
      menu.dishes = await Promise.all(
        updateMenuDto.dishIds.map((id) => this.dishesService.getDish(id)),
      );
    }

    try {
      return this.menusRepository.save(menu);
    } catch (error) {
      throw new DatabaseExceptionFilter(error);
    }
  }

  async deleteMenu(id: number): Promise<string> {
    await this.menusRepository.delete({ id });
    return `Menu with the id ${id} deleted successfully`;
  }

  async toggleAvailability(id: number): Promise<Menu> {
    const menu = await this.getMenu(id);
    menu.isAvailable = !menu.isAvailable;
    try {
      return this.menusRepository.save(menu);
    } catch (error) {
      throw new DatabaseExceptionFilter(error);
    }
  }
}
