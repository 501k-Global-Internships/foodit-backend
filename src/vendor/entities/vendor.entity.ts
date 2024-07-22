import * as bcrypt from 'bcryptjs';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../shared/entities/base-entity';
// import { VendorLoginResponseDTO } from '../dto/login-response.dto';
import { StatusType, UserType } from 'src/shared/constants';
import { Exclude } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';
import { Dish } from 'src/dishes/entities/dish.entity';
import { Menu } from 'src/menu/entities/menu.entity';

@Entity()
export class Vendor extends BaseEntity {
  @Column({ nullable: false, unique: true })
  businessName: string;

  @Column()
  businessAddress: string;

  @Column()
  phoneNumber: string;

  @ApiHideProperty()
  @Exclude()
  @Column({ nullable: true })
  confirmationCode: string;

  @Column({ type: 'enum', enum: UserType, default: UserType.Vendor })
  userType: UserType;

  @Column({
    type: 'enum',
    enum: StatusType,
    default: StatusType.PENDING,
  })
  status: StatusType;

  @OneToMany(() => Dish, (dish) => dish.vendor)
  dishes: Dish[];

  @OneToMany(() => Menu, (menu) => menu.vendor)
  menus: Menu[];

  //Hashing Vendor plain text password before saving using Entity Listener
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 8);
  }

  //Enabling Serialization (Removing sensitive datas)
  constructor(partial: Partial<Vendor>) {
    super();
    Object.assign(this, partial);
  }
}
