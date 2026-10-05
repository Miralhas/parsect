import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger
} from "@/components/ui/drawer";
import { Field, FieldContent, FieldError } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import type { NovelFormInput, NovelInput } from "@/lib/schemas/novel-schema";
import { ArrowDownIcon, ArrowUpIcon, EyeIcon, GripVertical, Trash2Icon } from "lucide-react";
import { Controller, type Control, type FieldArrayPath, type FieldArrayWithId, type FieldValues } from "react-hook-form";
import PreviewDialog from "./preview-dialog";
import { useState } from "react";

type Props<
  TFieldValues extends FieldValues,
  TFieldArrayName extends FieldArrayPath<TFieldValues>,
> = {
  field: FieldArrayWithId<TFieldValues, TFieldArrayName>;
  control: Control<NovelFormInput, unknown, NovelInput>;
  index: number;
  handleRemove: (index: number) => void;
  handleMoveUp: (index: number) => void;
  handleMoveDown: (index: number) => void;
}

const MobileChapterMenu = ({
  field,
  control,
  index,
  handleRemove,
  handleMoveDown,
  handleMoveUp,
}: Props<NovelFormInput, 'chapters'>) => {
  const [open, setOpen] = useState(false)

  const handleMove = (cb: () => void) => {
    cb();
    setOpen(false);
  }

  return (
    <Drawer showSwipeHandle open={open} onOpenChange={(open) => setOpen(open)}>
      <DrawerTrigger render={<Button variant="pure" size="none" className="relative left-1" />}>
        <GripVertical className="text-foreground/80 size-5 mb-1" />
      </DrawerTrigger>
      <DrawerContent>
        <div className="p-4 space-y-6">
          <div className="flex gap-4 items-center justify-center">
            <Button
              variant="pure"
              size="none"
              type="button"
              className="text-muted-foreground group"
              onClick={() => handleMove(() => handleMoveUp(index))}
              aria-label={`Remove chapter ${index + 1}`}
            >
              <ArrowUpIcon className="group-hover:text-amber-600/90 size-5" />
            </Button>
            <Button
              variant="pure"
              size="none"
              type="button"
              className="text-muted-foreground group"
              onClick={() => handleRemove(index)}
              aria-label={`Remove chapter ${index + 1}`}
            >
              <Trash2Icon className="group-hover:text-red-800/90 size-5" />
            </Button>
            <PreviewDialog body={field.body} title={field.title}>
              <DialogTrigger render={<Button size="none" variant="pure" className="group" />} >
                <EyeIcon className="text-foreground/70 size-5 group-hover:text-sky-800/90" />
              </DialogTrigger>
            </PreviewDialog>
            <Button
              variant="pure"
              size="none"
              type="button"
              className="text-muted-foreground group"
              onClick={() => handleMove(() => handleMoveDown(index))}
              aria-label={`Remove chapter ${index + 1}`}
            >
              <ArrowDownIcon className="group-hover:text-amber-600/90 size-5" />
            </Button>
          </div>
          <div className="overflow-y-auto max-h-[300px]">
            <Controller
              name={`chapters.${index}.body`}
              control={control}
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
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </FieldContent>
                </Field>
              )}
            />
          </div>
        </div>
        <DrawerFooter>
          <DrawerClose render={<Button variant="outline" />}>Close</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default MobileChapterMenu;