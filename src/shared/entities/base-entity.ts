import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserType } from '../constants';

export abstract class BaseEntity {
  /** The User Id (Primary Key)
   */
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ unique: true })
  email: string;

  @ApiHideProperty()
  @Column({ nullable: false })
  @Exclude() //Exlcude password from response
  password: string;

  @Column({ type: 'enum', enum: UserType, default: UserType.User })
  userType: UserType;

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
}
