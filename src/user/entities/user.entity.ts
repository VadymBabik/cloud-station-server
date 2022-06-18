import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { Base } from '../../entity/Base';

@ObjectType()
@Entity('user')
export class User extends Base {
  @Field()
  @Column()
  email: string;

  @Field()
  @Column()
  password: string;
}
