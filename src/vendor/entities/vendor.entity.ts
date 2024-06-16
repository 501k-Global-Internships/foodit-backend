import * as bcrypt from 'bcrypt';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import { BaseEntity } from '../../shared/entities/base-entity';
import { VendorLoginResponseDTO } from '../dto/login-response.dto';
import { StatusType, UserType } from 'src/shared/constants';
import { Exclude } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';

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

  //Hashing Vendor plain text password before saving using Entity Listener
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 8);
  }

  LoginResponseObject(): VendorLoginResponseDTO {
    const {
      id,
      email,
      businessName,
      businessAddress,
      createdAt,
      phoneNumber,
      updatedAt,
      userType,
    } = this;
    return {
      id,
      email,
      businessName,
      phoneNumber,
      businessAddress,
      userType,
      createdAt,
      updatedAt,
    };
  }

  //Enabling Serialization (Removing sensitive datas)
  constructor(partial: Partial<Vendor>) {
    super();
    Object.assign(this, partial);
  }
}
