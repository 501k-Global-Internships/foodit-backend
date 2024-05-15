// import { Exclude } from 'class-transformer';
// import { UserRole } from 'src/shared/constants/typeDef.dto';
import * as bcrypt from 'bcrypt';
import { BeforeInsert, Entity } from 'typeorm';
// import { ApiHideProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/shared/entities';

@Entity()
export class User extends BaseEntity {
  //Hashing User plain text password before saving using Entity Listener
  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 8);
  }
}
