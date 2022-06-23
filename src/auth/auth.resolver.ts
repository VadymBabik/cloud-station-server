import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { User } from '../user/entities/user.entity';
import { CreateUserInput } from '../user/dto/create-user.input';
import { AuthService } from './auth.service';
import { LoginUserInput } from './dto/login-user.input';

@Resolver(() => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => User)
  async registerUser(
    @Args('createUserInput', {
      description: 'registerUser',
      name: 'registerUser',
    })
    createUserInput: CreateUserInput,
    @Context() context: any,
  ): Promise<User> {
    const { token, user } = await this.authService.register(createUserInput);
    context.res.cookie('token', token.token, {
      expires: new Date(new Date().getTime() + 30 * 1000),
      maxAge: 1000 * 60 * 60 * 24, // one dey
      sameSite: 'strict',
      secure: true,
      // httpOnly: true,
    });
    return user;
  }

  @Mutation(() => User)
  async loginUser(
    @Args('createUserInput', {
      description: 'loginUser',
      name: 'loginUser',
    })
    createUserInput: LoginUserInput,
    @Context() context: any,
  ): Promise<User> {
    const { token, user } = await this.authService.login(createUserInput);
    context.res.cookie('token', token.token, {
      expires: new Date(new Date().getTime() + 30 * 1000),
      maxAge: 1000 * 60 * 60 * 24, // one dey
      sameSite: 'strict',
      secure: true,
      // httpOnly: true,
    });
    return user;
  }
}
