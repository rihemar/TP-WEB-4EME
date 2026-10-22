import { Column, Entity, PrimaryColumn } from 'typeorm';
import { TimestampEntity } from '../../common/entities/timestamp.entity.js';
import { TodoStatusEnum } from '../enums/todo-status.enum.js';

@Entity('todo')
export class TodoEntity extends TimestampEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: TodoStatusEnum,
    default: TodoStatusEnum.waiting,
  })
  status: TodoStatusEnum;
}
