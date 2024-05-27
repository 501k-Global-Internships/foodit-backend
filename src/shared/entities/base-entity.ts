import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from '../constants';
import { User } from 'src/user/entities/user.entity';

export class BaseEntity {
  /** The User Id (Primary Key)
   */
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ unique: true })
  email: string;

  // @Column()
  // phone: number;

  @ApiHideProperty()
  @Column({ nullable: false })
  @Exclude() //Exlcude password from response
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.User })
  role: UserRole;

  @ApiHideProperty()
  @Column({ nullable: true })
  @Exclude() //Exlcude refreshToken from response
  refreshToken: string;

  @ApiHideProperty()
  @Column({ nullable: true })
  @Exclude() //Exlcude resetToken from response
  resetPasswordToken: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  //Enabling Serialization (Removing sensitive datas)
  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
