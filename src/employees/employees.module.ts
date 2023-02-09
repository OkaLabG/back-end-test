import { Module } from '@nestjs/common';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employees } from 'src/employees/entities/employee.entity';
import { Sector } from 'src/sector/entities/sector.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Employees, Sector])],
  controllers: [EmployeesController],
  providers: [EmployeesService],
})
export class EmployeesModule {}
