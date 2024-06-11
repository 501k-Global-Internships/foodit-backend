import * as bcrypt from 'bcrypt';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
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
  @BeforeUpdate()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 8);
  }

  LoginResponseObject(): UserLoginResponseDTO {
    const { id, email, name, createdAt, phoneNumber, updatedAt, userType } =
      this;
    return {
      id,
      email,
      name,
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
