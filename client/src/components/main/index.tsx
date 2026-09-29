import ParseEpubForm from "./parse-epub-form";

const MainPage = () => {
  return (
    <div className="flex min-h-svh p-6 justify-center items-center">
      <div className="flex max-w-xl w-full min-w-0 flex-col gap-4 text-sm leading-loose">
        <div className="text-center">
          <h1 className="font-bold text-3xl text-primary">Parsect</h1>
          <p>Parse epubs and extract metadata</p>
        </div>
        <ParseEpubForm />
      </div>
    </div>
  )
}

export default MainPage;
