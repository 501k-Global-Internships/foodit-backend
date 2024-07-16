import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { BeforeUpdate, Column, PrimaryGeneratedColumn } from 'typeorm';

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

  @ApiHideProperty()
  @Column({ nullable: true })
  @Exclude() //Exlcude refreshToken from response
  refreshToken: string;

  @ApiHideProperty()
  @Column({ nullable: true })
  @Exclude() //Exlcude resetToken from response
  resetPasswordToken: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'datetime', nullable: true })
  updatedAt: Date;

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = new Date();
  }
}
