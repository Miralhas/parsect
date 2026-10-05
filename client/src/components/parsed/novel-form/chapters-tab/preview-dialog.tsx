import {
  Dialog,
  DialogContent
} from "@/components/ui/dialog";
import { useState, type PropsWithChildren } from "react";
import ChapterPreview from "./chapter-preview";
import { useIsMobile } from "@/hooks/use-mobile";

const PreviewDialog = ({ title, body, children }: PropsWithChildren<{ title: string, body: string }>) => {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      {children}
      {open && isMobile && <div className="fixed inset-0 isolate bg-black/75 z-99" />}
      <DialogContent className="sm:max-w-lg">
        <ChapterPreview chapter={{ title, body }} />
      </DialogContent>
    </Dialog>
  )
}

export default PreviewDialog;
