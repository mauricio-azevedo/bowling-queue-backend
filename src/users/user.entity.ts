import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  phone: string;

  @Column({ default: 'customer' })
  role: string; // You might extend this later for admins

  @CreateDateColumn()
  createdAt: Date;
}
