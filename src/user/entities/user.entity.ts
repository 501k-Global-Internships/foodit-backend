import * as bcrypt from 'bcryptjs';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import { BaseEntity } from 'src/shared/entities';
import { UserLoginResponseDTO } from 'src/userAuth/dto/login/response.dto';
import { UserType } from 'src/shared/constants';

@Entity()
export class User extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ type: 'enum', enum: UserType, default: UserType.User })
  userType: UserType;

  //Hashing User plain text password before saving using Entity Listener
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 8);
  }

  LoginResponseObject(): UserLoginResponseDTO {
    const { id, email, name, createdAt, phoneNumber, updatedAt, userType, lat, lng} =
      this;
    return {
      id,
      email,
      name,
      phoneNumber,
      userType,
      createdAt,
      updatedAt,
      lat,
      lng
    };
  }

  // Enabling Serialization (Removing sensitive datas)
  constructor(partial: Partial<User>) {
    super();
    Object.assign(this, partial);
  }
}
