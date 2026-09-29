import * as z from "zod";

export const SOURCES = ["GOODREADS", "ROYALROAD"] as const;

export const MetadataSchema = z.object({
  source: z.enum(SOURCES, { error: "Source is Required" }),
  sourceId: z.string().min(1, { error: "SourceID is required" }),
});

export type MetadataInput = z.infer<typeof MetadataSchema>;