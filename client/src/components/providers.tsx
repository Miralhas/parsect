import { ParserProvider } from '@/contexts/parser-context';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import type { PropsWithChildren } from "react";
import { ThemeProvider } from "./theme-provider";
import { TooltipProvider } from "./ui/tooltip";

const queryClient = new QueryClient()

const Providers = ({ children }: PropsWithChildren) => {
  return (
    <ThemeProvider>
      <TooltipProvider>
        <QueryClientProvider client={queryClient}>
          <ParserProvider>
            {children}
          </ParserProvider>
        </QueryClientProvider>
      </TooltipProvider>
    </ThemeProvider>
  )
}

export default Providers;