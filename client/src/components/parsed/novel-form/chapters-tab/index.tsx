import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldError,
  FieldSet
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupInput
} from "@/components/ui/input-group";
import { Textarea } from "@/components/ui/textarea";
import { useRHFMultiSelect } from "@/hooks/use-rhf-multi-select";
import type { ChapterList } from "@/lib/schemas/chapter-schema";
import { type NovelFormInput, type NovelInput } from "@/lib/schemas/novel-schema";
import { cn } from "cn";
import { ArrowDownIcon, ArrowUpIcon, CheckIcon, EyeIcon, StickyNoteIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { Controller, useFieldArray } from "react-hook-form";
import ChaptersConfig from "./config";
import PreviewDialog from "./preview-dialog";
import MobileChapterMenu from "./mobile-chapter-menu";
import { DialogTrigger } from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";

type Props = {
  form: UseFormReturn<NovelFormInput, unknown, NovelInput>;
  isPending: boolean;
  chapters: ChapterList;
}

const ChaptersTabForm = ({ form, isPending, chapters }: Props) => {
  const [showChapterBody, setShowChapterBody] = useState<number | undefined>();
  const [openConfig, setOpenConfig] = useState<boolean>(false);
  const isMobile = useIsMobile();

  const { fields, append, remove, replace, update, move, swap } = useFieldArray({
    control: form.control,
    name: "chapters",
  });

  const {
    handleMultiSelect,
    setSelectedFields,
    selectedFields,
  } = useRHFMultiSelect<NovelFormInput, 'chapters'>({ fields });

  const hasSelectedFields = !!selectedFields.length;

  const handleSelectEmptyTitles = () => {
    setSelectedFields(fields.filter(f => !f.title));
  }

  useEffect(() => {
    handleSelectEmptyTitles()
  }, []);

  const handleShowChapterBody = (index: number | undefined) => {
    setShowChapterBody(index === showChapterBody ? undefined : index);
  };

  const handleRemove = (index: number) => {
    const ids = new Set([...selectedFields.map(s => fields.findIndex(i => i.id === s.id)), index]);
    remove([...ids]);
    setSelectedFields([]);
    handleShowChapterBody(undefined);
  }

  const handleToggleAll = () => {
    return setSelectedFields(hasSelectedFields ? [] : fields);
  }

  const handleMoveUp = (index: number) => {
    if (index <= 0) return move(index, fields.length - 1);
    move(index, index - 1);
  }

  const handleMoveDown = (index: number) => {
    if (index >= fields.length - 1) return move(index, 0);
    move(index, index + 1);
  }

  const handleReset = () => {
    form.setValue("chapters", chapters);
    setSelectedFields([]);
  }

  return (
    <>
      {form.formState.errors.chapters?.root && (
        <FieldError errors={[form.formState.errors.chapters.root]} />
      )}
      <FieldSet className="gap-2">
        {openConfig ? (
          <ChaptersConfig
            form={form}
            swap={swap}
            fields={fields}
            handleClose={() => setOpenConfig(false)}
            handleToggleAll={handleToggleAll}
            replace={replace}
            update={update}
            setSelectedFields={setSelectedFields}
            chapters={chapters}
            handleSelectEmptyTitles={handleSelectEmptyTitles}
            selectedFields={selectedFields}
          />
        ) : (
          <div className="w-full flex justify-between gap-1.5 items-center">
            <Checkbox
              checked={hasSelectedFields}
              className={cn('h-8 w-[30px] border dark:data-checked:border-primary/60 dark:data-checked:bg-primary/30! mt-auto')}
              onCheckedChange={handleToggleAll}
              disabled={!fields.length}
            >
              <CheckIcon className="text-foreground/80" />
            </Checkbox>
            <p className="text-foreground/90 ml-6 md:ml-12">Number of chapters: <span className="underline font-bold">{fields.length}</span></p>
            <Button
              variant='outline'
              className={cn('justify-self-end', openConfig && 'row-start-1 col-span-full')}
              onClick={() => setOpenConfig(prev => !prev)}
            >
              Config
            </Button>
          </div>
        )}
        <div className="gap-0">
          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-[30px_1fr_15px] gap-1.5">
              <Field orientation="horizontal" className="mb-2 col-span-1">
                <Checkbox
                  checked={selectedFields.some(item => item.id === field.id)}
                  className="h-8 w-full border dark:data-checked:border-primary/60 dark:data-checked:bg-primary/30!"
                  onClick={event => {
                    handleMultiSelect(field, event.shiftKey);
                  }}
                />
              </Field>
              <div className="col-span-1 space-y-2 relative flex gap-2">
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
                            className="text-[10px] md:text-xs"
                            value={controllerField.value ?? ''}
                            autoComplete="off"
                            disabled={isPending}
                          />
                        </InputGroup>
                      </FieldContent>
                    </Field>
                  )}
                />

                {!isMobile && (
                  <div className="flex gap-2 absolute top-0 right-2">
                    <Button
                      variant="link"
                      type="button"
                      className="text-muted-foreground group p-0 m-0"
                      onClick={() => handleShowChapterBody(index)}
                      aria-label={`Remove chapter ${index + 1}`}
                    >
                      <StickyNoteIcon className="group-hover:text-red-800/90 size-3.5" />
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
              <div className="col-span-1 gap-0.25 text-foreground/80 justify-self-end flex flex-col justify-center">
                {isMobile ? (
                  <MobileChapterMenu
                    handleMoveDown={handleMoveDown}
                    handleMoveUp={handleMoveUp}
                    field={field}
                    control={form.control}
                    index={index}
                    handleRemove={handleRemove}
                  />
                ) : (
                  <>
                    <ArrowUpIcon className="size-3.5 cursor-pointer" onClick={() => handleMoveUp(index)} />
                    <ArrowDownIcon className="size-3.5 cursor-pointer" onClick={() => handleMoveDown(index)} />
                  </>
                )}
              </div>
              {!isMobile && showChapterBody === index && (
                <div className="w-full mb-2 col-span-full">
                  <Controller
                    name={`chapters.${index}.body`}
                    control={form.control}
                    render={({ field: controllerField, fieldState }) => (
                      <Field
                        orientation="horizontal"
                        data-invalid={fieldState.invalid}
                      >
                        <FieldContent className="relative">
                          <Textarea
                            {...controllerField}
                            id={`novel-form-body-${index}`}
                            aria-invalid={fieldState.invalid}
                            placeholder="Add chapter body - <p>...</p>"
                            rows={12}
                            disabled={isPending}
                            className="pr-4"
                          />
                          <PreviewDialog body={form.getValues(`chapters.${index}.body`)} title={field.title}>
                            <DialogTrigger render={<Button size="none" variant="pure" className="absolute top-1.25 right-1.5" />} >
                              <EyeIcon className="size-3.5 text-foreground/70" />
                            </DialogTrigger>
                          </PreviewDialog>
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
          <div className="grid grid-cols-2 gap-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ title: "", body: "", number: fields.length + 1 })}
            >
              Add Chapter
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleReset}
            >
              Reset Chapters
            </Button>
          </div>
        </div>
      </FieldSet>

    </>
  )
}

export default ChaptersTabForm;
