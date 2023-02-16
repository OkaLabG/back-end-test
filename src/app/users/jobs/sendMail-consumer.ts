import { MailerService } from '@nestjs-modules/mailer';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Department } from 'src/app/departments/entities/department.entity';
import { Employee } from 'src/app/employees/entities/employee.entity';
import { User } from '../entities/user.entity';

@Processor('sendMail-queue')
class SendMailConsumer {
  constructor(private mailService: MailerService) {}

  @Process('sendMail-job')
  async sendMailJob(
    job: Job<{ user: User; employees: Employee[]; department: Department }>,
  ) {
    const { data } = job;

    const { employees, user, department } = data;

    const html = `
    <h1>Olá ${user.name}!</h1>
    <h2>Situação dos funcionários</h2>
    <h3>Departamento: ${department.name}</h3>
    <ul>
      ${employees.map((employee) => {
        return `<li>${employee.name}/${
          employee.isManager ? 'Gerente' : 'Funcionário'
        } - ${employee.email} - ${
          employee.onVacation ? '<b>Está de férias</b>' : 'Não está de férias'
        }</li>`;
      })}
    </ul>
    `;

    await this.mailService.sendMail({
      to: user.email,
      from: 'dev.sys@email.com',
      subject: 'Relatório de funcionários',
      html,
    });
  }
}

export { SendMailConsumer };
