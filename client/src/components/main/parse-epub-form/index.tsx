import Dropzone from "@/components/dropzone";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { useParserProvider } from "@/contexts/parser-context";
import { ParseEpubSchema } from "@/lib/schemas/parse-epub-schema";
import { isApiError } from "@/lib/utils/common-utils";
import { useParseEpub } from "@/service/epub/mutations/use-parse-epub";
import { useState } from "react";

const ParseEpubForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const mutation = useParseEpub();
  const { handleChapters, handleEpubBuffer } = useParserProvider();

  const validateFile = (): File | undefined => {
    const result = ParseEpubSchema.safeParse({ file });
    
    if (!result.success) {
      toast.add({ 
          type: "error",
          priority: "high",
          title: "Failed to parse file",
          description: result.error.issues[0].message,
      });
    };

    return result.data?.file;
  }

  const onParse = () => {
    const epub = validateFile();
    if (!epub) return;
    const formData = new FormData();
    formData.append("file", epub, epub.name);
    
    mutation.mutate(formData, {
      onSuccess: async (chapters) => {
        handleChapters(chapters);
        await handleEpubBuffer(epub);
        toast.add({
          type: "success",
          title: "Epub parsed successfully"
        });
      },
      onError: (err) => {
        const description = isApiError(err) ? err.detail : err.message;
        handleChapters(undefined);
        toast.add({ 
          type: "error",
          priority: "high",
          title: "Failed to parse epub",
          description,
        });
      }
    });
  }

  return (
    <div>
      <Dropzone 
        onFileSelected={setFile}
        onRemove={() => handleChapters(undefined)}
        accept="application/epub+zip"
        disabled={mutation.isPending}
      />
      <Button className="mt-2 w-full font-bold" disabled={!file || mutation.isPending} onClick={onParse}>
        {mutation.isPending ? (
          <p className="animate-pulse">Parsing...</p>
        ) : "Parse"}
      </Button>
    </div>
  )
}

export default ParseEpubForm;
