import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldSet
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupInput
} from "@/components/ui/input-group";
import { Textarea } from "@/components/ui/textarea";
import { useRHFMultiSelect } from "@/hooks/use-rhf-multi-select";
import { type NovelFormInput, type NovelInput } from "@/lib/schemas/novel-schema";
import { EyeIcon, XIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { Controller, useFieldArray } from "react-hook-form";

type Props = {
  form: UseFormReturn<NovelFormInput, unknown, NovelInput>;
  isPending: boolean;
}

const ChaptersTabForm = ({ form, isPending }: Props) => {
  const [showChapterBody, setShowChapterBody] = useState<number | undefined>();

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "chapters",
  });

  const {
    handleMultiSelect,
    setSelectedFields,
    selectedFields,
  } = useRHFMultiSelect({ fields });

  useEffect(() => {
    setSelectedFields(fields.filter(f => !f.title));
  }, [fields, setSelectedFields]);

  const handleShowChapterBody = useCallback((index: number | undefined) => {
    if (index === showChapterBody) return setShowChapterBody(undefined);
    setShowChapterBody(index);
  }, [showChapterBody]);

  const handleRemove = (index: number) => {
    const ids = new Set([...selectedFields.map(s => fields.findIndex(i => i.id === s.id)), index]);
    remove([...ids]);
    setSelectedFields([]);
    handleShowChapterBody(undefined);
  }

  return (
    <>
      {form.formState.errors.chapters?.root && (
        <FieldError errors={[form.formState.errors.chapters.root]} />
      )}
      <FieldSet className="gap-4">
        <FieldGroup className="gap-0">
          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-[30px_1fr] gap-1.5">
              <Field orientation="horizontal" className="mb-2">
                <Checkbox
                  checked={selectedFields.some(item => item.id === field.id)}
                  className="h-8 w-full border dark:data-checked:border-primary/60 dark:data-checked:bg-primary/30!"
                  onClick={event => {
                    handleMultiSelect(field, event.shiftKey);
                  }}
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
                            placeholder="Chapter title"
                            type="text"
                            value={controllerField.value ?? ''}
                            autoComplete="off"
                            disabled={isPending}
                          />
                        </InputGroup>
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
                      onClick={() => handleRemove(index)}
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
    </>
  )
}

export default ChaptersTabForm;
