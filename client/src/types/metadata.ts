import type { STATUSES } from "@/lib/utils/constants";

export type BookStatus = typeof STATUSES[number];

export type Metadata = {
  title: string;
  author: string;
  status: BookStatus;
  description: string;
  alias?: string;
  tags: string[];
  genres: string[];
  image_b64: string;
}