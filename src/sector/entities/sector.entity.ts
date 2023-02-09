import { Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity()
export class Sector {
  @ObjectIdColumn()
  _id: string;

  @Column({ nullable: false })
  description: string;

  @Column({ nullable: false })
  responsible: string[];

  @Column({ nullable: false, default: new Date() })
  created_at: Date;
}
