import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectID,
  ObjectIdColumn,
} from 'typeorm';

@Entity('departments')
export class Department {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;
}
