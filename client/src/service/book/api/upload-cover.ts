import { ApiError } from "@/service/api-error";
import type { ApiResponseError } from "@/types/api";

export const uploadCover = async (formData: FormData, slug: string): Promise<void> => {
  const url = `${import.meta.env.VITE_PARSECT_URL}/book/${slug}/cover`;

  const res = await fetch(url, {
    method: "POST",
    body: formData
  });

  if (!res.ok) {
    const data: ApiResponseError = await res.json();
    throw new ApiError(data);
  }
}