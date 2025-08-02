import { In, ObjectLiteral, Repository } from 'typeorm';

export async function validateEntitiesOrThrow<T extends ObjectLiteral>(
  ids: number[],
  repo: Repository<T>,
  entityName = 'Entity',
): Promise<T[]> {
  const items = await repo.findBy({ id: In(ids) } as any);
  // if (items.length !== ids.length) {
  //   throw new Error(`Some ${entityName} IDs are invalid`);
  // }
  return items;
}
