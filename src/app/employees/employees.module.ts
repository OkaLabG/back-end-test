import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { DepartmentsModule } from 'src/app/departments/departments.module';
import { BullModule } from '@nestjs/bull';
import { SendMailVacationProducerService } from './jobs/sendMailVacation-producer.service';
import { SendMailVacationConsumer } from './jobs/sendMailVacation-consumer';

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee]),
    BullModule.registerQueue({
      name: 'sendMail-vacationAlert-queue',
    }),
    DepartmentsModule,
  ],
  controllers: [EmployeesController],
  providers: [
    EmployeesService,
    SendMailVacationProducerService,
    SendMailVacationConsumer,
  ],
  exports: [EmployeesService],
})
export class EmployeesModule {}
