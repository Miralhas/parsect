import { Button } from "@/components/ui/button";
import {
  Field
} from "@/components/ui/field";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/toast";
import { useParserProvider } from "@/contexts/parser-context";
import type { ChapterList } from "@/lib/schemas/chapter-schema";
import { NovelSchema, type NovelFormInput, type NovelInput } from "@/lib/schemas/novel-schema";
import { isApiError } from "@/lib/utils/common-utils";
import { useBookUploader } from "@/service/book/mutation/use-book-uploader";
import { useCoverUploader } from "@/service/book/mutation/use-cover-uploader";
import type { Metadata } from "@/types/metadata";
import type { NovelSummary } from "@/types/novel";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import ChaptersTabForm from "./chapters-tab";
import MetadataTabForm from "./metadata-tab";
import ReaderTab from "./reader-tab";

// eslint-disable-next-line
export const toDefault = (
  chapters?: ChapterList,
  metadata?: Omit<Metadata, 'image_b64'>,
): NovelFormInput => {
  return {
    title: metadata?.title ?? "",
    alias: metadata?.alias ?? "",
    author: metadata?.author ?? "",
    status: metadata?.status ?? "COMPLETED",
    description: metadata?.description ?? "",
    genres: metadata?.genres?.map((name) => ({ name })) ?? [],
    tags: metadata?.tags?.map((name) => ({ name })) ?? [],
    chapters: chapters ?? [],
  }
}

const NovelForm = () => {
  const { chapters, metadata } = useParserProvider();
  const [coverBlob, setCoverBlob] = useState<Blob | null>(null);
  const [tab, setTab] = useState<'metadata' | 'chapters' | 'reader'>('chapters');
  const coverMutation = useCoverUploader();
  const bookMutation = useBookUploader();

  const form = useForm<NovelFormInput, unknown, NovelInput>({
    resolver: zodResolver(NovelSchema),
    defaultValues: toDefault(chapters, metadata),
  });

  const handleBlob = (blob: Blob | null) => {
    setCoverBlob(blob);
  }

  const onError = (errors: typeof form.formState.errors) => {
    const { chapters: chapterErrors, ...rest } = errors;
    const hasChapterErrors = !!chapterErrors;
    const hasErrors = !!Object.keys(rest).length;
    if (hasChapterErrors && !hasErrors) return setTab('chapters');
    setTab('metadata');
  };

  const onSuccess = (novel: NovelSummary) => {
    toast.add({
      type: 'success',
      title: "Book uploaded successfully!",
      description: <SuccessDescription novel={novel} />,
      timeout: 0,
    });
    if (coverBlob) {
      const formData = new FormData();
      formData.append("file", coverBlob!, `${novel.slug}-cover.webp`);
      coverMutation.mutate({ formData, slug: novel.slug }, {
        onError: () => {
          toast.add({
            type: 'error',
            title: "Failed to upload book cover!"
          })
        }
      })
    }
  }

  const onUploadError = (error: Error) => {
    if (isApiError(error) && error.errors) {
      Object.entries(error.errors).map(([key, value]) => {
        form.setError(
          key as keyof NovelFormInput,
          {
            type: error.status.toString(),
            message: value,
          });
      });
    }
    toast.add({
      type: 'error',
      title: "Failed to upload book!",
      description: isApiError(error) ? error.detail : error.message,
    })

  }

  const onSubmit = (input: NovelInput) => {
    bookMutation.mutate(input, {
      onSuccess,
      onError: onUploadError,
    });
  }


  const isPending = bookMutation.isPending || coverMutation.isPending;

  return (
    <div className="w-full space-y-2">
      <Tabs value={tab} onValueChange={(v) => setTab(v)}>
        <TabsList className="w-full">
          <TabsTrigger value="metadata">Metadata</TabsTrigger>
          <TabsTrigger value="chapters">Chapters</TabsTrigger>
          <TabsTrigger value="reader">Reader</TabsTrigger>
        </TabsList>
        {tab !== "reader" && (
          <form id="novel-form" className="w-full space-y-2" onSubmit={form.handleSubmit(onSubmit, onError)}>
            <TabsContent value="metadata" className="relative">
              <MetadataTabForm
                form={form}
                metadata={metadata}
                handleBlob={handleBlob}
                isPending={isPending}
              />
            </TabsContent>

            <TabsContent value="chapters" className="relative">
              <ChaptersTabForm form={form} isPending={isPending} chapters={chapters!} />
            </TabsContent>

            <Field className="grid">
              <Button
                type="submit"
                variant="default"
                size="sm"
                form="novel-form"
                disabled={bookMutation.isPending || coverMutation.isPending}
              >
                Submit
              </Button>
            </Field>
          </form>
        )}
        <TabsContent value="reader" className="relative">
          <ReaderTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}

const SuccessDescription = ({ novel }: { novel: NovelSummary }) => {
  return (
    <a
      href={`https://devilsect.com/novels/${novel.slug}`}
      className="underline capitalize"
      target="_blank"
    >
      {novel.title}
    </a>
  )
}

export default NovelForm;