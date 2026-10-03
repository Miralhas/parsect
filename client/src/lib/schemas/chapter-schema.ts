import * as z from "zod";

export const ChapterSchema = z.object({
  title: z.string().min(1, { message: "Chapter title is required" }),
  body: z.string().min(1, { message: "Chapter body is required" }),
  number: z.coerce.number().optional(),
});

export const ChapterArraySchema = z.array(ChapterSchema)
  .min(1, { error: "Must have at least one chapter" }).
  transform(value => value.map((c, i) => ({ ...c, number: i + 1 })))

export type ChapterList = z.infer<typeof ChapterArraySchema>;
export type ChapterInput = z.infer<typeof ChapterSchema>;