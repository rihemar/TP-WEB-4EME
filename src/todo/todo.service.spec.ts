import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CommonModule } from '../common/common.module.js';
import { CreateTodoDto } from './dto/create-todo.dto.js';
import { UpdateTodoDto } from './dto/update-todo.dto.js';
import { TodoEntity } from './entities/todo.entity.js';
import { TodoStatusEnum } from './enums/todo-status.enum.js';
import { TodoService } from './todo.service.js';

describe('TodoService', () => {
  let service: TodoService;
  let repository: {
    create: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
    findOneBy: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
    softDelete: ReturnType<typeof vi.fn>;
    restore: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    repository = {
      create: vi.fn((todo: Partial<TodoEntity>) =>
        Object.assign(new TodoEntity(), todo),
      ),
      save: vi.fn(async (todo: TodoEntity) => todo),
      findOneBy: vi.fn(),
      delete: vi.fn(),
      softDelete: vi.fn(),
      restore: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [CommonModule],
      providers: [
        TodoService,
        {
          provide: getRepositoryToken(TodoEntity),
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get<TodoService>(TodoService);
  });

  it('creates a todo with its UUID and default status', async () => {
    const todo = await service.create(
      Object.assign(new CreateTodoDto(), {
        name: 'Homework',
        description: 'Finish the web assignment',
      }),
    );

    expect(todo.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
    expect(todo.status).toBe(TodoStatusEnum.waiting);
    expect(repository.save).toHaveBeenCalledOnce();
  });

  it('updates an existing todo while preserving omitted fields', async () => {
    const existingTodo = Object.assign(new TodoEntity(), {
      id: 'todo-id',
      name: 'Homework',
      description: 'Finish the web assignment',
      status: TodoStatusEnum.waiting,
    });
    repository.findOneBy.mockResolvedValue(existingTodo);

    const updatedTodo = await service.update(
      existingTodo.id,
      Object.assign(new UpdateTodoDto(), { name: 'Study' }),
    );

    expect(updatedTodo.name).toBe('Study');
    expect(updatedTodo.description).toBe(existingTodo.description);
    expect(repository.save).toHaveBeenCalledWith(existingTodo);
  });

  it('permanently deletes a todo from the database', async () => {
    repository.delete.mockResolvedValue({ affected: 1 });

    await expect(service.delete('todo-id')).resolves.toBeUndefined();
    expect(repository.delete).toHaveBeenCalledWith('todo-id');
  });

  it('throws when the todo to delete does not exist', async () => {
    repository.delete.mockResolvedValue({ affected: 0 });

    await expect(service.delete('missing-id')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('soft deletes a todo from the database', async () => {
    repository.softDelete.mockResolvedValue({ affected: 1 });

    await expect(service.softDelete('todo-id')).resolves.toBeUndefined();
    expect(repository.softDelete).toHaveBeenCalledWith('todo-id');
  });

  it('throws when the todo to soft-delete does not exist', async () => {
    repository.softDelete.mockResolvedValue({ affected: 0 });

    await expect(service.softDelete('missing-id')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('restores a soft-deleted todo in the database', async () => {
    repository.restore.mockResolvedValue({ affected: 1 });

    await expect(service.restore('todo-id')).resolves.toBeUndefined();
    expect(repository.restore).toHaveBeenCalledWith('todo-id');
  });

  it('throws when the soft-deleted todo to restore does not exist', async () => {
    repository.restore.mockResolvedValue({ affected: 0 });

    await expect(service.restore('missing-id')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
