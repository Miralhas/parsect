'use client'

import { type PropsWithChildren, useState } from "react";
import { createContext } from "./create-context";
import type { NovelInput } from "@/lib/schemas/novel-schema";

export type PartialNovel = Partial<NovelInput> & { image_b64?: string }; 

type ParsedState = {
  novel?: PartialNovel;
}

type ParsedAction = {
  handleParsed: (novel?: Partial<NovelInput>) => void;
}

const { ContextProvider, useContext } = createContext<ParsedState & ParsedAction>();

export const ParserProvider = ({ children }: PropsWithChildren) => {
  const [novel, setNovel] = useState<Partial<NovelInput> | undefined>();

  const handleParsed = (novel?: PartialNovel) => {
    if (!novel) return setNovel(undefined);
    setNovel(prev => ({ ...prev, ...novel }))
  }

  return (
    <ContextProvider value={{ novel, handleParsed }}>
      {children}
    </ContextProvider>
  )
}

// eslint-disable-next-line
export const useParserProvider = useContext;