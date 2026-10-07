import { useParserProvider } from "@/contexts/parser-context";
import { cn } from "cn";
import type { MouseEvent, PropsWithChildren } from "react";

type Props = {
  className?: string;
}

const Layout = ({ children, className }: PropsWithChildren<Props>) => {
  const { handleChapters } = useParserProvider();

  const handleHome = (e: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    handleChapters()
  }

  return (
    <section className={cn("flex min-h-svh p-6", className)}>
      <div className="flex max-w-4xl w-full min-w-0 flex-col gap-4 text-sm leading-loose">
        <div className="text-center">
          <a href="/" className="font-bold text-3xl text-primary" onClick={handleHome}>Parsect</a>
          <p>Parse and extract</p>
        </div>
        {children}
      </div>
    </section>
  )
}

export default Layout;
