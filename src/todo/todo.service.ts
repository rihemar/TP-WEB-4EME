import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UUID_GENERATOR } from '../common/common.module.js';
import { CreateTodoDto } from './dto/create-todo.dto.js';
import { TodoDto } from './dto/todo.dto.js';
import { UpdateTodoDto } from './dto/update-todo.dto.js';
import { TodoStatusEnum } from './enums/todo-status.enum.js';
import { TodoEntity } from './entities/todo.entity.js';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoEntity)
    private readonly todoRepository: Repository<TodoEntity>,
    @Inject(UUID_GENERATOR) private readonly generateUuid: () => string,
  ) {}

  async create(createTodoDto: CreateTodoDto): Promise<TodoDto> {
    const todo = this.todoRepository.create({
      id: this.generateUuid(),
      name: createTodoDto.name,
      description: createTodoDto.description,
      status: createTodoDto.status ?? TodoStatusEnum.waiting,
    });

    return Object.assign(new TodoDto(), await this.todoRepository.save(todo));
  }

  async update(id: string, updateTodoDto: UpdateTodoDto): Promise<TodoDto> {
    const existingTodo = await this.todoRepository.findOneBy({ id });

    if (!existingTodo) {
      throw new NotFoundException(`Todo with id "${id}" was not found.`);
    }

    const changes = Object.fromEntries(
      Object.entries(updateTodoDto).filter(([, value]) => value !== undefined),
    );
    Object.assign(existingTodo, changes);
    return Object.assign(
      new TodoDto(),
      await this.todoRepository.save(existingTodo),
    );
  }

  async delete(id: string): Promise<void> {
    const result = await this.todoRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Todo with id "${id}" was not found.`);
    }
  }

  async softDelete(id: string): Promise<void> {
    const result = await this.todoRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Todo with id "${id}" was not found.`);
    }
  }

  async restore(id: string): Promise<void> {
    const result = await this.todoRepository.restore(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Deleted todo with id "${id}" was not found.`);
    }
  }
}
