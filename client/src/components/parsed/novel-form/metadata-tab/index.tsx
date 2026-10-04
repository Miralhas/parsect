import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Textarea } from "@/components/ui/textarea";
import { type NovelFormInput, type NovelInput } from "@/lib/schemas/novel-schema";
import type { Metadata } from "@/types/metadata";
import { XIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Controller, useFieldArray, type UseFormReturn } from "react-hook-form";
import { toDefault } from "..";
import NovelImage from "./novel-image";

type Props = {
  form: UseFormReturn<NovelFormInput, unknown, NovelInput>;
  isPending: boolean;
  handleBlob: (blob: Blob | null) => void;
  metadata?: Metadata
}

const initialMetadata: Omit<NovelInput, "chapters"> = {
  title: "",
  alias: "",
  author: "",
  status: "COMPLETED",
  description: "",
  genres: [],
  tags: [],
}

const MetadataTabForm = ({ form, isPending, metadata, handleBlob }: Props) => {
  const [appendAlias, setAppendAlias] = useState<boolean>(false);

  const resetMetadata = () => {
    const chapters = form.getValues('chapters') as NovelInput["chapters"];
    form.reset(toDefault(chapters, initialMetadata));
  };

  const genresFieldArray = useFieldArray({
    control: form.control,
    name: "genres",
  });

  const tagsFieldArray = useFieldArray({
    control: form.control,
    name: "tags",
  });

  const updateMetadata = useCallback(() => {
    if (!metadata) return;
    const chapters = form.getValues('chapters') as NovelInput["chapters"];
    form.reset(toDefault(chapters, metadata));
    setAppendAlias(false);
  }, [form, metadata])

  useEffect(() => {
    if (!metadata) return;
    // eslint-disable-next-line
    updateMetadata();
  }, [metadata, updateMetadata]);

  const handleAppendAlias = (shouldAppend: boolean) => {
    if (!metadata || (!metadata.alias && !metadata.title)) return;
    const { alias } = form.getValues();
    setAppendAlias(shouldAppend);
    form.setValue('title', `${metadata.title}`)
    if (shouldAppend && alias) {
      form.setValue('title', `${metadata.title}: ${alias}`)
    }
  }

  return (
    <FieldSet className="gap-4">
      <FieldGroup className="gap-4">
        <div className="grid grid-cols-[0.1fr_1fr] gap-2">
          <div className="col-span-1">
            <NovelImage handleBlob={handleBlob} b64={metadata?.image_b64} />
          </div>
          <div className="col-span-1 flex flex-col justify-between">
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-1">
                  <div className="flex justify-between">
                    <FieldLabel htmlFor="novel-form-title">
                      Book title
                    </FieldLabel>
                    <div className="flex mb-0.25 gap-2 text-muted-foreground items-center">
                      <FieldLabel htmlFor="append-alias" className="text-xs relative top-0.25">
                        Append alias
                      </FieldLabel>
                      <Checkbox
                        id="append-alias"
                        checked={appendAlias}
                        onCheckedChange={(b) => handleAppendAlias(b)}
                      />
                    </div>
                  </div>
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

        <FieldSet className="gap-2 m-0 p-0">
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
          <div className="grid mt-4">
            <Button variant='outline' onClick={resetMetadata}>Reset Metadata</Button>
          </div>
        </FieldSet>
      </FieldGroup>
    </FieldSet>
  )
}

export default MetadataTabForm;
