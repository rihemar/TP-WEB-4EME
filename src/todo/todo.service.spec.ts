import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CommonModule } from '../common/common.module.js';
import { CreateTodoDto } from './dto/create-todo.dto.js';
import { UpdateTodoDto } from './dto/update-todo.dto.js';
import { TodoService } from './todo.service.js';

describe('TodoService', () => {
  let service: TodoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CommonModule],
      providers: [TodoService],
    }).compile();

    service = module.get<TodoService>(TodoService);
  });

  it('updates an existing todo while preserving omitted fields', () => {
    const createdTodo = service.create(
      Object.assign(new CreateTodoDto(), {
        name: 'Homework',
        description: 'Finish the web assignment',
      }),
    );

    const updatedTodo = service.update(
      createdTodo.id,
      Object.assign(new UpdateTodoDto(), { name: 'Study' }),
    );

    expect(updatedTodo.id).toBe(createdTodo.id);
    expect(updatedTodo.name).toBe('Study');
    expect(updatedTodo.description).toBe(createdTodo.description);
    expect(updatedTodo.createdAt).toBe(createdTodo.createdAt);
    expect(service.update(createdTodo.id, new UpdateTodoDto())).toEqual(
      updatedTodo,
    );
  });

  it('throws when the todo does not exist', () => {
    expect(() => service.update('missing-id', new UpdateTodoDto())).toThrow(
      NotFoundException,
    );
  });
});
