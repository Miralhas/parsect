import { useState } from "react";
import type {
  FieldArrayPath,
  FieldArrayWithId,
  FieldValues,
} from "react-hook-form";

function getFieldsRange<
  TFieldValues extends FieldValues,
  TFieldArrayName extends FieldArrayPath<TFieldValues>,
>(
  fields: FieldArrayWithId<TFieldValues, TFieldArrayName>[],
  idA: string,
  idB: string,
) {
  const indexA = fields.findIndex(field => field.id === idA);
  const indexB = fields.findIndex(field => field.id === idB);

  if (indexA === -1 || indexB === -1) {
    return [];
  }

  const start = Math.min(indexA, indexB);
  const end = Math.max(indexA, indexB);

  return fields.slice(start, end + 1);
}

export const useRHFMultiSelect = <
  TFieldValues extends FieldValues,
  TFieldArrayName extends FieldArrayPath<TFieldValues>,
>({
  fields
}: {
  fields: FieldArrayWithId<TFieldValues, TFieldArrayName>[];
}) => {
  type Field = FieldArrayWithId<TFieldValues, TFieldArrayName>;

  const [selectedFields, setSelectedFields] = useState<Field[]>([]);
  const [anchorId, setAnchorId] = useState<string | null>(null);

  const handleMultiSelect = (
    field: Field,
    shiftKey: boolean,
  ) => {
    const anchorField = fields.find(r => r.id === anchorId);
    if (shiftKey && anchorField) {
      const range = getFieldsRange(fields, anchorField.id, field.id);
      
      setSelectedFields(prev => {
        const selectedIds = new Set(prev.map(item => item.id));

        for (const item of range) {
          if (selectedIds.has(item.id)) {
            selectedIds.delete(item.id);
          } else {
            selectedIds.add(item.id);
          }
        }

        return [anchorField, ...fields.filter(item => selectedIds.has(item.id))];
      });

      return;
    }

    setSelectedFields(prev => {
      const isSelected = prev.some(item => item.id === field.id);

      return isSelected
        ? prev.filter(item => item.id !== field.id)
        : [...prev, field];
    });

    setAnchorId(field.id);
  };

  return {
    selectedFields,
    setSelectedFields,
    handleMultiSelect,
  };
};