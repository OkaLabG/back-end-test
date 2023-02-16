import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { Employee } from 'src/app/employees/entities/employee.entity';

@Injectable()
class SendMailVacationProducerService {
  constructor(
    @InjectQueue('sendMail-vacationAlert-queue') private queue: Queue,
  ) {}

  async sendMail(employee: Employee) {
    await this.queue.add('sendMail-vacationAlert-job', {
      employee,
    });
  }
}

export { SendMailVacationProducerService };
