import { useMutation } from "@tanstack/react-query";
import { uploadCover } from "../api/upload-cover";

export const useCoverUploader = () => {
  return useMutation({
    mutationFn: uploadCover,
  });
}