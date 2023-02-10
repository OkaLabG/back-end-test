import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcryptjs';
import { User } from 'src/app/users/entities/user.entity';
import { UsersService } from 'src/app/users/users.service';
import { AppResponse } from 'src/helpers/Response';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async session(user: User) {
    const payload = { sub: user._id, email: user.email };

    return new AppResponse({
      result: 'success',
      message: 'Success on create session',
      data: { token: this.jwtService.sign(payload) },
    });
  }

  async validateUser(email: string, password: string) {
    let user: User;

    try {
      const { data } = await this.userService.findByEmail(email);

      user = data;
    } catch (err) {
      return null;
    }

    if (!user) {
      return null;
    }

    const passwordValid = compareSync(password, user.password);

    if (!passwordValid) {
      return null;
    }

    return user;
  }
}
