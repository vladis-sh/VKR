// Re-upserts live coding task payloads from prisma/legacy-content/liveCoding.ts
// into the content_entries table without touching the rest of the seed data
// (the full seed also creates sample users/sessions and would duplicate them).
//
// Usage: npx ts-node prisma/refresh-live-coding.ts
import { ContentEntryType, ContentOrigin, Prisma, PrismaClient } from '@prisma/client';
import { LIVE_CODING_TASKS } from './legacy-content/liveCoding';

const prisma = new PrismaClient();

async function main() {
  for (const task of LIVE_CODING_TASKS) {
    await prisma.contentEntry.upsert({
      where: {
        type_slug: { type: ContentEntryType.live_coding_task, slug: task.slug },
      },
      update: {
        title: task.title,
        payload: task as unknown as Prisma.InputJsonValue,
        isPublished: true,
        deletedAt: null,
      },
      create: {
        type: ContentEntryType.live_coding_task,
        slug: task.slug,
        title: task.title,
        payload: task as unknown as Prisma.InputJsonValue,
        origin: ContentOrigin.seed,
        isPublished: true,
      },
    });
  }
  console.log(`Refreshed ${LIVE_CODING_TASKS.length} live coding tasks`);

  // Soft-delete seed tasks that were removed from LIVE_CODING_TASKS so they
  // disappear from the app without touching admin-created entries.
  const pruned = await prisma.contentEntry.updateMany({
    where: {
      type: ContentEntryType.live_coding_task,
      origin: ContentOrigin.seed,
      deletedAt: null,
      slug: { notIn: LIVE_CODING_TASKS.map((task) => task.slug) },
    },
    data: { deletedAt: new Date(), isPublished: false },
  });
  if (pruned.count > 0) {
    console.log(`Soft-deleted ${pruned.count} stale live coding tasks`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
