import type { MetadataInput } from "@/lib/schemas/metadata-schema";
import { ApiError } from "@/service/api-error";
import type { ApiResponseError } from "@/types/api";
import type { Metadata } from "@/types/metadata";

export const extractMetadata = async (input: MetadataInput): Promise<Metadata> => {
  const { source, sourceId } = input;

  const url = `${import.meta.env.VITE_PARSECT_URL}/epub/metadata/${source}/${sourceId}`;

  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(input)
  });

  if (!res.ok) {
    const data: ApiResponseError = await res.json();
    throw new ApiError(data);
  }

  return res.json() as Promise<Metadata>;
}