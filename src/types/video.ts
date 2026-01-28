export enum SortOption {
  NEWEST = "newest",
  OLDEST = "oldest",
  A_TO_Z = "a-z",
  Z_TO_A = "z-a",
}

export function isSortOption(value: string): value is SortOption {
  return Object.values(SortOption).includes(value as SortOption);
}
