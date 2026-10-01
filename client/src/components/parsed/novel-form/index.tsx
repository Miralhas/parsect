import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupInput
} from "@/components/ui/input-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { useParserProvider, type PartialNovel } from "@/contexts/parser-context";
import { useMultiSelect } from "@/hooks/use-multi-select";
import { NovelSchema, type NovelFormInput, type NovelInput } from "@/lib/schemas/novel-schema";
import { isApiError } from "@/lib/utils/common-utils";
import { useBookUploader } from "@/service/book/mutation/use-book-uploader";
import { useCoverUploader } from "@/service/book/mutation/use-cover-uploader";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, ImageIcon, XIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";

const initialMetadata: Omit<NovelInput, "chapters"> = {
  title: "",
  alias: "",
  author: "",
  status: "COMPLETED",
  description: "",
  genres: [],
  tags: [],
}

const toNovelFormInput = (novel?: PartialNovel): NovelFormInput => ({
  title: novel?.title ?? "",
  alias: novel?.alias ?? "",
  author: novel?.author ?? "",
  status: novel?.status ?? "COMPLETED",
  description: novel?.description ?? "",
  genres: novel?.genres?.map((name) => ({ name })) ?? [],
  tags: novel?.tags?.map((name) => ({ name })) ?? [],
  chapters: novel?.chapters ?? [],
});

