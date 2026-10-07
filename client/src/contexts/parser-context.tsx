'use client'

import type { ChapterList } from "@/lib/schemas/chapter-schema";
import type { Metadata } from "@/types/metadata";
import { type PropsWithChildren, useState } from "react";
import { createContext } from "./create-context";

type ParsedState = {
  metadata?: Metadata;
  chapters?: ChapterList;
  isParsed: boolean;
  epubBuffer?: ArrayBuffer;
}

type ParsedAction = {
  handleMetadata: (metadata?: Metadata) => void;
  handleChapters: (novel?: ChapterList) => void;
  handleEpubBuffer: (epub: File) => Promise<void>;
}

const { ContextProvider, useContext } = createContext<ParsedState & ParsedAction>();

export const ParserProvider = ({ children }: PropsWithChildren) => {
  const [metadata, setMetadata] = useState<Metadata | undefined>();
  const [chapters, setChapters] = useState<ChapterList | undefined>();
  const [epubBuffer, setEpubBuffer] = useState<ArrayBuffer | undefined>();

  const isParsed = !!chapters && !!epubBuffer;

  const handleEpubBuffer = async (epub: File) => {
    setEpubBuffer(await epub.arrayBuffer());
  }

  const handleChapters = (chapters?: ChapterList) => {
    setChapters(chapters);
  }

  const handleMetadata = (metadata?: Metadata) => {
    setMetadata(metadata);
  }

  return (
    <ContextProvider value={{
      isParsed,
      metadata,
      chapters,
      epubBuffer,
      handleEpubBuffer,
      handleMetadata,
      handleChapters,
    }}>
      {children}
    </ContextProvider>
  )
}

// eslint-disable-next-line
export const useParserProvider = useContext;