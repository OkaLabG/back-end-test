import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, ObjectID, Repository } from 'typeorm';
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

    return this.usersRepository.save(
      Object.assign(newUser, {
        email,
        name,
        password,
      }),
    );
  }

  async findAll() {
    return this.usersRepository.find();
  }

  async findByEmail(email: string) {
    return this.usersRepository.findOne({
      where: {
        email,
      },
    });
  }

  async findOne(id: string) {
    return this.usersRepository.findOne({
      where: {
        _id: new ObjectID(id),
      },
    });
  }

  async update(id: string, { email, name }: UpdateUserDto) {
    try {
      await this.usersRepository.update(id, { email, name });
    } catch (err) {
      return new BadRequestException(
        'Error on update this user: ' + err.message,
      );
    }

    return { message: 'Success on update user' };
  }

  async remove(id: string) {
    try {
      await this.usersRepository.delete(id);
    } catch (err) {
      return new BadRequestException(
        'Error on delete this user: ' + err.message,
      );
    }

    return { message: 'Success on delete user' };
  }
}
