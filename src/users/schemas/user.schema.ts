import { Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity()
export class Usersdsada {
  @ObjectIdColumn()
  _id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  document: string;

  @Column({ default: new Date() })
  created_at: Date;

  @Column({ nullable: false })
  user_name: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false })
  email: string;
}
