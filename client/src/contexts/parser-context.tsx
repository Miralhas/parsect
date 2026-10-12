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
  cover?: Blob;
}

type ParsedAction = {
  handleClear: () => void;
  handleMetadata: (metadata?: Metadata) => void;
  handleChapters: (novel?: ChapterList) => void;
  handleEpubBuffer: (epub: File) => Promise<void>;
  handleCover: (blob?: Blob) => void;
}

const { ContextProvider, useContext } = createContext<ParsedState & ParsedAction>();

export const ParserProvider = ({ children }: PropsWithChildren) => {
  const [metadata, setMetadata] = useState<Metadata | undefined>();
  const [chapters, setChapters] = useState<ChapterList | undefined>();
  const [epubBuffer, setEpubBuffer] = useState<ArrayBuffer | undefined>();
  const [cover, setCover] = useState<Blob | undefined>(undefined);

  const handleEpubBuffer = async (epub: File) => {
    setEpubBuffer(await epub.arrayBuffer());
  }

  const handleChapters = (chapters?: ChapterList) => {
    setChapters(chapters);
  }

  const handleMetadata = (metadata?: Metadata) => {
    setMetadata(metadata);
  }

  const handleCover = (blob?: Blob) => {
    setCover(blob);
  }

  const handleClear = () => {
    setChapters(undefined);
    setMetadata(undefined);
    setEpubBuffer(undefined);
    setCover(undefined);
  }

  const isParsed = !!chapters;

  return (
    <ContextProvider value={{
      cover,
      isParsed,
      metadata,
      chapters,
      epubBuffer,
      handleClear,
      handleEpubBuffer,
      handleMetadata,
      handleChapters,
      handleCover,
    }}>
      {children}
    </ContextProvider>
  )
}

// eslint-disable-next-line
export const useParserProvider = useContext;