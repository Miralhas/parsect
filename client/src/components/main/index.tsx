import Layout from "../layout";
import ParseEpubForm from "./parse-epub-form";

const MainPage = () => {
  return (
    <Layout className="justify-center items-center gap-4 mx-auto max-w-xl">
      <ParseEpubForm />
    </Layout>
  )
}

export default MainPage;
