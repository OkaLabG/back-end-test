import { Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity()
export class Employees {
  @ObjectIdColumn()
  _id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  document: string;

  @Column({ nullable: false })
  zip_code: string;

  @Column({ nullable: false })
  birth_date: Date;

  @Column({ nullable: true })
  sector: string | undefined;

  @Column()
  created_at: Date;

  @Column({ default: false })
  vacation: boolean | null;

  @Column({ nullable: true })
  responsible: boolean;
}
