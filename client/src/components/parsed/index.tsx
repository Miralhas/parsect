import { useParserProvider } from "@/contexts/parser-context";
import MetadataForm from "./metadata-form";
import NovelForm from "./novel-form";

const Parsed = () => {
  const { handleChapters, isParsed, chapters } = useParserProvider();

  return (
    <section className="flex flex-col p-6 md:mt-14 items-center gap-4 max-w-4xl mx-auto">
      <div className="flex w-full min-w-0 flex-col gap-4 text-sm leading-loose">
        <div className="text-center">
          <h1
            className="font-bold text-3xl text-primary cursor-pointer"
            onClick={() => handleChapters(undefined)}
          >
            Parsect
          </h1>
          <p>Number of chapters: <span className="underline font-bold">{chapters?.length ?? 0}</span></p>
        </div>
        <MetadataForm />
      </div>
      {isParsed && <NovelForm />}
    </section>
  )
}

export default Parsed;
