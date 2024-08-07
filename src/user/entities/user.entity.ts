import * as bcrypt from 'bcryptjs';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/shared/entities';
import { UserLoginResponseDTO } from 'src/userAuth/dto/login/response.dto';
import { UserType } from 'src/shared/constants';
import { Order } from 'src/order/entities/order.entity';

@Entity()
export class User extends BaseEntity {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ type: 'enum', enum: UserType, default: UserType.User })
  userType: UserType;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  //Hashing User plain text password before saving using Entity Listener
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 8);
  }

  LoginResponseObject(): UserLoginResponseDTO {
    const {
      id,
      email,
      firstName,
      lastName,
      createdAt,
      phoneNumber,
      updatedAt,
      userType,
    } = this;
    return {
      id,
      email,
      firstName,
      lastName,
      phoneNumber,
      userType,
      createdAt,
      updatedAt,
    };
  }

  // Enabling Serialization (Removing sensitive datas)
  constructor(partial: Partial<User>) {
    super();
    Object.assign(this, partial);
  }
}
