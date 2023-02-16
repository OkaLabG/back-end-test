import { Column, CreateDateColumn, Entity, ObjectIdColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('employees')
export class Employee {
  @ObjectIdColumn()
  _id: string;

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

  constructor() {
    if (!this._id) {
      this._id = uuidv4();
    }
  }
}
