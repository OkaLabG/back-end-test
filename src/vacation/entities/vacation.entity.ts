import { Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity()
export class Vacation {
  @ObjectIdColumn()
  _id: string;

  @Column()
  employee: string;

  @Column()
  start_date: Date;

  @Column()
  end_date: Date;
}
