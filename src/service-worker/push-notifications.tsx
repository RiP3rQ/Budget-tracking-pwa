"use client";

import { useEffect, useState } from "react";
import { Bell, BellOff, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { urlBase64ToUint8Array } from "@/service-worker/url-base-to-uint-array";
import { usePushNotification } from "@/providers/push-notifcations-provider";

interface PushNotificationManagerProps {
  className?: string;
  position?: "top" | "bottom";
  showTestFeature?: boolean;
  onStatusChange?: (isSubscribed: boolean) => void;
}

export function PushNotificationManager({
  className,
  position = "bottom",
  showTestFeature = true,
  onStatusChange,
}: PushNotificationManagerProps) {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null,
  );
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const pushNotificationContext = usePushNotification();

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      registerServiceWorker();
    }
  }, []);

  useEffect(() => {
    onStatusChange?.(!!subscription);
  }, [subscription, onStatusChange]);

  async function registerServiceWorker() {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
        updateViaCache: "none",
      });

      const sub = await registration.pushManager.getSubscription();
      setSubscription(sub);
    } catch (error) {
      console.error("Service Worker registration failed:", error);
    }
  }

  async function subscribeToPush() {
    setIsLoading(true);
    setError(null);
    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
        ),
      });
      setSubscription(sub);
    } catch (error) {
      setError("Failed to subscribe to push notifications");
      console.error("Push subscription failed:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function unsubscribeFromPush() {
    setIsLoading(true);
    setError(null);
    try {
      await subscription?.unsubscribe();
      setSubscription(null);
    } catch (error) {
      setError("Failed to unsubscribe from push notifications");
      console.error("Push unsubscription failed:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function sendTestNotification() {
    try {
      if (!pushNotificationContext || !pushNotificationContext.subscription) {
        throw new Error("No subscription available");
      }
      setIsLoading(true);

      await pushNotificationContext.sendPushNotification(
        message,
        pushNotificationContext.subscription,
      );
      setMessage("");
    } catch (e) {
      console.error("Failed to send push notification:", e);
      throw new Error("Failed to send push notification");
    } finally {
      setIsLoading(false);
    }
  }

  if (!isSupported) {
    return (
      <div className="p-4 bg-destructive/15 text-destructive rounded-md">
        Powiadomienia push nie są obsługiwane w tej przeglądarce.
      </div>
    );
  }

  return (
    <div
      className={cn(
        "w-[300px]",
        position === "bottom" ? "mb-4" : "mt-4",
        className,
      )}
    >
      <Collapsible
        open={isExpanded}
        onOpenChange={setIsExpanded}
        className={cn(
          "transition-all duration-300 ease-in-out",
          isExpanded ? "w-[300px]" : "w-auto",
        )}
      >
        <div className="flex items-center justify-between space-x-4 px-4">
          <div className=""></div>
          <CollapsibleTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "w-10 h-10 p-0 rounded-full bg-gray-100 border border-gray-200 shadow-sm",
                subscription ? "text-green-500" : "text-destructive",
              )}
            >
              <div className="flex items-center justify-center">
                {subscription ? (
                  <Bell className="h-4 w-4" />
                ) : (
                  <BellOff className="h-4 w-4" />
                )}
              </div>
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent
          className={cn(
            "absolute right-0 mt-2 w-[300px] rounded-md border bg-popover p-4 shadow-md transition-all",
            isExpanded
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-2",
          )}
        >
          <div className="rounded-md border px-4 py-3 font-mono text-sm">
            {error && (
              <div className="mb-2 p-2 bg-destructive/15 text-destructive text-sm rounded">
                {error}
              </div>
            )}
            {subscription ? (
              <>
                <p className="text-sm text-muted-foreground mb-2">
                  Powiadomienia są włączone.
                </p>
                {showTestFeature && (
                  <div className="flex space-x-2 mb-2">
                    <Input
                      type="text"
                      placeholder="Testowa wiadomość"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className={"h-8"}
                    />
                    <Button
                      size="sm"
                      onClick={sendTestNotification}
                      disabled={!message || isLoading}
                      className={"h-8"}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                <Button
                  variant="destructive"
                  onClick={unsubscribeFromPush}
                  disabled={isLoading}
                  className="w-full"
                >
                  Wyłącz powiadomienia
                </Button>
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-2">
                  Powiadomienia są wyłączone.
                </p>
                <Button
                  onClick={subscribeToPush}
                  disabled={isLoading}
                  className="w-full"
                >
                  Włącz powiadomienia
                </Button>
              </>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
