import { Dish } from 'src/dishes/entities/dish.entity';
import { OrderStatus } from 'src/shared/constants';
import { User } from 'src/user/entities/user.entity';
import { Vendor } from 'src/vendor/entities/vendor.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PLACED })
  status: OrderStatus;

  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;

  // @OneToMany(() => Dish, (dish) => dish.order)
  // dishes: Dish[];

  @ManyToMany(() => Dish)
  @JoinTable()
  dishes: Dish[];

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @ManyToOne(() => Vendor, (vendor) => vendor.orders)
  vendor: Vendor;

  //   @CreateDateColumn()
  //   createdAt: Date;

  //   @UpdateDateColumn()
  //   updatedAt: Date;
}
