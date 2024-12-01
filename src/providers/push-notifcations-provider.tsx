"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { urlBase64ToUint8Array } from "@/service-worker/url-base-to-uint-array";
import { sendNotification } from "@/actions/service-worker/actions";

export type PushSubscriptionWithKeys = PushSubscription & {
  keys: { p256dh: string; auth: string };
};

interface PushNotificationContextType {
  isSupported: boolean;
  subscription: PushSubscriptionWithKeys | null;
  sendPushNotification: (
    message: string,
    subscription?: PushSubscriptionWithKeys,
  ) => Promise<void>;
  unsubscribeFromPush: () => Promise<void>;
}

const PushNotificationContext = createContext<
  PushNotificationContextType | undefined
>(undefined);

export function PushNotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] =
    useState<PushSubscriptionWithKeys | null>(null);

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      initializePushNotifications();
    }
  }, []);

  async function initializePushNotifications() {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        console.error("Permission not granted for Notification");
        return;
      }

      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
        updateViaCache: "none",
      });

      const existingSub =
        (await registration.pushManager.getSubscription()) as PushSubscriptionWithKeys | null;

      if (existingSub) {
        setSubscription(existingSub);
      } else {
        await subscribeToPush(registration);
      }
    } catch (error) {
      console.error("Push notification initialization failed:", error);
    }
  }

  async function subscribeToPush(registration: ServiceWorkerRegistration) {
    try {
      const sub = (await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
        ),
      })) as PushSubscriptionWithKeys;
      setSubscription(sub);
    } catch (error) {
      console.error("Push subscription failed:", error);
    }
  }

  async function unsubscribeFromPush() {
    try {
      await subscription?.unsubscribe();
      setSubscription(null);
    } catch (error) {
      console.error("Push unsubscription failed:", error);
    }
  }

  async function sendPushNotification(
    message: string,
    subscription?: PushSubscriptionWithKeys,
  ) {
    console.log("Sending push notification");
    console.log("Message:", message);
    console.log("Subscription:", subscription);
    if (!subscription) {
      console.error("No push subscription available");
      return;
    }
    try {
      await sendNotification(message, subscription);
    } catch (error) {
      console.error("Failed to send push notification:", error);
    }
  }

  const value = useMemo(() => {
    return {
      isSupported,
      subscription,
      sendPushNotification,
      unsubscribeFromPush,
    };
  }, [isSupported, subscription]);

  return (
    <PushNotificationContext.Provider value={value}>
      {children}
    </PushNotificationContext.Provider>
  );
}

export function usePushNotification() {
  const context = useContext(PushNotificationContext);
  if (context === undefined) {
    throw new Error(
      "usePushNotification must be used within a PushNotificationProvider",
    );
  }
  return context;
}
