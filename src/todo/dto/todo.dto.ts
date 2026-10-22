import { TodoStatusEnum } from '../enums/todo-status.enum.js';

export class TodoDto {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  deletedAt: Date | null;
  status: TodoStatusEnum;
}
