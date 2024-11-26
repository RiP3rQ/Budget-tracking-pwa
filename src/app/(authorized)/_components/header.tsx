import NavButton from "@/app/(dashboard)/budget/_components/nav-button";
import { ClerkLoaded, ClerkLoading, UserButton } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

type Props = {};

const routes = [
  {
    href: "/budget",
    label: "Budżet",
  },
  {
    href: "/budget/transactions",
    label: "Transakcje",
  },
  {
    href: "/budget/accounts",
    label: "Konta",
  },
  {
    href: "/budget/categories",
    label: "Kategorie",
  },
  {
    href: "/budget/raports",
    label: "Raporty",
  },
  {
    href: "/budget/settings",
    label: "Ustawienia",
  },
];

const Header = (props: Props) => {
  return (
    <div
      className={"my-2 flex items-center justify-center gap-5 bg-purple-500"}
    >
      {routes.map((route, index) => (
        <NavButton key={index} href={route.href} label={route.label} />
      ))}
      <ClerkLoaded>
        <UserButton afterSignOutUrl="/" />
      </ClerkLoaded>
      <ClerkLoading>
        <Loader2 className={"w-12 h-12 text-muted-foreground animate-spin"} />
      </ClerkLoading>
    </div>
  );
};
export default Header;
