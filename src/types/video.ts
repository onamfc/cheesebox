export enum SortOption {
  NEWEST = "newest",
  OLDEST = "oldest",
  A_TO_Z = "a-z",
  Z_TO_A = "z-a",
}

export function isSortOption(value: string): value is SortOption {
  return Object.values(SortOption).includes(value as SortOption);
}
/**
 * Video visibility type - ORM-agnostic definition
 *
 * This provides a single source of truth for video visibility values,
 * independent of the database ORM (Prisma, Drizzle, etc.)
 */
export const VideoVisibility = {
  PUBLIC: "PUBLIC",
  PRIVATE: "PRIVATE",
} as const;

export type VideoVisibility =
  (typeof VideoVisibility)[keyof typeof VideoVisibility];
