import { Module } from '@nestjs/common';
import { SectorModule } from './sector/sector.module';
import { UsersModule } from './users/users.module';
import { EmployeesModule } from './employees/employees.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { VacationModule } from './vacation/vacation.module';
import { NestModule } from '@nestjs/common';
import { MiddlewareConsumer } from '@nestjs/common';
import { AuthMiddleware } from './middleware/auth.middleware';
import { SessionsModule } from './sessions/sessions.module';
import { Users } from './users/entities/user.entity';

@Module({
  imports: [
    SectorModule,
    UsersModule,
    EmployeesModule,
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: 'mongodb://mongo-devsys:d3vsys@192.168.3.43:27017/',
      // host: 'localhost',
      // port: 27017,
      // username: 'mongo-devsys',
      // password: 'd3vsys',
      // database: 'devsys-dev',
      // synchronize: true,
      entities: [join(__dirname, '**/**.entity{.ts,.js}')],
      // useNewUrlParser: true,
      // logging: true,
    }),
    VacationModule,
    SessionsModule,
    TypeOrmModule.forFeature([Users]),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes('users', 'vacation', 'sector', 'employees');
  }
}
