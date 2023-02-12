import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DepartmentsService } from 'src/app/departments/departments.service';
import { AppError } from 'src/helpers/Error';
import { AppResponse } from 'src/helpers/Response';
import { MongoRepository } from 'typeorm';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee } from './entities/employee.entity';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: MongoRepository<Employee>,
    @Inject(DepartmentsService)
    private departmentService: DepartmentsService,
  ) {}

  async create({ email, isManager, name, departmentId }: CreateEmployeeDto) {
    const newEmployee = new Employee();

    const employeeExists = await this.employeeRepository.findOne({
      where: { email },
    });

    if (employeeExists) {
      throw new AppError({
        statusCode: 400,
        result: 'error',
        message: 'Employee already exists',
      });
    }

    const { data: departmentExists } = await this.departmentService.findOne(
      departmentId,
    );

    if (!departmentExists) {
      throw new AppError({
        statusCode: 400,
        result: 'error',
        message: 'Department does not exists',
      });
    }

    let departmentHasManager = null;

    try {
      departmentHasManager = await this.findAllByDepartment(departmentId);
    } catch {}

    if (!departmentHasManager && !isManager) {
      throw new AppError({
        statusCode: 400,
        result: 'error',
        message: 'Department has no manager',
      });
    }

    let employee: Employee;

    try {
      employee = await this.employeeRepository.save(
        Object.assign(newEmployee, {
          email,
          isManager,
          name,
          departmentId,
          onVacation: false,
        }),
      );
    } catch (err) {
      throw new AppError({
        statusCode: 400,
        result: 'error',
        message: 'Error on create this employee',
      });
    }

    return new AppResponse({
      result: 'success',
      message: 'Success on create employee',
      data: employee,
    });
  }

  async findAll() {
    const employees = await this.employeeRepository.find();

    if (!employees.length) {
      throw new AppError({
        result: 'error',
        statusCode: 400,
        message: 'Employees not found',
      });
    }

    return new AppResponse({
      result: 'success',
      message: 'Success on list all employees',
      data: employees,
    });
  }

  async findOne(id: string) {
    const employee = await this.employeeRepository.findOne({
      where: {
        _id: id,
      },
    });

    if (!employee) {
      throw new AppError({
        result: 'error',
        statusCode: 400,
        message: 'Employee not found',
      });
    }

    return new AppResponse({
      result: 'success',
      message: 'Success on list this employees',
      data: employee,
    });
  }

  async findAllByDepartment(departmentId: string) {
    const employees = await this.employeeRepository.find({
      where: {
        departmentId: departmentId,
      },
    });

    if (!employees.length) {
      throw new AppError({
        result: 'error',
        statusCode: 400,
        message: 'Employees not found for this department',
      });
    }

    return new AppResponse({
      result: 'success',
      message: 'Success on list all employees for this department',
      data: employees,
    });
  }

  async findByEmail(email: string) {
    const employee = await this.employeeRepository.findOne({
      where: {
        email: email,
      },
    });

    if (!employee) {
      throw new AppError({
        result: 'error',
        statusCode: 400,
        message: 'Employees not found for this email',
      });
    }

    return new AppResponse({
      result: 'success',
      message: 'Success on list this employee for this email',
      data: employee,
    });
  }

  async update(id: string, { name, departmentId, email }: UpdateEmployeeDto) {
    const employee = await this.employeeRepository.findOne({
      where: {
        _id: id,
      },
    });

    if (!employee) {
      throw new AppError({
        result: 'error',
        statusCode: 400,
        message: 'Employee not found',
      });
    }

    const { data: departmentExists } = await this.departmentService.findOne(
      departmentId,
    );

    if (!departmentExists) {
      throw new AppError({
        statusCode: 400,
        result: 'error',
        message: 'Department does not exists',
      });
    }

    const updateEmployee = {
      ...employee,
      departmentId: departmentId ?? employee.departmentId,
      email: email ?? employee.email,
      name: name ?? employee.name,
    };

    try {
      await this.employeeRepository.updateOne(employee, {
        $set: updateEmployee,
      });
    } catch (err) {
      throw new AppError({
        result: 'error',
        statusCode: 400,
        message: 'Error on update this employee',
      });
    }

    return { message: 'Success on update' };
  }

  async remove(id: string) {
    const employee = await this.employeeRepository.findOne({
      where: {
        _id: id,
      },
    });

    if (!employee) {
      throw new AppError({
        result: 'error',
        statusCode: 400,
        message: 'Employee not found',
      });
    }

    try {
      await this.employeeRepository.deleteOne(employee);
    } catch (err) {
      return new AppError({
        result: 'error',
        statusCode: 400,
        message: 'Error on update this employee',
      });
    }

    return new AppResponse({
      result: 'success',
      message: 'Success on delete employee',
    });
  }

  async updateVacation(id: string, status: boolean) {
    const { data: employee } = await this.findOne(id);

    if (!employee) {
      return new AppError({
        statusCode: 400,
        result: 'error',
        message: 'Employee does no exists',
      });
    }

    if (employee.onVacation && status) {
      return new AppError({
        statusCode: 400,
        result: 'error',
        message: 'Employee is in vacation',
      });
    }

    const { data: departmentsVacations } = await this.findAllByDepartment(
      employee.departmentId,
    );

    const employeesInWork = departmentsVacations.filter(
      (row: Employee) => !row.onVacation,
    );

    if (employeesInWork.length <= 2 && status) {
      return new AppError({
        statusCode: 400,
        result: 'error',
        message: 'Exceeded number of employees on vacation',
      });
    }

    if (employee.isManager) {
      const managers = employeesInWork.filter((row: Employee) => row.isManager);

      if (managers.length <= 1 && status) {
        return new AppError({
          statusCode: 400,
          result: 'error',
          message: 'Exceeded number of managers on vacation',
        });
      }
    }

    const updateEmployee = { ...employee, onVacation: status };

    try {
      await this.employeeRepository.updateOne(employee, {
        $set: updateEmployee,
      });
    } catch (err) {
      console.log({ err });

      return new AppError({
        statusCode: 400,
        result: 'error',
        message: 'Error on update this vacation',
      });
    }

    return new AppResponse({
      result: 'success',
      message: 'Success on update vacation',
    });
  }
}
