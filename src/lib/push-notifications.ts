import { Expo, ExpoPushMessage } from "expo-server-sdk";
import dev from "@onamfc/developer-log";

const expo = new Expo();

export interface PushNotificationData extends Record<string, unknown> {
  videoId: string;
  sharedBy: string;
}

/**
 * Send a push notification to a user
 */
export async function sendPushNotification(
  pushToken: string,
  title: string,
  body: string,
  data?: PushNotificationData
): Promise<boolean> {
  // Check if the push token is valid
  if (!Expo.isExpoPushToken(pushToken)) {
    dev.error(`Push token ${pushToken} is not a valid Expo push token`, {tag: 'push-notifications'});
    return false;
  }

  // Create the message
  const message: ExpoPushMessage = {
    to: pushToken,
    sound: "default",
    title,
    body,
    data,
  };

  try {
    // Send the notification
    const ticketChunk = await expo.sendPushNotificationsAsync([message]);

    // Check for errors
    if (ticketChunk[0].status === "error") {
      dev.error(
        `Error sending push notification: ${ticketChunk[0].message}`, {tag: 'push-notifications'}
      );
      return false;
    }

    dev.log(`Push notification sent successfully to ${pushToken}`, {tag: 'push-notifications'});
    return true;
  } catch (error) {
    dev.error("Error sending push notification:", error, {tag: 'push-notifications'});
    return false;
  }
}

/**
 * Send push notifications to multiple users
 */
export async function sendBulkPushNotifications(
  notifications: Array<{
    pushToken: string;
    title: string;
    body: string;
    data?: PushNotificationData;
  }>
): Promise<void> {
  const messages: ExpoPushMessage[] = notifications
    .filter((notif) => Expo.isExpoPushToken(notif.pushToken))
    .map((notif) => ({
      to: notif.pushToken,
      sound: "default",
      title: notif.title,
      body: notif.body,
      data: notif.data,
    }));

  if (messages.length === 0) {
    return;
  }

  try {
    // Split messages into chunks of 100 (Expo's limit)
    const chunks = expo.chunkPushNotifications(messages);

    for (const chunk of chunks) {
      try {
        await expo.sendPushNotificationsAsync(chunk);
      } catch (error) {
        dev.error("Error sending push notification chunk:", error, {tag: 'push-notifications'});
      }
    }

    dev.log(`Sent ${messages.length} push notifications`, {tag: 'push-notifications'});
  } catch (error) {
    dev.error("Error sending bulk push notifications:", error, {tag: 'push-notifications'});
  }
}
