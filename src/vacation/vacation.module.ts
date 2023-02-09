import { Module } from '@nestjs/common';
import { VacationService } from './vacation.service';
import { VacationController } from './vacation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vacation } from './entities/vacation.entity';
import { Employees } from 'src/employees/entities/employee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vacation, Employees])],
  controllers: [VacationController],
  providers: [VacationService],
})
export class VacationModule {}
