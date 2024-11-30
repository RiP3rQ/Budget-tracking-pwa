import Header from "@/components/header";
import { SwWrapper } from "@/service-worker/sw-wrapper";

type Props = {
  children: React.ReactNode;
};

const BudgetLayout = ({ children }: Props) => {
  return (
    <>
      <Header />
      <main className={"px-3 lg:px-14"}>{children}</main>
      <SwWrapper />
    </>
  );
};

export default BudgetLayout;
