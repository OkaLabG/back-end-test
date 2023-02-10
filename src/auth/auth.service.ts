import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';
import { User } from 'src/app/users/entities/user.entity';
import { UsersService } from 'src/app/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async session(user: User) {
    const payload = { sub: user._id, email: user.email };

    return {
      token: this.jwtService.sign(payload),
    };
  }

  async validateUser(email: string, password: string) {
    let user: User;

    try {
      user = await this.userService.findByEmail(email);
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
