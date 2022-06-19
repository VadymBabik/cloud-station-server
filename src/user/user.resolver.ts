import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { AuthService } from '../auth/auth.service';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

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

  @Mutation(() => User)
  async registerUser(
    @Args('createUserInput', {
      description: 'registerUser',
      name: 'registerUser',
    })
    createUserInput: CreateUserInput,
    @Context() context: any,
  ): Promise<User> {
    console.log(context.res);
    const { token, user } = await this.authService.register(createUserInput);
    context.res.cookie('token', token.token, {
      expires: new Date(new Date().getTime() + 30 * 1000),
      sameSite: 'strict',
      secure: true,
      httpOnly: true,
    });
    return user;
  }
}
