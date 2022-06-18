import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Base extends BaseEntity {
  @Field(() => Int, { nullable: true })
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Date)
  @CreateDateColumn()
  createDateColumn: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updateDateColumn: Date;

  @Field(() => Date, { nullable: true })
  @DeleteDateColumn({ nullable: true })
  deleteDateColumn: Date;
}
