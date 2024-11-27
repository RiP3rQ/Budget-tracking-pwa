"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  key: number;
  href: string;
  label: string;
};
const NavButton = ({ key, href, label }: Readonly<Props>) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Button
      asChild
      key={key}
      variant={"outline"}
      className={cn(
        "w-auto justify-between font-normal hover:bg-white/20 hover:text-white" +
          " border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-white focus:bg-white/30 transition",
        isActive ? "bg-white/10 text-white" : "bg-transparent",
      )}
    >
      <Link href={href}>{label}</Link>
    </Button>
  );
};
export default NavButton;
