import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ChapterList } from "@/lib/schemas/chapter-schema";
import type { NovelFormInput, NovelInput } from "@/lib/schemas/novel-schema";
import { XIcon } from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";
import type {
  FieldArrayPath,
  FieldArrayWithId,
  FieldValues,
  UseFieldArrayReplace,
  UseFieldArrayUpdate,
  UseFormReturn
} from "react-hook-form";

type Props<
  TFieldValues extends FieldValues,
  TFieldArrayName extends FieldArrayPath<TFieldValues>,
> = {
  fields: FieldArrayWithId<TFieldValues, TFieldArrayName>[];
  form: UseFormReturn<NovelFormInput, unknown, NovelInput>;
  selectedFields: FieldArrayWithId<TFieldValues, TFieldArrayName>[];
  chapters: ChapterList;
  handleClose: () => void;
  handleToggleAll: () => void;
  setSelectedFields: Dispatch<SetStateAction<FieldArrayWithId<TFieldValues, TFieldArrayName>[]>>;
  handleSelectEmptyTitles: () => void;
  replace: UseFieldArrayReplace<TFieldValues, TFieldArrayName>;
  update: UseFieldArrayUpdate<TFieldValues, TFieldArrayName>;
}

const items = [
  { label: "ALL", value: "all" },
  { label: "EMPTY", value: "empty" },
  { label: "SELECTED", value: "selected" },
] as const;

const ChaptersConfig = ({
  form,
  fields,
  selectedFields,
  chapters,
  setSelectedFields,
  handleClose,
  replace,
  update,
  handleToggleAll,
  handleSelectEmptyTitles,
}: Props<NovelFormInput, 'chapters'>) => {
  type GenericTitleOption = typeof items[number]['value'];
  const [genericTitle, setGenericTitle] = useState<GenericTitleOption>('all');

  const handleReset = () => {
    form.setValue("chapters", chapters);
    setSelectedFields([]);
  }

  const handleGenericTitle = () => {
    switch (genericTitle) {
      case 'all':
        replace(fields.map((f, i) => ({ ...f, title: `Chapter ${i + 1}` })));
        break;
      case 'empty':
        fields.filter(f => !f.title).forEach((f, i) => update(
          fields.findIndex(fi => fi.id === f.id), { ...f, title: `Chapter ${i + 1}` }));
        break;
      case 'selected': {
        const selectedWithIndex = selectedFields.map(f => (
          { ...f, idx: fields.findIndex(fi => fi.id === f.id) }
        )).toSorted((a, b) => a.idx - b.idx);
        selectedWithIndex.forEach((f, i) => update(f.idx, { ...f, title: `Chapter ${i + 1}` }));
        break;
      }
    }
    setSelectedFields([]);
  }

  return (
    <div className="p-2 grid grid-cols-2 gap-2 w-full border border-input relative">
      <div className="col-span-1 flex flex-col gap-2">
        <Button variant='outline' size='xs' onClick={handleReset}>Reset chapters</Button>
        <div className="w-full flex gap-1">
          <Button variant='outline' className='flex-1' size='xs' onClick={handleGenericTitle}>Generic title</Button>
          <Select items={items} value={genericTitle} onValueChange={(v) => setGenericTitle(v as GenericTitleOption)}>
            <SelectTrigger className="h-6!" size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {items.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="col-span-1 flex flex-col gap-2">
        <Button variant='outline' size='xs' className='mr-4' onClick={handleSelectEmptyTitles}>Select empty titles</Button>
        <Button variant='outline' size='xs' onClick={handleToggleAll}>Toggle All</Button>
      </div>
      <Button variant='ghost' size='xs' className='absolute top-1.75 -right-0.5 text-gray-400 hover:text-primary transition-colors font-bold' onClick={handleClose}>
        <XIcon className="" />
      </Button>
    </div>
  )
}

export default ChaptersConfig;
