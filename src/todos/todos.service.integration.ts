import { PrismaService } from '../prisma/prisma.service';
import { TodosService } from './todos.service';

describe('TodosService integration (Prisma + MySQL)', () => {
  const testTitlePrefix = 'integration-test-todo-';
  let prisma: PrismaService | undefined;
  let service: TodosService | undefined;

  beforeAll(async () => {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL must be set to run integration tests');
    }

    prisma = new PrismaService();
    service = new TodosService(prisma);

    await prisma.$connect();
    await cleanupTestTodos();
  });

  afterEach(async () => {
    await cleanupTestTodos();
  });

  afterAll(async () => {
    await prisma?.$disconnect();
  });

  it('creates a todo and reads it back from MySQL', async () => {
    if (!service) {
      throw new Error('TodosService was not initialized');
    }

    const title = `${testTitlePrefix}${Date.now()}`;

    const created = await service.create(title);
    const found = await service.findOne(created.id);

    expect(found).toMatchObject({
      id: created.id,
      title: `${title}-intentional-failure`,
      completed: false,
    });
    expect(found.createdAt).toBeInstanceOf(Date);
    expect(found.updatedAt).toBeInstanceOf(Date);
  });

  async function cleanupTestTodos() {
    if (!prisma) {
      return;
    }

    await prisma.todo.deleteMany({
      where: { title: { startsWith: testTitlePrefix } },
    });
  }
});
