import Header from "@/components/header";
import { SwWrapper } from "@/service-worker/sw-wrapper";
import { PushNotificationProvider } from "@/providers/push-notifcations-provider";

type Props = {
  children: React.ReactNode;
};

const BudgetLayout = ({ children }: Props) => {
  return (
    <>
      <PushNotificationProvider>
        <Header />
        <main className={"px-3 lg:px-14"}>{children}</main>
        <SwWrapper />
      </PushNotificationProvider>
    </>
  );
};

export default BudgetLayout;
