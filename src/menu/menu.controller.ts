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
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { VendorAuthGuard } from 'src/userAuth/vendorGuards/vendor_jwt_at.guard';
import { ApiTags } from '@nestjs/swagger';

ApiTags('Menu');
@Controller('vendor/menu')
@UseGuards(VendorAuthGuard)
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post(':vendorId')
  createDish(
    @Param('vendorId') vendorId: number,
    @Body() createMenuDto: CreateMenuDto,
  ) {
    return this.menuService.createMenu(vendorId, createMenuDto);
  }

  @Get()
  getAllMenus() {
    console.log('Hereeeeeeeeeeeeee');
    return this.menuService.getAllMenus();
  }

  @Get(':id')
  getMenu(@Param('id') id: number) {
    return this.menuService.getMenu(id);
  }

  @Patch(':id')
  updateMenu(@Param('id') id: number, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.updateMenu(id, updateMenuDto);
  }

  @Delete(':id')
  async deleteMenu(@Param('id') id: string) {
    await this.menuService.getMenu(+id);
    return this.menuService.deleteMenu(+id);
  }

  @Patch(':id/toggle-availability')
  toggleAvailability(@Param('id') id: number) {
    return this.menuService.toggleAvailability(id);
  }
}