const NovelForm = () => {
  const { novel } = useParserProvider();
  const [showChapterBody, setShowChapterBody] = useState<number | undefined>();
  const [coverBlob, setCoverBlob] = useState<Blob | null>(null);
  const [tab, setTab] = useState<'metadata' | 'chapters'>('chapters');
  const coverMutation = useCoverUploader();
  const bookMutation = useBookUploader();

  const form = useForm<NovelFormInput, unknown, NovelInput>({
    resolver: zodResolver(NovelSchema),
    defaultValues: toNovelFormInput(novel)
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "chapters",
  });

  const rows = Array.from({ length: fields.length }, (_, i) => i);
  const { handleMultiSelect, setSelected, selected } = useMultiSelect({ rows });

  const genresFieldArray = useFieldArray({
    control: form.control,
    name: "genres",
  });

  const tagsFieldArray = useFieldArray({
    control: form.control,
    name: "tags",
  });

  const handleCover = async (image: HTMLImageElement) => {
    if (!image.complete || image.naturalWidth === 0) {
      return;
    }

    const offscreen = new OffscreenCanvas(
      image.naturalWidth,
      image.naturalHeight
    );

    const ctx = offscreen.getContext("2d");

    if (!ctx) {
      throw new Error("No 2d context");
    }

    ctx.drawImage(image, 0, 0);

    const blob = await offscreen.convertToBlob({
      type: "image/webp",
      quality: 0.75,
    });

    setCoverBlob(blob);
  };

  const resetChapters = useCallback(() => {
    if (!novel) return;
    form.setValue("chapters", novel.chapters as NovelInput["chapters"]);
  }, [form, novel]);

  const resetMetadata = useCallback(() => {
    if (!novel) return;
    const chapters = form.getValues('chapters') as NovelInput["chapters"]
    form.reset(toNovelFormInput({
      ...initialMetadata,
      chapters: chapters
    }));

  }, [form, novel])

  const updateMetadata = useCallback(() => {
    if (!novel) return;
    const chapters = form.getValues('chapters') as NovelInput["chapters"]
    form.reset(toNovelFormInput({
      ...novel,
      chapters: chapters
    }));
  }, [form, novel])

  useEffect(() => {
    if (!novel) return;
    updateMetadata()
  }, [novel, updateMetadata]);


  const onError = (errors: typeof form.formState.errors) => {
    const { chapters: chapterErrors, ...rest } = errors;
    const hasChapterErrors = !!chapterErrors;
    const hasErrors = !!Object.keys(rest).length;
    if (hasChapterErrors && !hasErrors) setTab('chapters');
  };

  const onSubmit = (input: NovelInput) => {
    bookMutation.mutate(input, {
      onSuccess: (novel) => {
        toast.add({
          type: 'success',
          title: "Book uploaded successfully!",
          description: (
            <a
              href={`https://devilsect.com/novels/${novel.slug}`}
              className="underline capitalize"
              target="_blank"
            >
              {novel.title}
            </a>
          ),
        });
        if (coverBlob) {
          const formData = new FormData();
          formData.append("file", coverBlob!, `${input.title}-cover.webp`);
          coverMutation.mutate({ formData, slug: novel.slug }, {
            onError: () => {
              toast.add({
                type: 'error',
                title: "Failed to upload book cover!"
              })
            }
          })
        }
      },
      onError: (err) => {
        toast.add({
          type: 'error',
          title: "Failed to upload book!",
          description: isApiError(err) ? err.detail : err.message,
        })
      }
    });
  }

  const handleShowChapterBody = (index: number | undefined) => {
    if (index === showChapterBody) return setShowChapterBody(undefined);
    setShowChapterBody(index);
  }

  // const handleSelect = (to: number, e: ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
  //   const from = Array.from(selectedChapters).pop() ?? 0;
  //   // @ts-expect-error shiftKey is defined for click events
  //   if (e.nativeEvent.shiftKey) {
  //     const rows = Array.from({ length: fields.length }, (_, i) => i);
  //     const rowsToToggle = [...getRowRange(rows, to, from).filter(c => !selectedChapters.includes(c)), from];
  //     setSelectedChapters(rowsToToggle);
  //     return;
  //   }
  //   const isChecked = selectedChapters.some(c => c === to);
  //   setSelectedChapters(prev => isChecked ? [...prev.filter(c => c !== to)] : [...prev, to]);
  // };

  const handleMultiRemove = () => {
    remove(selected);
    setSelected([]);
    handleShowChapterBody(undefined)
  }

  const isPending = bookMutation.isPending || coverMutation.isPending;

  return (
    <form id="novel-form" className="w-full space-y-4" onSubmit={form.handleSubmit(onSubmit, onError)}>
      <Tabs value={tab} onValueChange={(v) => setTab(v)}>
        <TabsList className="w-full">
          <TabsTrigger value="metadata">Metadata</TabsTrigger>
          <TabsTrigger value="chapters">Chapters</TabsTrigger>
        </TabsList>

        <TabsContent value="metadata">
          <FieldSet className="gap-4">
            <FieldGroup className="gap-4">
              <div className="grid grid-cols-[0.1fr_1fr] gap-2">
                <div className="col-span-1">
                  <div className="w-22 h-[132px] border relative flex items-center justify-center">
                    <ImageIcon className="absolute z-[1] text-muted-foreground" />
                    <img
                      className="object-cover w-full h-full absolute inset-0 z-10"
                      src={`data:image/*;base64,${novel?.image_b64}`}
                      onLoad={(event) => handleCover(event.currentTarget)}
                    />
                  </div>
                </div>
                <div className="col-span-1 flex flex-col justify-between">
                  <Controller
                    name="title"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid} className="gap-1">
                        <FieldLabel htmlFor="novel-form-title">
                          Book title
                        </FieldLabel>
                        <Input
                          {...field}
                          id="novel-form-title"
                          aria-invalid={fieldState.invalid}
                          placeholder="Red Rising"
                          autoComplete="off"
                          disabled={isPending}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <Controller
                      name="alias"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className="gap-1">
                          <FieldLabel htmlFor="novel-form-alias">
                            Book alias
                          </FieldLabel>
                          <Input
                            {...field}
                            // value={field.value ?? undefined}
                            id="novel-form-alias"
                            aria-invalid={fieldState.invalid}
                            placeholder="Red Rising Saga #1"
                            autoComplete="off"
                            disabled={isPending}
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name="author"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className="gap-1">
                          <FieldLabel htmlFor="novel-form-author">
                            Book author
                          </FieldLabel>
                          <Input
                            {...field}
                            id="novel-form-author"
                            aria-invalid={fieldState.invalid}
                            placeholder="Author"
                            autoComplete="off"
                            disabled={isPending}
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </div>
                </div>
              </div>

              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="gap-1">
                    <FieldLabel htmlFor="novel-form-description">
                      Book description
                    </FieldLabel>
                    <Textarea
                      {...field}
                      id={`novel-form-description`}
                      aria-invalid={fieldState.invalid}
                      placeholder="Book description - <p>...</p>"
                      rows={3}
                      disabled={isPending}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <FieldSet className="gap-1.25 m-0 p-0">
                <FieldLegend data-invalid={Boolean(form.formState.errors.genres)} variant="label">Book genres</FieldLegend>
                <FieldGroup className="gap-1">
                  {genresFieldArray.fields.map((field, index) => (
                    <Controller
                      key={field.id}
                      name={`genres.${index}.name`}
                      control={form.control}
                      render={({ field: controllerField, fieldState }) => (
                        <Field
                          orientation="responsive"
                          data-invalid={fieldState.invalid}
                        >
                          <FieldContent>
                            <InputGroup>
                              <InputGroupInput
                                {...controllerField}
                                id={`novel-form-genre-${index}`}
                                aria-invalid={fieldState.invalid}
                                placeholder="fantasy"
                                type="text"
                                autoComplete="off"
                                disabled={isPending}
                              />
                              <Button
                                variant="link"
                                type="button"
                                className="text-muted-foreground group"
                                onClick={() => genresFieldArray.remove(index)}
                                aria-label={`Remove chapter ${index + 1}`}
                              >
                                <XIcon className="group-hover:text-red-800/90" />
                              </Button>
                            </InputGroup>
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </FieldContent>
                        </Field>
                      )}
                    />
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => genresFieldArray.append({ name: "" })}
                  >
                    Add genre
                  </Button>
                </FieldGroup>
                {form.formState.errors.genres && (
                  <FieldError errors={[form.formState.errors.genres]} />
                )}
              </FieldSet>

              <FieldSet className="gap-1.25 m-0 p-0">
                <FieldLegend data-invalid={Boolean(form.formState.errors.tags)} variant="label">Book tags</FieldLegend>
                <FieldGroup className="gap-1">
                  {tagsFieldArray.fields.map((field, index) => (
                    <Controller
                      key={field.id}
                      name={`tags.${index}.name`}
                      control={form.control}
                      render={({ field: controllerField, fieldState }) => (
                        <Field
                          orientation="responsive"
                          data-invalid={fieldState.invalid}
                        >
                          <FieldContent>
                            <InputGroup>
                              <InputGroupInput
                                {...controllerField}
                                id={`novel-form-tag-${index}`}
                                aria-invalid={fieldState.invalid}
                                placeholder="fantasy"
                                type="text"
                                autoComplete="off"
                                disabled={isPending}
                              />
                              <Button
                                variant="link"
                                type="button"
                                className="text-muted-foreground group"
                                onClick={() => tagsFieldArray.remove(index)}
                                aria-label={`Remove chapter ${index + 1}`}
                              >
                                <XIcon className="group-hover:text-red-800/90" />
                              </Button>
                            </InputGroup>
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </FieldContent>
                        </Field>
                      )}
                    />
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => tagsFieldArray.append({ name: "" })}
                  >
                    Add tag
                  </Button>
                </FieldGroup>
                {form.formState.errors.tags && (
                  <FieldError errors={[form.formState.errors.tags]} />
                )}
              </FieldSet>
            </FieldGroup>
          </FieldSet>
        </TabsContent>

        <TabsContent value="chapters">
          {form.formState.errors.chapters?.root && (
            <FieldError errors={[form.formState.errors.chapters.root]} />
          )}
          <FieldSet className="gap-4">
            <FieldGroup className="gap-0">
              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-[30px_1fr] gap-1.5">
                  <Field orientation="horizontal" className="mb-2">
                    <input
                      type="checkbox"
                      id="terms-checkbox"
                      className="w-full h-8 accent-primary"
                      name="terms-checkbox"
                      checked={selected.some(c => c === index)}
                      onChange={(e) => handleMultiSelect(index, e)}
                    />
                  </Field>
                  <div className="space-y-2 relative flex gap-2">
                    <Controller
                      name={`chapters.${index}.title`}
                      control={form.control}
                      render={({ field: controllerField, fieldState }) => (
                        <Field
                          orientation="horizontal"
                          data-invalid={fieldState.invalid}
                        >
                          <FieldContent>
                            <InputGroup>
                              <InputGroupInput
                                {...controllerField}
                                id={`novel-form-title-${index}`}
                                aria-invalid={fieldState.invalid}
                                placeholder="Add chapter title - Chapter X: Lorem"
                                type="text"
                                autoComplete="off"
                                disabled={isPending}
                              />
                            </InputGroup>
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </FieldContent>
                        </Field>
                      )}
                    />

                    {fields.length > 1 && (
                      <div className="flex gap-2 absolute top-0 right-2">
                        <Button
                          variant="link"
                          type="button"
                          className="text-muted-foreground group p-0 m-0"
                          onClick={() => handleShowChapterBody(index)}
                          aria-label={`Remove chapter ${index + 1}`}
                        >
                          <EyeIcon className="group-hover:text-red-800/90" />
                        </Button>
                        <Button
                          variant="link"
                          type="button"
                          className="text-muted-foreground group p-0 m-0"
                          onClick={() => handleMultiRemove()}
                          aria-label={`Remove chapter ${index + 1}`}
                        >
                          <XIcon className="group-hover:text-red-800/90" />
                        </Button>
                      </div>
                    )}
                  </div>
                  {showChapterBody === index && (
                    <div className="w-full mb-2 col-span-full">
                      <Controller
                        name={`chapters.${index}.body`}
                        control={form.control}
                        render={({ field: controllerField, fieldState }) => (
                          <Field
                            orientation="horizontal"
                            data-invalid={fieldState.invalid}
                          >
                            <FieldContent>
                              <Textarea
                                {...controllerField}
                                id={`novel-form-body-${index}`}
                                aria-invalid={fieldState.invalid}
                                placeholder="Add chapter body - <p>...</p>"
                                rows={12}
                                disabled={isPending}
                              />
                              {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                              )}
                            </FieldContent>
                          </Field>
                        )}
                      />
                    </div>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ title: "", body: "", number: fields.length + 1 })}
              >
                Add Chapter
              </Button>
            </FieldGroup>
          </FieldSet>
        </TabsContent>
      </Tabs>

      <Field className="grid grid-cols-2">
        <Button
          type="submit"
          variant="default"
          size="sm"
          form="novel-form"
          disabled={bookMutation.isPending || coverMutation.isPending}
        >
          Submit
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={tab === "chapters" ? resetChapters : resetMetadata}
        >
          Reset <span className="capitalize">{tab}</span>
        </Button>
      </Field>
    </form>
  )
}

export default NovelForm;