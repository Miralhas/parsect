import { useParserProvider } from "@/contexts/parser-context";
import MetadataForm from "./metadata-form";
import NovelForm from "./novel-form";
import Layout from "../layout";

const Parsed = () => {
  const { isParsed } = useParserProvider();

  return (
    <Layout className="md:mt-14 items-center gap-4 mx-auto max-w-4xl">
      <MetadataForm />
      {isParsed && <NovelForm />}
    </Layout>
  )
}

export default Parsed;
