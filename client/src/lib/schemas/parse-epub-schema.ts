import * as z from "zod";

const ACCEPTED_MEDIA_TYPES = ["application/epub+zip"]

export const ParseEpubSchema = z.object({
  file: z
    .file({ error: "File is required" })
    .mime(ACCEPTED_MEDIA_TYPES, { error: `Accepted Media types are: [${ACCEPTED_MEDIA_TYPES}]` }),
});

export type ParseEpubInput = z.infer<typeof ParseEpubSchema>;