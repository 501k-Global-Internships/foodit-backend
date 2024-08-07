import { DishCategory } from 'src/shared/constants';
import { Vendor } from 'src/vendor/entities/vendor.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DishResponseDto } from '../dto/dish-response.dto';
import { Menu } from 'src/menu/entities/menu.entity';
import { Order } from 'src/order/entities/order.entity';

@Entity()
export class Dish {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: DishCategory,
    default: DishCategory.African_Dishes,
  })
  category: DishCategory;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  eta: number;

  @Column({ default: true })
  isAvailable: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'datetime', nullable: true })
  updatedAt: Date;

  // @ManyToOne(() => Order, (order) => order.dishes)
  // order: Order;
  @ManyToMany(() => Order, (order) => order.dishes)
  orders: Order[];

  @ManyToOne(() => Vendor, (vendor) => vendor.dishes)
  vendor: Vendor;

  @ManyToMany(() => Menu, (menu) => menu.dishes)
  menus: Menu[];

  DishResponseObject(): DishResponseDto {
    const {
      id,
      name,
      createdAt,
      description,
      updatedAt,
      price,
      eta,
      isAvailable,
    } = this;
    return {
      id,
      name,
      description,
      price,
      eta,
      isAvailable,
      createdAt,
      updatedAt,
    };
  }
}
