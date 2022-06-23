import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { CreateUserInput } from '../user/dto/create-user.input';
import { User } from '../user/entities/user.entity';
import { LoginUserInput } from './dto/login-user.input';
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

  async login(input: LoginUserInput): Promise<Register> {
    const user = await this.userValidate(input);
    const token = await this.generateToken(user);
    return { user, token };
  }

  private async generateToken(user: User): Promise<Token> {
    const payload = { email: user.email, id: user.id };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  private async userValidate(userDto: LoginUserInput) {
    const user = await this.userService.getUserByEmail(userDto.email);
    const password = await bcryptjs.compare(userDto.password, user.password);
    if (user && password) {
      return user;
    }
    throw new HttpException('User is not validated', HttpStatus.FORBIDDEN);
  }
}
