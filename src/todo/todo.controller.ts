import {
  Body,
  Controller,
  Delete,
  Post,
  Param,
  Patch,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto.js';
import { TodoDto } from './dto/todo.dto.js';
import { UpdateTodoDto } from './dto/update-todo.dto.js';
import { TodoService } from './todo.service.js';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  createTodo(@Body() createTodoDto: CreateTodoDto): TodoDto {
    return this.todoService.create(createTodoDto);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  updateTodo(
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
  ): TodoDto {
    return this.todoService.update(id, updateTodoDto);
  }

  @Delete(':id')
  softDeleteTodo(@Param('id') id: string): TodoDto {
    return this.todoService.softDelete(id);
  }

  @Patch(':id/recover')
  recoverTodo(@Param('id') id: string): TodoDto {
    return this.todoService.recover(id);
  }
}
