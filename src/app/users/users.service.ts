import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppResponse } from 'src/helpers/Response';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create({ email, name, password }: CreateUserDto) {
    const newUser = new User();

    const user = await this.usersRepository.save(
      Object.assign(newUser, {
        email,
        name,
        password,
      }),
    );

    return new AppResponse({
      result: 'success',
      message: 'Success on create user',
      data: user,
    });
  }

  async findAll() {
    const users = await this.usersRepository.find();

    return new AppResponse({
      result: 'success',
      message: 'Success on list all users',
      data: users,
    });
  }

  async findByEmail(email: string) {
    const user = await this.usersRepository.findOne({
      where: {
        email,
      },
    });

    return new AppResponse({
      result: 'success',
      message: 'Success on list this user for this email',
      data: user,
    });
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOne({
      where: {
        _id: id,
      },
    });

    return new AppResponse({
      result: 'success',
      message: 'Success on list this user',
      data: user,
    });
  }

  async update(id: string, { email, name }: UpdateUserDto) {
    try {
      await this.usersRepository.update(id, { email, name });
    } catch (err) {
      return new AppResponse({
        result: 'error',
        message: 'Error on update this user',
      });
    }

    return new AppResponse({
      result: 'success',
      message: 'Success on update this user',
    });
  }

  async remove(id: string) {
    try {
      await this.usersRepository.delete(id);
    } catch (err) {
      return new AppResponse({
        result: 'error',
        message: 'Error on delete this user',
      });
    }

    return new AppResponse({
      result: 'success',
      message: 'Success on delete user',
    });
  }
}
