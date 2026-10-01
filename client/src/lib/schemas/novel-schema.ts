import * as z from "zod";
import { STATUSES } from "../utils/constants";
import { ChapterSchema } from "./chapter-schema";

export const NovelSchema = z.object({
  title: z
    .string()
    .min(3, {
      error: "Title must be at least 3 characters long"
    }),
  alias: z
    .string()
    .min(2, { error: "Alias should have at least 2 character" })
    .optional()
    .or(z.literal('')).transform(val => val === "" ? undefined : val),
  author: z
    .string()
    .min(1, {
      error: "Title must be at least 1 character long"
    })
    ,
  status: z
    .enum(STATUSES),
  description: z
    .string()
    .min(1, {
      error: "Description must be at least 1 character long",
    }),
  genres: z
    .array(z.object({ name: z.string().min(1, { error: "Genre must be at least 1 character long" }) }))
    .min(1, {
      error: "Must have at leat 1 genre",
    }),
  tags: z
    .array(z.object({ name: z.string().min(1, { error: "Tag must be at least 1 character long" }) }))
    .min(1, {
      error: "Must have at leat 1 genre",
    }),
  chapters: z.array(ChapterSchema)
    .min(1, { error: "Must have at least one chapter" })
}).transform(value => ({
  ...value,
  tags: value.tags.map(t => t.name),
  genres: value.genres.map(g => g.name),
  chapters: value.chapters.map((c, i) => ({ ...c, number: i + 1 })),
}));

export type NovelFormInput = z.input<typeof NovelSchema>;
export type NovelInput = z.output<typeof NovelSchema>;
