import type { NovelInput } from "@/lib/schemas/novel-schema";
import { ApiError } from "@/service/api-error";
import type { ApiResponseError } from "@/types/api";

export const postBook = async (input: NovelInput): Promise<void> => {
  const url = `${import.meta.env.VITE_PARSECT_URL}/book`;

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  console.log(input);
  
  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(input),
    headers: myHeaders,
  });

  if (!res.ok) {
    const data: ApiResponseError = await res.json();
    throw new ApiError(data);
  }

  return res.json() as Promise<void>;
}