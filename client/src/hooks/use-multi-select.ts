import { useState, type ChangeEvent } from "react"

function getRowRange<T>(rows: Array<T>, idA: number, idB: number) {
  const range: Array<T> = [];
  let foundStart = false;
  let foundEnd = false;
  for (let index = 0; index < rows.length; index += 1) {
    const row = rows[index];
    if (row === idA || row === idB) {
      if (foundStart) {
        foundEnd = true;
      }
      if (!foundStart) {
        foundStart = true;
      }
    }

    if (foundStart) {
      range.push(row);
    }

    if (foundEnd) {
      break;
    }
  }

  return range;
}

export const useMultiSelect = ({ rows }: { rows: Array<number> }) => {
  const [selected, setSelected] = useState<Array<number>>([]);

  const handleMultiSelect = (to: number, e: ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
    const from = Array.from(selected).pop() ?? 0;
    // @ts-expect-error shiftKey is defined for click events
    if (e.nativeEvent.shiftKey) {
      const rowsToToggle = [...getRowRange(rows, to, from).filter(c => !selected.includes(c)), from];
      setSelected(rowsToToggle);
      return;
    }
    const isChecked = selected.some(c => c === to);
    setSelected(prev => isChecked ? [...prev.filter(c => c !== to)] : [...prev, to]);
  };

  return { selected, setSelected, handleMultiSelect };
}