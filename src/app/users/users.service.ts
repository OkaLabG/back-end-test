import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppResponse } from 'src/helpers/Response';
import { SendMailProducerService } from './jobs/sendMail-producer.service';
import { MongoRepository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { EmployeesService } from '../employees/employees.service';
import { DepartmentsService } from '../departments/departments.service';
import { AppError } from 'src/helpers/Error';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: MongoRepository<User>,
    private sendMailProducerService: SendMailProducerService,
    @Inject(EmployeesService)
    private employeesService: EmployeesService,
    @Inject(DepartmentsService)
    private departmentsService: DepartmentsService,
  ) {}

  async create({ email, name, password }: CreateUserDto) {
    const newUser = new User();

    const userExists = await this.usersRepository.findOne({
      where: {
        email,
      },
    });

    if (userExists) {
      throw new AppError({
        result: 'error',
        statusCode: 400,
        message: 'User already exists',
      });
    }

    let user: User;

    try {
      user = await this.usersRepository.save(
        Object.assign(newUser, {
          email,
          name,
          password,
        }),
      );
    } catch (err) {
      throw new AppError({
        result: 'error',
        statusCode: 400,
        message: 'Error on create this user',
      });
    }

    return new AppResponse({
      result: 'success',
      message: 'Success on create user',
      data: user,
    });
  }

  async findAll() {
    const users = await this.usersRepository.find();

    if (!users.length) {
      throw new AppError({
        result: 'error',
        statusCode: 400,
        message: 'User not found',
      });
    }

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

    if (!user) {
      throw new AppError({
        result: 'error',
        statusCode: 400,
        message: 'User not found',
      });
    }

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

    if (!user) {
      throw new AppError({
        result: 'error',
        statusCode: 400,
        message: 'User not found',
      });
    }

    return new AppResponse({
      result: 'success',
      message: 'Success on list this user',
      data: user,
    });
  }

  async vacationReport(userId: string, departmentId?: string) {
    const user = await this.usersRepository.findOne({
      where: {
        _id: userId,
      },
    });

    if (!user) {
      throw new AppError({
        result: 'error',
        statusCode: 400,
        message: 'User not found',
      });
    }

    const { data: department } = await this.departmentsService.findOne(
      departmentId,
    );

    if (!department) {
      throw new AppError({
        result: 'error',
        statusCode: 400,
        message: 'Department not found',
      });
    }

    const { data: employees } = await this.employeesService.findAllByDepartment(
      departmentId,
    );

    if (!employees.length) {
      throw new AppError({
        result: 'error',
        statusCode: 400,
        message: 'Employees not found',
      });
    }

    this.sendMailProducerService.sendMail(user, employees, department);

    return new AppResponse({
      result: 'success',
      message: 'Vacations report sended to email',
    });
  }

  async update(id: string, { email, name }: UpdateUserDto) {
    const user = await this.usersRepository.findOneBy({
      _id: id,
    });

    if (!user) {
      throw new AppError({
        result: 'error',
        statusCode: 400,
        message: 'User not found',
      });
    }

    const userUpdate = { ...user, email, name };

    try {
      await this.usersRepository.updateOne(user, {
        $set: userUpdate,
      });
    } catch (err) {
      throw new AppError({
        result: 'error',
        statusCode: 400,
        message: 'Error on update this user',
      });
    }

    return new AppResponse({
      result: 'success',
      message: 'Success on update this user',
    });
  }

  async remove(id: string) {
    const user = await this.usersRepository.findOneBy({
      _id: id,
    });

    if (!user) {
      throw new AppError({
        result: 'error',
        statusCode: 400,
        message: 'User not found',
      });
    }

    try {
      await this.usersRepository.deleteOne(user);
    } catch (err) {
      throw new AppError({
        result: 'error',
        statusCode: 400,
        message: 'Error on delete this user',
      });
    }

    return new AppResponse({
      result: 'success',
      message: 'Success on delete user',
    });
  }
}
