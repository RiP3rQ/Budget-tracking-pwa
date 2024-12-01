"use client";

import { ExternalToast, toast } from "sonner";
import { usePushNotification } from "@/providers/push-notifcations-provider";
import { useEffect } from "react";

type ToastType = "success" | "error" | "warning" | "info";

export function createNotificationUtil() {
  let pushNotificationContext: ReturnType<typeof usePushNotification> | null =
    null;

  const setPushContext = (context: ReturnType<typeof usePushNotification>) => {
    pushNotificationContext = context;
  };

  const showToast = (
    variant: ToastType,
    message: string,
    options?: ExternalToast,
  ) => {
    switch (variant) {
      case "success":
        toast.success(message, options);
        break;
      case "error":
        toast.error(message, options);
        break;
      case "warning":
        toast(message, {
          ...options,
          icon: "⚠️",
        });
        break;
      case "info":
        toast(message, {
          ...options,
          icon: "ℹ️",
        });
        break;
      default:
        toast(message, options);
    }
  };

  const SendToastAndPushNotification = async (
    variant: ToastType,
    message: string,
    options?: ExternalToast,
  ) => {
    // Always show toast
    showToast(variant, message, options);

    // If push notification context exists and we have a subscription, send push notification
    if (pushNotificationContext?.subscription) {
      try {
        await pushNotificationContext.sendPushNotification(
          message,
          pushNotificationContext.subscription,
        );
      } catch (error) {
        console.error("Failed to send push notification:", error);
      }
    }
  };

  return {
    setPushContext,
    SendToastAndPushNotification,
  };
}

// Create a singleton instance
export const notificationUtil = createNotificationUtil();

// Create a hook to initialize the notification utility with the push context
export function useInitNotifications() {
  const pushContext = usePushNotification();

  useEffect(() => {
    notificationUtil.setPushContext(pushContext);
  }, [pushContext]);
}
