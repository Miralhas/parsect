import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { Toaster } from "@/components/ui/toast"

import "./index.css"
import App from "./App.tsx"
import Providers from "./components/providers.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Providers>
      <App />
      <Toaster />
    </Providers>
  </StrictMode>
)
