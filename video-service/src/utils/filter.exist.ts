export async function filterExistingIds(
  ids: number[] | undefined,
  findFn: (id: number) => Promise<any>,
): Promise<number[]> {
  if (!ids?.length) return [];

  const checks = await Promise.all(
    ids.map(async (id) => {
      const entity = await findFn(id);
      return entity ? id : null;
    }),
  );

  return checks.filter((id): id is number => id !== null);
}
