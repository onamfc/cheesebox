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
