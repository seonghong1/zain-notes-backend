import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoDto } from './dto/todo.dto';
import { AuthGuard } from '../auth/auth.guard';
import { User } from '../auth/user.decorator';

@Controller('todos')
@UseGuards(AuthGuard)
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  create(
    @Body() createTodoDto: CreateTodoDto,
    @User('sub') userId: number,
  ): Promise<TodoDto> {
    return this.todoService.create(createTodoDto, userId);
  }

  @Get()
  findAll(
    @User('sub') userId: number,
    @Query('date') date?: string,
  ): Promise<TodoDto[]> {
    return this.todoService.findAll(userId, { date });
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
    @User('sub') userId: number,
  ): Promise<TodoDto> {
    return this.todoService.update(Number(id), updateTodoDto, userId);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @User('sub') userId: number,
  ): Promise<TodoDto> {
    return this.todoService.remove(Number(id), userId);
  }
}
