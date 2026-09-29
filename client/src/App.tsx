import MainPage from "./components/main";
import Parsed from "./components/parsed";
import { useParserProvider } from "./contexts/parser-context";

export function App() {
  const { novel } = useParserProvider();

  if (novel) return <Parsed />;

  return <MainPage />
}

export default App;
