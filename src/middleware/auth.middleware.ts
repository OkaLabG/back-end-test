import { Injectable, NestMiddleware } from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { AppResponse } from 'src/helper/response';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../users/entities/user.entity';
import { MongoRepository } from 'typeorm';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: MongoRepository<Users>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authorization = req.headers.authorization;

    if (!authorization) {
      throw new AppResponse({
        message: 'Token não enviado!',
        result: 'error',
        statusCode: 401,
      });
    }

    const [, token] = authorization?.split(' ');

    if (!token) {
      throw new AppResponse({
        message: 'Token inválido!',
        result: 'error',
        statusCode: 401,
      });
    }

    const { userId, iat } = verify(token, 'privateTeste') as {
      userId: string;
      iat: number;
    };

    if (!userId || !iat) {
      throw new AppResponse({
        message: 'Token inválido!',
        result: 'error',
        statusCode: 400,
      });
    }

    const listUser = await this.userRepository.findOneBy({
      _id: userId,
    });

    if (!listUser) {
      throw new AppResponse({
        message: 'Token inválido!',
        result: 'error',
        statusCode: 401,
      });
    }

    next();
  }
}
