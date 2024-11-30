import { PushNotificationManager } from "@/service-worker/push-notifications";
import { InstallPrompt } from "@/service-worker/install-prompt";

export function SwWrapper() {
  return (
    <div>
      <PushNotificationManager />
      <InstallPrompt />
    </div>
  );
}
