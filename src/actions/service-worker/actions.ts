"use server";

import webpush from "web-push";
import { PushSubscriptionWithKeys } from "@/providers/push-notifcations-provider";

const vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY!,
  privateKey: process.env.VAPID_PRIVATE_KEY!,
};

webpush.setVapidDetails(
  process.env.NEXT_PUBLIC_APP_URL!,
  vapidKeys.publicKey,
  vapidKeys.privateKey,
);

export async function sendNotification(
  message: string,
  subscription?: PushSubscriptionWithKeys,
) {
  if (!subscription) {
    throw new Error("No subscription available");
  }

  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: "Śledzenie budżetu - powiadomienie",
        body: message,
        icon: "/icon.png",
      }),
    );
    return { success: true };
  } catch (error) {
    console.error("Error sending push notification:", error);
    return { success: false, error: "Failed to send notification" };
  }
}
