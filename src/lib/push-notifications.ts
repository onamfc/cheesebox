import { Expo, ExpoPushMessage } from "expo-server-sdk";

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
    console.error(`Push token ${pushToken} is not a valid Expo push token`);
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
      console.error(
        `Error sending push notification: ${ticketChunk[0].message}`
      );
      return false;
    }

    console.log(`Push notification sent successfully to ${pushToken}`);
    return true;
  } catch (error) {
    console.error("Error sending push notification:", error);
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
        console.error("Error sending push notification chunk:", error);
      }
    }

    console.log(`Sent ${messages.length} push notifications`);
  } catch (error) {
    console.error("Error sending bulk push notifications:", error);
  }
}
