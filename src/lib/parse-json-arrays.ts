/** Parse Prisma Json fields that store string arrays for learning tasks, etc. */
export function parseStringArray(value: unknown): string[] {
  if (!value) return [];
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string" && item.length > 0);
}
