import { ClerkLoaded, ClerkLoading, UserButton } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import NavButton from "@/components/nav-button";
import { Separator } from "@/components/ui/separator";

const routes = [
  {
    href: "/",
    label: "Budżet",
  },
  {
    href: "/transactions",
    label: "Transakcje",
  },
  {
    href: "/accounts",
    label: "Konta",
  },
  {
    href: "/categories",
    label: "Kategorie",
  },
];

const Header = () => {
  return (
    <>
      <div
        className={
          "my-2 flex items-center justify-between gap-5 max-w-screen-2xl mx-auto w-full"
        }
      >
        <div>
          {routes.map((route, index) => (
            <NavButton key={index} href={route.href} label={route.label} />
          ))}
        </div>
        <div>
          <ClerkLoaded>
            <UserButton afterSignOutUrl="/" />
          </ClerkLoaded>
          <ClerkLoading>
            <Loader2
              className={"w-12 h-12 text-muted-foreground animate-spin"}
            />
          </ClerkLoading>
        </div>
      </div>
      <Separator className={"w-full mb-5"} />
    </>
  );
};
export default Header;
