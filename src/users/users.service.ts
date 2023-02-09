import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { genSalt, hash } from 'bcrypt';
import { AppResponse } from 'src/helper/response';
import { MongoRepository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { strongPasswordValidation } from 'src/utils/passwordCheck';
import { Users } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: MongoRepository<Users>,
  ) {}

  async create({
    document,
    email,
    name,
    password,
    passwordConfirm,
    userName,
  }: CreateUserDto): Promise<AppResponse> {
    if (password !== passwordConfirm) {
      throw new AppResponse({
        message: 'As senhas não coincidem',
        result: 'error',
        statusCode: 400,
      });
    }

    const passwordCheck = strongPasswordValidation({ password });

    if (!passwordCheck.valid) {
      throw new AppResponse({
        message: passwordCheck.message,
        result: 'error',
        statusCode: 400,
      });
    }

    const listUserByDocument = await this.userRepository.findOneBy({
      document: document,
    });

    if (listUserByDocument) {
      throw new AppResponse({
        message: 'Um usuário já está cadastrado com esse documento!',
        result: 'error',
        statusCode: 400,
      });
    }

    const listUserByEmail = await this.userRepository.findOneBy({
      email: email,
    });

    if (listUserByEmail) {
      throw new AppResponse({
        message: 'Um usuário já está cadastrado com esse email!',
        result: 'error',
        statusCode: 400,
      });
    }

    const salt = await genSalt(12);

    const passwordHash = await hash(password, salt);

    const userObject = new Users();

    userObject._id = uuidv4();
    userObject.created_at = new Date();
    userObject.document = document;
    userObject.email = email;
    userObject.name = name;
    userObject.password = passwordHash;
    userObject.user_name = userName;

    const user = await this.userRepository.save(userObject);

    return new AppResponse({
      message: 'Usuário criado com sucesso!',
      result: 'success',
      data: {
        id: user._id,
        name: user.name,
        document: user.document,
        userName: user.user_name,
        email: user.email,
      },
    });
  }

  async findAll(): Promise<AppResponse> {
    const users = await this.userRepository.find();

    const newUsers = users.map((user) => ({
      id: user._id,
      name: user.name,
      document: user.document,
      createdAt: user.created_at,
      email: user.email,
    }));

    return new AppResponse({
      message: 'Usuários listados com sucesso!',
      result: 'success',
      data: newUsers,
    });
  }

  async findOne(id: string): Promise<AppResponse> {
    const user = await this.userRepository.findOneBy({ _id: id });

    if (!user) {
      throw new AppResponse({
        message: 'Usuário não encontrado!',
        result: 'success',
        statusCode: 400,
      });
    }

    return new AppResponse({
      message: 'Usuário encontrado com sucesso!',
      result: 'success',
      data: {
        id: user._id,
        name: user.name,
        document: user.document,
        createdAt: user.created_at,
        email: user.email,
      },
    });
  }

  async update(
    id: string,
    { document, email, name }: UpdateUserDto,
  ): Promise<AppResponse> {
    const listUser = await this.userRepository.findOneBy({ _id: id });

    if (!listUser) {
      throw new AppResponse({
        message: 'Usuário não encontrado!',
        result: 'error',
        statusCode: 400,
      });
    }

    const user = new Users();

    user.document = document;
    user.email = email;
    user.name = name;

    await this.userRepository.updateOne(listUser, {
      $set: user,
    });

    return new AppResponse({
      message: 'Usuário atualizado com sucesso!',
      result: 'success',
    });
  }

  async remove(id: string): Promise<AppResponse> {
    const listUser = await this.userRepository.findOneBy({ _id: id });

    if (!listUser) {
      throw new AppResponse({
        message: 'Usuário não encontrado!',
        result: 'error',
        statusCode: 400,
      });
    }

    await this.userRepository.deleteOne(listUser);

    return new AppResponse({
      message: 'Usuário deletado com sucesso!',
      result: 'success',
    });
  }
}
