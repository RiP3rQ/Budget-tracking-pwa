import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div
      className={"flex flex-col items-center justify-center min-h-screen p-4"}
    >
      <div className={"text-center"}>
        <h1 className={"text-6xl font-bold text-primary mb-4"}>404</h1>
        <h2 className={"text-2xl font-semibold mb-4"}>Nie znaleziono</h2>
        <p className={"text-muted-foreground mb-8 max-w-md"}>
          Nie martw się, nawet najlepsze aplikacje mają czasami problemy.
        </p>
        <div className={"flex flex-col sm:flex-row justify-center gap-4"}>
          <Link
            className={
              "flex items-center justify-center px-4 py-2 bg-muted text-white rounded-md hover:bg-primary/80 transition-colors"
            }
            href={"/"}
          >
            <ArrowLeftIcon className={"size-4 mr-2"} />
            Wróć do strony głównej
          </Link>
        </div>
      </div>
      <div className={"mt-12 text-center"}>
        <p className={"text-sm text-muted-foreground"}>
          Jeśli uważasz, że to błąd, skontaktuj się z nami.
        </p>
      </div>
    </div>
  );
};
export default NotFoundPage;
