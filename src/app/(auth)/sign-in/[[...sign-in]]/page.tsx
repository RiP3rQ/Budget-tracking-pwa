import { ClerkLoaded, ClerkLoading, SignIn } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

export default function Page() {
  return (
    <div className={"min-h-screen grid grid-cols-1"}>
      <div
        className={"h-full lg:flex flex-col items-center justify-center px-4"}
      >
        <div className={"text-center space-y-4 pt-16"}>
          <h1 className={"font-bold text-3xl text-[#2e2a47]"}>
            Witaj ponownie!
          </h1>
          <p className={"text-base text-[#7e8ca0]"}>
            Zaloguj się lub utwórz nowe konto, aby kontynuować.
          </p>
        </div>
        <div className={"flex items-center justify-center mt-8"}>
          <ClerkLoaded>
            <SignIn />
          </ClerkLoaded>
          <ClerkLoading>
            <Loader2
              className={"w-12 h-12 text-muted-foreground animate-spin"}
            />
          </ClerkLoading>
        </div>
      </div>
    </div>
  );
}
