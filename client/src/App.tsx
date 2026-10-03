import MainPage from "./components/main";
import Parsed from "./components/parsed";
import { useParserProvider } from "./contexts/parser-context";

export function App() {
  const { isParsed } = useParserProvider();

  if (isParsed) return <Parsed />;

  return <MainPage />
}

export default App;
