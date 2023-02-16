import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentsModule } from '../departments/departments.module';
import { EmployeesModule } from '../employees/employees.module';
import { User } from './entities/user.entity';
import { SendMailConsumer } from './jobs/sendMail-consumer';
import { SendMailProducerService } from './jobs/sendMail-producer.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    BullModule.registerQueue({
      name: 'sendMail-queue',
    }),
    EmployeesModule,
    DepartmentsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, SendMailProducerService, SendMailConsumer],
  exports: [UsersService],
})
export class UsersModule {}
