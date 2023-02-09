import { Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../users/entities/user.entity';
import { MongoRepository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { AppResponse } from '../helper/response';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: MongoRepository<Users>,
  ) {}

  async execute(userName: string, password: string): Promise<AppResponse> {
    const listUserByUserName = await this.userRepository.findOneBy({
      user_name: userName,
    });

    if (!listUserByUserName) {
      throw new AppResponse({
        message: 'Usuário/senha inválidos!',
        result: 'error',
        statusCode: 400,
      });
    }

    const comparePassword = await compare(
      password,
      listUserByUserName.password,
    );

    if (!comparePassword) {
      throw new AppResponse({
        message: 'Usuário/senha inválidos!',
        result: 'error',
        statusCode: 400,
      });
    }

    const token = sign({ userId: listUserByUserName._id }, 'privateTeste');

    console.log({ token });

    return new AppResponse({
      message: 'Usuário logado com sucesso!',
      result: 'success',
      data: token,
    });
  }
}
