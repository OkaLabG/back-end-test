import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Department } from 'src/departments/entities/department.entity';
import { Employee } from 'src/employees/entities/employee.entity';

export default {
  type: 'mongodb',
  host: 'mongo',
  port: 27017,
  username: 'root',
  password: 'example',
  entities: [Employee, Department],
  synchronize: true,
  useUnifiedTopology: true,
  autoLoadEntities: true,
  logging: true,
} as TypeOrmModuleOptions;
