import { MailerService } from '@nestjs-modules/mailer';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import e from 'express';
import { Employee } from 'src/app/employees/entities/employee.entity';

@Processor('sendMail-vacationAlert-queue')
class SendMailVacationConsumer {
  constructor(private mailService: MailerService) {}

  @Process('sendMail-vacationAlert-job')
  async sendMailJob(job: Job<{ employee: Employee }>) {
    const { data } = job;

    const { employee } = data;
    let html;

    if (employee.onVacation) {
      html = `
    <h1>Olá ${employee.name}!</h1>
    <h2>Parabéns!!</h2>
    <p>O senhor agora esta de férias</p>
    `;
    } else {
      html = `
    <h1>Olá ${employee.name}!</h1>
    <h2>Muito bom o seu retorno!!</h2>
    `;
    }

    await this.mailService.sendMail({
      to: employee.email,
      from: 'dev.sys@email.com',
      subject: 'Aviso de férias',
      html,
    });
  }
}

export { SendMailVacationConsumer };
