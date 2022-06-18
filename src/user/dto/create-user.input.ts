import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

@InputType()
export class CreateUserInput {
  @IsNotEmpty()
  @IsEmail()
  @Field(() => String, { description: 'Email user)' })
  email: string;

  @IsNotEmpty()
  @MinLength(1, {
    message: 'Title is too short',
  })
  @MaxLength(15, {
    message: 'Title is too long',
  })
  @Field(() => String, { description: 'Password user)' })
  password: string;
}
