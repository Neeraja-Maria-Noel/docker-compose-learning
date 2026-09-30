import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TodosService } from './todos.service';

type TodoBody = {
  title?: unknown;
  completed?: unknown;
};

@Controller('todos')
export class TodosController {
  constructor(private readonly todos: TodosService) {}

  @Get()
  findAll() {
    return this.todos.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.todos.findOne(parseTodoId(id));
  }

  @Post()
  create(@Body() body: TodoBody) {
    return this.todos.create(readRequiredTitle(body.title));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: TodoBody) {
    const data: { title?: string; completed?: boolean } = {};

    if ('title' in body) {
      data.title = readRequiredTitle(body.title);
    }

    if ('completed' in body) {
      if (typeof body.completed !== 'boolean') {
        throw new BadRequestException('completed must be a boolean');
      }

      data.completed = body.completed;
    }

    if (data.title === undefined && data.completed === undefined) {
      throw new BadRequestException('Nothing to update');
    }

    return this.todos.update(parseTodoId(id), data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.todos.remove(parseTodoId(id));
    return { deleted: true };
  }
}

function parseTodoId(id: string) {
  const parsed = Number(id);

  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new BadRequestException('id must be a positive integer');
  }

  return parsed;
}

function readRequiredTitle(title: unknown) {
  if (typeof title !== 'string' || title.trim() === '') {
    throw new BadRequestException('title is required');
  }

  return title.trim();
}
