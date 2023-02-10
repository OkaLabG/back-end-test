import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DepartmentsService } from 'src/app/departments/departments.service';
import { AppResponse } from 'src/helpers/Response';
import { Repository } from 'typeorm';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee } from './entities/employee.entity';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    @Inject(DepartmentsService)
    private departmentService: DepartmentsService,
  ) {}

  async create({ email, isManager, name, departmentId }: CreateEmployeeDto) {
    const newEmployee = new Employee();

    const employeeExists = await this.findByEmail(email);

    if (employeeExists) {
      return new BadRequestException('Employee already exists');
    }

    const departmentExists = await this.departmentService.findOne(departmentId);

    if (!departmentExists) {
      return new BadRequestException('Department does not exists');
    }

    const departmentHasManager = await this.findAllByDepartment(departmentId);

    if (!departmentHasManager && !isManager) {
      return new BadRequestException('Department has no manager');
    }

    const employee = await this.employeeRepository.save(
      Object.assign(newEmployee, {
        email,
        isManager,
        name,
        departmentId,
        onVacation: false,
      }),
    );

    return new AppResponse({
      result: 'success',
      message: 'Success on create employee',
      data: employee,
    });
  }

  async findAll() {
    const employees = await this.employeeRepository.find();

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

    return new AppResponse({
      result: 'success',
      message: 'Success on list this employee for this email',
      data: employee,
    });
  }

  async update(
    id: string,
    { departmentId, email, isManager }: UpdateEmployeeDto,
  ) {
    try {
      await this.employeeRepository.update(id, {
        departmentId,
        email,
        isManager,
      });
    } catch (err) {
      return new BadRequestException('Error on update this employee');
    }
    return { message: 'Success on update' };
  }

  async remove(id: string) {
    try {
      await this.employeeRepository.delete(id);
    } catch (err) {
      return new AppResponse({
        result: 'success',
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
      return new AppResponse({
        result: 'error',
        message: 'Employee does no exists',
      });
    }

    if (employee.onVacation && status) {
      return new AppResponse({
        result: 'error',
        message: 'Employee is in vacation',
      });
    }

    const { data: departmentsVacations } = await this.findAllByDepartment(
      employee.departmentId,
    );

    const employeesInWork = departmentsVacations.filter(
      (row) => !row.onVacation,
    );

    if (employeesInWork.length <= 2 && status) {
      return new AppResponse({
        result: 'error',
        message: 'Exceeded number of employees on vacation',
      });
    }

    if (employee.isManager) {
      const managers = employeesInWork.filter((row) => row.isManager);

      if (managers.length <= 1 && status) {
        return new AppResponse({
          result: 'error',
          message: 'Exceeded number of managers on vacation',
        });
      }
    }

    try {
      await this.employeeRepository.update(id, {
        onVacation: status,
      });
    } catch (err) {
      return new AppResponse({
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
