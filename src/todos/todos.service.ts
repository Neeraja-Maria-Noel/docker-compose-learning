import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

type TodoUpdate = {
  title?: string;
  completed?: boolean;
};

@Injectable()
export class TodosService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.todo.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: number) {
    return this.fromExistingTodo(
      this.prisma.todo.findUniqueOrThrow({
        where: { id },
      }),
    );
  }

  create(title: string) {
    return this.prisma.todo.create({
      data: { title: title.trim() },
    });
  }

  update(id: number, data: TodoUpdate) {
    return this.fromExistingTodo(
      this.prisma.todo.update({
        where: { id },
        data,
      }),
    );
  }

  async remove(id: number) {
    await this.fromExistingTodo(
      this.prisma.todo.delete({
        where: { id },
      }),
    );
  }

  private async fromExistingTodo<T>(operation: Promise<T>) {
    try {
      return await operation;
    } catch (error: unknown) {
      if (this.isRecordNotFound(error)) {
        throw new NotFoundException('Todo not found');
      }

      throw error;
    }
  }

  private isRecordNotFound(error: unknown) {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'P2025'
    );
  }
}
