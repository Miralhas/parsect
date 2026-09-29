import { cn } from "cn";
import { BookBookmarkIcon } from "lucide-react";
import { useRef, useState, type ChangeEvent, type DragEvent } from "react";

type Props = {
  onRemove?: () => void;
  onFileSelected: (file: File | null) => void;
  accept?: string;
  disabled?: boolean;
}

const Dropzone = ({ onFileSelected, onRemove, accept = "*/*", disabled = false }: Props) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      onFileSelected(file);
      setFile(file)
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      onFileSelected(file);
      setFile(file)
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    onFileSelected(null);
    onRemove?.();
  }

  return (
    <>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={cn(`
          flex flex-col items-center justify-center 
          border-2 border-dashed 
          p-10 py-16 cursor-pointer transition-all duration-300 
          bg-card/60 hover:border-primary/40 border-zinc-800
          `,
          isDragging && "border-primary/40 scale-[1.02]",
          disabled && "pointer-events-none opacity-50"
        )}
      >
        <p className="text-accent-foreground/80 text-sm font-medium text-center">
          {file ? (
            <span className="text-sm font-medium text-accent-foreground/70 line-clamp-1">{file.name}</span>
          ) : "Epub to parse"}
        </p>

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={false}
          className="hidden"
          onChange={handleInputChange}
        />
      </div>

      {file && (
        <ul className="mt-4 space-y-2">
          <li
            className="flex items-center justify-between bg-card/60 border rounded-xl px-4 py-3 shadow-sm"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <span className="text-xl"><BookBookmarkIcon className="text-muted-foreground size-5" /></span>
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-accent-foreground/70 truncate">{file.name}</p>
                <p className="text-xs text-accent-foreground/60">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
            {!disabled && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile();
                }}
                className="ml-4 text-gray-400 hover:text-primary transition-colors text-lg font-bold"
                aria-label="Remove file"
              >
                ×
              </button>
            )}
          </li>
        </ul>
      )}
    </>
  );
}

export default Dropzone;
