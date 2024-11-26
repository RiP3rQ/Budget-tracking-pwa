import Header from "@/app/(dashboard)/budget/_components/header";

type Props = {
  children: React.ReactNode;
};

const BudgetLayout = ({ children }: Props) => {
  return (
    <>
      <Header />
      <main className={"px-3 lg:px-14"}>{children}</main>
    </>
  );
};

export default BudgetLayout;
