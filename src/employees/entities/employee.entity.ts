import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectID,
  ObjectIdColumn,
} from 'typeorm';

@Entity('employees')
export class Employee {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  departmentId: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  isManager: boolean;

  @Column()
  onVacation: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
