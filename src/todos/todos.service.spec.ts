import { NotFoundException } from '@nestjs/common';
import { TodosService } from './todos.service';

describe('TodosService', () => {
  function createService() {
    const prisma = {
      todo: {
        create: jest.fn(),
        delete: jest.fn(),
        findMany: jest.fn(),
        findUniqueOrThrow: jest.fn(),
        update: jest.fn(),
      },
    };

    return {
      prisma,
      service: new TodosService(prisma as never),
    };
  }

  it('lists todos newest first', async () => {
    const { prisma, service } = createService();
    prisma.todo.findMany.mockResolvedValue([]);

    await expect(service.findAll()).resolves.toEqual([]);

    expect(prisma.todo.findMany).toHaveBeenCalledWith({
      orderBy: { createdAt: 'desc' },
    });
  });

  it('creates a todo with a trimmed title', async () => {
    const { prisma, service } = createService();
    const todo = { id: 1, title: 'Buy milk', completed: false };
    prisma.todo.create.mockResolvedValue(todo);

    await expect(service.create('  Buy milk  ')).resolves.toBe(todo);

    expect(prisma.todo.create).toHaveBeenCalledWith({
      data: { title: 'Buy milk' },
    });
  });

  it('updates a todo by id', async () => {
    const { prisma, service } = createService();
    const todo = { id: 1, title: 'Buy milk', completed: true };
    prisma.todo.update.mockResolvedValue(todo);

    await expect(service.update(1, { completed: true })).resolves.toBe(todo);

    expect(prisma.todo.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { completed: true },
    });
  });

  it('throws NotFoundException when Prisma cannot find a todo', async () => {
    const { prisma, service } = createService();
    prisma.todo.findUniqueOrThrow.mockRejectedValue({ code: 'P2025' });

    await expect(service.findOne(99)).rejects.toBeInstanceOf(NotFoundException);
  });
});
