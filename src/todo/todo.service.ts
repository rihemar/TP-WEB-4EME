import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UUID_GENERATOR } from '../common/common.module.js';
import { CreateTodoDto } from './dto/create-todo.dto.js';
import { TodoDto } from './dto/todo.dto.js';
import { UpdateTodoDto } from './dto/update-todo.dto.js';
import { TodoStatusEnum } from './enums/todo-status.enum.js';
import { TodoEntity } from './entities/todo.entity.js';

@Injectable()
export class TodoService {
  private readonly todos = new Map<string, TodoDto>();

  constructor(
    @Inject(UUID_GENERATOR) private readonly generateUuid: () => string,
  ) {}

  create(createTodoDto: CreateTodoDto): TodoDto {
    const todo = Object.assign(new TodoEntity(), {
      id: this.generateUuid(),
      name: createTodoDto.name,
      description: createTodoDto.description,
      createdAt: new Date(),
      status: createTodoDto.status ?? TodoStatusEnum.waiting,
    });

    const result = Object.assign(new TodoDto(), todo);
    this.todos.set(result.id, result);
    return result;
  }

  update(id: string, updateTodoDto: UpdateTodoDto): TodoDto {
    const existingTodo = this.todos.get(id);

    if (!existingTodo) {
      throw new NotFoundException(`Todo with id "${id}" was not found.`);
    }

    const changes = Object.fromEntries(
      Object.entries(updateTodoDto).filter(([, value]) => value !== undefined),
    );
    const updatedTodo = Object.assign(new TodoDto(), existingTodo, changes);
    this.todos.set(id, updatedTodo);
    return updatedTodo;
  }
}
