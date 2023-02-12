import { Column, CreateDateColumn, Entity, ObjectIdColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('departments')
export class Department {
  @ObjectIdColumn()
  _id: string;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  constructor(department?: Partial<Department>) {
    if (!this._id) {
      this._id = uuidv4();
    }

    this._id = department?._id;
    this.createdAt = department?.createdAt;
    this.name = department?.name;
  }
}
