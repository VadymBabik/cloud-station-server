import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UseGuards } from '@nestjs/common';
import { jwtAuthGuard } from '../auth/jwt.auth.guard';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User, { name: 'createUser' })
  async createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<User> {
    return this.userService.create(createUserInput);
  }

  @Query(() => [User], { name: 'getAllUsers' })
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Query(() => User, { name: 'getUserById' })
  async findOne(@Args('id', { type: () => Int }) id: number): Promise<User> {
    return this.userService.findOne(id);
  }

  @UseGuards(jwtAuthGuard)
  @Query(() => User, { name: 'getCurrentUser' })
  async getCurrentUser(
    @Context()
    context: any,
  ): Promise<User> {
    return this.userService.findOne(context.user.id);
  }

  @Mutation(() => User, { name: 'updateUserById' })
  async updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ): Promise<User> {
    return this.userService.update(updateUserInput.id, updateUserInput);
  }

  @Mutation(() => User, { name: 'removeUserById' })
  async removeUser(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<number> {
    return this.userService.remove(id);
  }
}
