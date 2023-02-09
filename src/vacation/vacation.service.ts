import { Injectable } from '@nestjs/common';
import { CreateVacationDto } from './dto/create-vacation.dto';
import { UpdateVacationDto } from './dto/update-vacation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Vacation } from './entities/vacation.entity';
import { MongoRepository } from 'typeorm';
import { AppResponse } from 'src/helper/response';
import { v4 as uuidv4 } from 'uuid';
import { Employees } from 'src/employees/entities/employee.entity';

@Injectable()
export class VacationService {
  constructor(
    @InjectRepository(Vacation)
    private readonly vacationRepository: MongoRepository<Vacation>,
    @InjectRepository(Employees)
    private readonly employeesRepository: MongoRepository<Employees>,
  ) {}

  async create({
    employee,
    end_date,
    start_date,
  }: CreateVacationDto): Promise<AppResponse> {
    const listEmployee = await this.employeesRepository.findOneBy({
      _id: employee,
    });

    if (!listEmployee) {
      throw new AppResponse({
        message: 'Funcionário não encontrado!',
        result: 'error',
        statusCode: 400,
      });
    }

    if (listEmployee.vacation) {
      throw new AppResponse({
        message: 'Funcionário já se encontra de férias!',
        result: 'error',
      });
    }

    const listAllEmployees = await this.employeesRepository.findBy({
      vacation: false,
      responsible: true,
    });

    if (listAllEmployees.length <= 1) {
      throw new AppResponse({
        message: 'O setor não pode ficar sem responsáveis!',
        result: 'error',
        statusCode: 400,
      });
    }

    const listWorkingEmployees = await this.employeesRepository.findBy({
      vacation: false,
    });

    if (listWorkingEmployees.length <= 2) {
      throw new AppResponse({
        message: 'O setor deve ter no mínimo duas pessoas trabalhando',
        result: 'error',
        statusCode: 400,
      });
    }

    const vacationObject = new Vacation();

    vacationObject._id = uuidv4();
    vacationObject.employee = employee;
    vacationObject.start_date = new Date(start_date);
    vacationObject.end_date = new Date(end_date);

    const vacation = await this.vacationRepository.save(vacationObject);

    const employeeObject = new Employees();

    employeeObject.vacation = true;

    await this.employeesRepository.updateOne(listEmployee, {
      $set: employeeObject,
    });

    return new AppResponse({
      message: 'Férias cadastrada com sucesso!',
      result: 'success',
      data: {
        id: vacation._id,
        employee: {
          id: listEmployee._id,
          name: listEmployee.name,
          document: listEmployee.document,
        },
        startDate: vacation.start_date,
        endDate: vacation.end_date,
      },
    });
  }

  async findAll(): Promise<AppResponse> {
    const vacations = await this.vacationRepository.find();

    const newVacations = vacations.map((employee) => ({
      id: employee._id,
      employee: employee.employee,
      startDate: employee.start_date,
      endDate: employee.end_date,
    }));

    return new AppResponse({
      message: 'Funcionários listados com sucesso',
      result: 'success',
      data: newVacations,
    });
  }

  async update(
    id: string,
    { endDate, startDate }: UpdateVacationDto,
  ): Promise<AppResponse> {
    const listVacation = await this.vacationRepository.findOneBy({ _id: id });

    if (!listVacation) {
      throw new AppResponse({
        message: 'Férias não encontrada!',
        result: 'error',
        statusCode: 400,
      });
    }

    const vacation = new Vacation();

    vacation.end_date = new Date(endDate);
    vacation.start_date = new Date(startDate);

    await this.vacationRepository.updateOne(listVacation, {
      $set: vacation,
    });

    return new AppResponse({
      message: 'Férias atualizada com sucesso!',
      result: 'success',
    });
  }

  async remove(id: string): Promise<AppResponse> {
    const listVacation = await this.vacationRepository.findOneBy({ _id: id });

    if (!listVacation) {
      throw new AppResponse({
        message: 'Férias não encontrado!',
        result: 'error',
        statusCode: 400,
      });
    }

    const listEmployee = await this.employeesRepository.findOneBy({
      _id: listVacation.employee,
    });

    if (!listEmployee) {
      throw new AppResponse({
        message: 'Funcionário não encontrado!',
        result: 'error',
      });
    }

    await this.vacationRepository.deleteOne(listVacation);

    const employee = new Employees();

    employee.vacation = false;

    await this.employeesRepository.updateOne(listEmployee, { $set: employee });

    return new AppResponse({
      message: 'Férias finalizada com sucesso!',
      result: 'success',
    });
  }
}
