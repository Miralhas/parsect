import { useMutation } from "@tanstack/react-query";
import { postBook } from "../api/post-book";

export const useBookUploader = () => {
  return useMutation({
    mutationFn: postBook,
  });
}