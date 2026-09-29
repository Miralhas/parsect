import { ApiError } from "@/service/api-error";
import type { ApiResponseError } from "@/types/api";
import type { Chapter } from "@/types/chapter";

export const parseEpub = async (formData: FormData): Promise<Chapter[]> => {
  const url = `${import.meta.env.VITE_PARSECT_URL}/epub/parse`;

  const res = await fetch(url, {
    method: "POST",
    body: formData
  });

  if (!res.ok) {
    const data: ApiResponseError = await res.json();
    throw new ApiError(data);
  }

  return res.json() as Promise<Chapter[]>;
}