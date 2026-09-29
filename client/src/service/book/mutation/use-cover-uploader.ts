import { useMutation } from "@tanstack/react-query";
import { uploadCover } from "../api/upload-cover";

type Args = {
  formData: FormData;
  slug: string;
}

export const useCoverUploader = () => {
  return useMutation({
    mutationFn: ({formData, slug}: Args) => uploadCover(formData, slug),
  });
}