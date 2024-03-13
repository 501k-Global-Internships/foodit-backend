import { Exclude } from 'class-transformer';
import { UserRole } from 'src/typeDef.dto';
import * as bcrypt from 'bcrypt';
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiHideProperty } from '@nestjs/swagger';

@Entity()
export class User {
  /** The User Id (Primary Key)
   */
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ unique: true })
  email: string;

  @ApiHideProperty()
  @Column({ nullable: false })
  @Exclude() //Exlcude password from response
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.User })
  role: UserRole;

  @ApiHideProperty()
  @Column({ nullable: true })
  @Exclude() //Exlcude password from response
  refreshToken: string;

  //Hashing User plain text password before saving using Entity Listener
  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 8);
  }

  //Enabling Serialization (Removing sensitive datas)
  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
