import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  phone: string;

  @Column({ default: 'customer' })
  role: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;
}
