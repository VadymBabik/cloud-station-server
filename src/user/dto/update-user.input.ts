import { CreateUserInput } from './create-user.input';
import { InputType, Field, Int, PartialType, OmitType } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput extends PartialType(
  OmitType(CreateUserInput, ['password']),
) {
  @Field(() => Int)
  id: number;

  @Field(() => String, { description: 'imageUrl user', nullable: true })
  imageUrl?: string;
}
