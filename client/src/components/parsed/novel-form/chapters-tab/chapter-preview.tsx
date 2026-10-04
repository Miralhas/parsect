import type { Chapter } from "@/types/chapter";

const ChapterPreview = ({ chapter }: { chapter: Omit<Chapter, "number"> }) => {
  const { title, body } = chapter;
  return (
    <div>
      <h2 className="capitalize text-center text-white/95 text-xl md:text-lg font-tilt-warp mb-2 translate">{title}</h2>
      <div
        className="chapter-body translate max-w-none text-sm scroll-mt-[100px] max-h-[300px] overflow-y-auto text-pretty text-shadow-none px-3 space-y-4"
        style={{
          wordWrap: "break-word",
          // fontSize: 19,
          lineHeight: `25px`,
          color: "#e0e0e0",
          opacity: 100,
        }}
        dangerouslySetInnerHTML={{ __html: body }}
        id="chapter-content"
      >
      </div>
    </div>
  )
}

export default ChapterPreview;
