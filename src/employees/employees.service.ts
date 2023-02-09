import { Injectable } from '@nestjs/common';
import { AppResponse } from 'src/helper/response';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Employees } from './entities/employee.entity';
import { MongoRepository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Sector } from 'src/sector/entities/sector.entity';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employees)
    private readonly employeesRepository: MongoRepository<Employees>,
    @InjectRepository(Sector)
    private readonly sectorRepository: MongoRepository<Sector>,
  ) {}

  async create({
    birthDate,
    document,
    name,
    zipCode,
    sector,
    responsible,
  }: CreateEmployeeDto): Promise<AppResponse> {
    if (sector) {
      const listSector = await this.sectorRepository.findOneBy({ _id: sector });

      if (!listSector) {
        throw new AppResponse({
          message: 'Setor não encontrado!',
          result: 'error',
          statusCode: 400,
        });
      }
    }

    const listeEmployeeByDocument = await this.employeesRepository.findOneBy({
      document: document,
    });

    if (listeEmployeeByDocument) {
      throw new AppResponse({
        message: 'Um funcionário já está cadastrado com esse documento!',
        result: 'error',
        statusCode: 400,
      });
    }

    const createEmployee = new Employees();

    createEmployee._id = uuidv4();
    createEmployee.birth_date = new Date(birthDate);
    createEmployee.document = document;
    createEmployee.name = name;
    createEmployee.zip_code = zipCode;
    createEmployee.sector = sector;
    createEmployee.created_at = new Date();
    createEmployee.vacation = false;
    createEmployee.responsible = sector ? responsible : false;

    const employee = await this.employeesRepository.save(createEmployee);

    return new AppResponse({
      message: 'Funcionário(a) cadastrado(a) com sucesso!',
      result: 'success',
      data: {
        id: employee._id,
        name: employee.name,
        document: employee.document,
        zipCode: employee.zip_code,
        birthDate: employee.birth_date,
        vacation: employee.vacation,
        responsible: employee.responsible,
      },
    });
  }

  async findAll(): Promise<AppResponse> {
    const employees = await this.employeesRepository.find();

    const newEmployees = employees.map((employee) => ({
      id: employee._id,
      name: employee.name,
      document: employee.document,
      zipCode: employee.zip_code,
      birthDate: employee.birth_date,
      createdAt: employee.created_at,
      vacation: employee.vacation,
      responsible: employee.responsible,
    }));

    return new AppResponse({
      message: 'Funcionários listados com sucesso',
      result: 'success',
      data: newEmployees,
    });
  }

  async findOne(id: string): Promise<AppResponse> {
    const employee = await this.employeesRepository.findOneBy({ _id: id });

    if (!employee) {
      throw new AppResponse({
        message: 'Funcionário não encontrado!',
        result: 'success',
        statusCode: 400,
      });
    }

    let listSector = null;

    if (employee.sector) {
      listSector = await this.sectorRepository.findOneBy({
        _id: employee.sector,
      });
    }

    return new AppResponse({
      message: 'Funcionário encontrado com sucesso!',
      result: 'success',
      data: {
        id: employee._id,
        name: employee.name,
        zipCode: employee.zip_code,
        birthDate: employee.birth_date,
        createdAt: employee.created_at,
        vacation: employee.vacation,
        responsible: employee.responsible,
        sector: employee.sector
          ? {
              id: listSector?._id,
              description: listSector?.description,
              responsible: listSector?.responsible,
            }
          : null,
      },
    });
  }

  async update(
    id: string,
    { name, sector, zipCode }: UpdateEmployeeDto,
  ): Promise<AppResponse> {
    const listEmployee = await this.employeesRepository.findOneBy({ _id: id });

    if (!listEmployee) {
      throw new AppResponse({
        message: 'Funcionário não encontrado!',
        result: 'error',
        statusCode: 400,
      });
    }

    const employees = new Employees();

    employees.name = name;
    employees.sector = sector;
    employees.zip_code = zipCode;

    await this.employeesRepository.updateOne(listEmployee, {
      $set: employees,
    });

    return new AppResponse({
      message: 'Funcionário atualizado com sucesso!',
      result: 'success',
    });
  }

  async remove(id: string): Promise<AppResponse> {
    const listEmployee = await this.employeesRepository.findOneBy({ _id: id });

    if (!listEmployee) {
      throw new AppResponse({
        message: 'Funcionário não encontrado!',
        result: 'error',
        statusCode: 400,
      });
    }

    await this.employeesRepository.deleteOne(listEmployee);

    return new AppResponse({
      message: 'Funcionário deletado com sucesso!',
      result: 'success',
    });
  }
}
