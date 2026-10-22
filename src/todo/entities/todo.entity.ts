import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
<<<<<<< Updated upstream
  PrimaryColumn,
=======
  PrimaryGeneratedColumn,
  UpdateDateColumn,
>>>>>>> Stashed changes
} from 'typeorm';
import { TodoStatusEnum } from '../enums/todo-status.enum.js';

@Entity('todo')
export class TodoEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @CreateDateColumn({ update: false })
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({
    type: 'enum',
    enum: TodoStatusEnum,
    default: TodoStatusEnum.waiting,
  })
  status: TodoStatusEnum;
}
