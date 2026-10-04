import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { EyeIcon } from "lucide-react";
import ChapterPreview from "./chapter-preview";

const PreviewDialog = ({ title, body }: { title: string, body: string }) => {
  return (
    <Dialog>
      <DialogTrigger>
        <Button size="none" variant="pure" className="absolute top-1.25 right-1.5">
          <EyeIcon className="size-3.5 text-foreground/70" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <ChapterPreview chapter={{ title, body }} />
      </DialogContent>
    </Dialog>
  )
}

export default PreviewDialog;
