import { useParserProvider } from "@/contexts/parser-context";
import { cn } from "cn";
import type { PropsWithChildren } from "react";

type Props = {
  className?: string;
}

const Layout = ({ children, className }: PropsWithChildren<Props>) => {
  const { handleChapters } = useParserProvider();
  return (
    <section className={cn("flex min-h-svh p-6", className)}>
      <div className="flex max-w-4xl w-full min-w-0 flex-col gap-4 text-sm leading-loose">
        <div className="text-center">
          <h1 className="font-bold text-3xl text-primary" onClick={() => handleChapters()}>Parsect</h1>
          <p>Parse and extract</p>
        </div>
        {children}
      </div>
    </section>
  )
}

export default Layout;
