import { Exclude } from 'class-transformer';
import { UserRole } from 'src/typeDef.dto';
import * as bcrypt from 'bcrypt';
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiHideProperty } from '@nestjs/swagger';

@Entity()
export class Vendor {
  /** The User Id (Primary Key)
   */
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ nullable: false })
  businessname: string;

  @Column({ unique: true })
  businessemail: string;

  @ApiHideProperty()
  @Column({ nullable: false })
  @Exclude() //Exlcude password from response
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.Vendor })
  role: UserRole;

  @ApiHideProperty()
  @Column({ nullable: true })
  @Exclude() //Exlcude password from response
  refreshToken: string;

  //Hashing Vendor plain text password before saving using Entity Listener
  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 8);
  }

  //Enabling Serialization (Removing sensitive datas)
  constructor(partial: Partial<Vendor>) {
    Object.assign(this, partial);
  }
}
