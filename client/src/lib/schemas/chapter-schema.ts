import * as z from "zod";

export const ChapterSchema = z.object({
  title: z.string().min(1, { message: "Chapter title is required" }),
  body: z.string().min(1, { message: "Chapter body is required" }),
  number: z.coerce.number().optional(),
});

export type ChapterInput = z.infer<typeof ChapterSchema>;