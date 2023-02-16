import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { Department } from 'src/app/departments/entities/department.entity';
import { Employee } from 'src/app/employees/entities/employee.entity';
import { User } from '../entities/user.entity';

@Injectable()
class SendMailProducerService {
  constructor(@InjectQueue('sendMail-queue') private queue: Queue) {}

  async sendMail(user: User, employees: Employee[], department: Department) {
    await this.queue.add('sendMail-job', { user, employees, department });
  }
}

export { SendMailProducerService };
