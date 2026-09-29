import { useMutation, useQueryClient } from "@tanstack/react-query";
import { parseEpub } from "../api/parse-epub";
import { epubKeys } from "../queries/query-keys";

export const useParseEpub = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: parseEpub,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: epubKeys.all });
    }
  });
}