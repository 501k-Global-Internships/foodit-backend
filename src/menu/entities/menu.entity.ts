import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Dish } from 'src/dishes/entities/dish.entity';
import { Vendor } from 'src/vendor/entities/vendor.entity';

@Entity()
export class Menu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ default: true })
  isAvailable: boolean;

  @ManyToOne(() => Vendor, (vendor) => vendor.menus)
  vendor: Vendor;

  @ManyToMany(() => Dish, (dish) => dish.menus)
  @JoinTable()
  dishes: Dish[];
}
