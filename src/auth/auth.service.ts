import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { CreateUserInput } from '../user/dto/create-user.input';
import { User } from '../user/entities/user.entity';
import * as bcryptjs from 'bcryptjs';

interface Token {
  token: string;
}

interface Register {
  user: User;
  token: Token;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}
  async register(input: CreateUserInput): Promise<Register> {
    if (await this.userService.getUserByEmail(input.email)) {
      throw new HttpException(
        'A user with this email is already registered',
        HttpStatus.FORBIDDEN,
      );
    }
    const user = await this.userService.create(input);
    const token = await this.generateToken(user);
    return { user, token };
  }

  async login(input: CreateUserInput): Promise<Token> {
    return this.generateToken(await this.userValidate(input));
  }

  private async generateToken(user: User): Promise<Token> {
    const payload = { email: user.email, id: user.id };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  private async userValidate(userDto: CreateUserInput) {
    const user = await this.userService.getUserByEmail(userDto.email);
    const password = await bcryptjs.compare(userDto.password, user.password);
    if (user && password) {
      return user;
    }
    throw new UnauthorizedException({ message: 'user is not validated' });
  }
}
