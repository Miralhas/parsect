import EpubReader from "@/components/epub-reader";
import { useParserProvider } from "@/contexts/parser-context";

const ReaderTab = () => {
  const { epubBuffer } = useParserProvider();
  
  if (!epubBuffer) return null;

  return (
    <section className="w-full border border-input">
      <EpubReader epubBuffer={epubBuffer} className="h-svh" />
    </section>
  )
}

export default ReaderTab;
