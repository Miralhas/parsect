import { useMutation, useQueryClient } from "@tanstack/react-query";
import { extractMetadata } from "../api/extract-metadata";
import { epubKeys } from "../queries/query-keys";

export const useMetadataExtractor = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: extractMetadata,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: epubKeys.all });
    }
  });
}