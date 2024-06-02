import * as bcrypt from 'bcrypt';
import { BeforeInsert, Column, Entity } from 'typeorm';
import { BaseEntity } from 'src/shared/entities';
import { UserLoginResponseDTO } from 'src/auth/dto/login/response.dto';

@Entity()
export class User extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  phoneNumber: string;

  //Hashing User plain text password before saving using Entity Listener
  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 8);
  }

  LoginResponseObject(): UserLoginResponseDTO {
    const {
      id,
      email,
      name,
      createdAt,
      phoneNumber,
      updatedAt,
      userType,
      // refreshToken,
    } = this;
    return {
      id,
      email,
      name,
      phoneNumber,
      userType,
      createdAt,
      updatedAt,
      // refreshToken,
    };
  }

  // Enabling Serialization (Removing sensitive datas)
  constructor(partial: Partial<User>) {
    super();
    Object.assign(this, partial);
  }
}

// export interface IUserRO {
//   id: number;
//   email: string;
//   name: string;
//   phoneNumber: string;
//   userType: string;
//   refreshToken: string;
//   createdAt: Date;
//   updatedAt: Date;
// }
