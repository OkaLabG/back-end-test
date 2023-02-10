import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Department } from 'src/app/departments/entities/department.entity';
import { Employee } from 'src/app/employees/entities/employee.entity';
import { User } from 'src/app/users/entities/user.entity';

export default {
  type: 'mongodb',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  entities: [Employee, Department, User],
  synchronize: true,
  useUnifiedTopology: true,
  autoLoadEntities: true,
  logging: true,
} as TypeOrmModuleOptions;
