import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useParserProvider } from "@/contexts/parser-context";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { type ChapterList } from "@/lib/schemas/chapter-schema";
import type { NovelFormInput, NovelInput } from "@/lib/schemas/novel-schema";
import { XIcon } from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";
import type {
  FieldArrayPath,
  FieldArrayWithId,
  FieldValues,
  UseFieldArrayReplace,
  UseFieldArraySwap,
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
  swap: UseFieldArraySwap;
}

const genericTitleOptions = [
  { label: "ALL", value: "all" },
  { label: "EMPTY", value: "empty" },
  { label: "SELECTED", value: "selected" },
] as const;

const copyChaptersOptions = [
  { label: "ALL", value: "all" },
  { label: "SELECTED", value: "selected" },
] as const;

type GenericTitleOption = typeof genericTitleOptions[number]['value'];
type CopyChaptersOption = typeof copyChaptersOptions[number]['value'];

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
  swap,
}: Props<NovelFormInput, 'chapters'>) => {
  const [genericTitle, setGenericTitle] = useState<GenericTitleOption>('all');
  const [copyChapters, setCopyChapters] = useState<CopyChaptersOption>('all');
  const { handleChapters } = useParserProvider();
  const { copyToClipboard, isCopied } = useCopyToClipboard({ timeout: 2000 })

  const handleReset = () => {
    replace(chapters);
    setSelectedFields([]);
  }

  const handleSwap = () => {
    if (selectedFields.length < 2) return;
    const from = fields.findIndex(i => selectedFields[0].id === i.id);
    const to = fields.findIndex(i => selectedFields[selectedFields.length - 1].id === i.id);
    swap(from, to);
  };

  const handleClearChapters = () => handleChapters(undefined);

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

  const handleCopy = () => {
    const isAll = copyChapters === 'all';
    const chapters = (isAll ? form.getValues('chapters') : selectedFields)
      .map(({ body, title }, i) => ({ number: i + 1, title, body }));
    copyToClipboard(JSON.stringify(chapters));
  }

  const handleMerge = () => {
    if (selectedFields.length < 2) return;
    const selectedWithIndex = selectedFields.map(f => (
      { ...f, idx: fields.findIndex(fi => fi.id === f.id) }
    )).toSorted((a, b) => a.idx - b.idx);
    const mergedBody = selectedWithIndex.reduce((body, f) => body.concat(f.body), '');
    const root = selectedWithIndex[0];
    update(root.idx, { ...root, body: mergedBody });
    setSelectedFields([]);
  }

  return (
    <div className="p-2 grid grid-cols-1 sm:grid-cols-2 gap-2 w-full border border-input relative">
      <Button variant='outline' size='xs' className='mr-4 sm:mr-0' onClick={handleReset}>Reset chapters</Button>
      <Button variant='outline' size='xs' className='sm:mr-4' onClick={handleClearChapters}>Clear chapters</Button>
      <div className="w-full flex gap-1">
        <Button variant='outline' className='flex-1' size='xs' onClick={handleGenericTitle}>Generic title</Button>
        <Select items={genericTitleOptions} value={genericTitle} onValueChange={(v) => setGenericTitle(v as GenericTitleOption)}>
          <SelectTrigger className="h-6!" size="sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {genericTitleOptions.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="w-full flex gap-1">
        <Button variant='outline' className='flex-1' size='xs' onClick={handleCopy}>{isCopied ? 'Copied' : 'Copy chapters JSON'}</Button>
        <Select items={copyChaptersOptions} value={copyChapters} onValueChange={(v) => setCopyChapters(v as CopyChaptersOption)}>
          <SelectTrigger className="h-6!" size="sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {copyChaptersOptions.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Button variant='outline' size='xs' onClick={handleSelectEmptyTitles}>Select empty titles</Button>
      <Button variant='outline' size='xs' onClick={handleToggleAll}>Toggle All</Button>
      <Button variant='outline' size='xs' onClick={handleSwap}>Swap selected</Button>
      <Button variant='outline' size='xs' onClick={handleMerge}>Merge selected</Button>

      <Button variant='ghost' size='xs' className='absolute top-1.75 -right-0.5 text-gray-400 hover:text-primary transition-colors font-bold' onClick={handleClose}>
        <XIcon className="" />
      </Button>
    </div>
  )
}

export default ChaptersConfig;
