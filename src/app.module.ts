import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeesModule } from './app/employees/employees.module';
import { DepartmentsModule } from './app/departments/departments.module';
import typeOrmConfig from './config';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './app/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(typeOrmConfig),
    EmployeesModule,
    DepartmentsModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
