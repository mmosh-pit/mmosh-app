import { db } from "@/app/lib/mongoClient";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

interface PurchaseNotificationBody {
  senderWallet: string;
  botName: string;
  receiverWallet: string;
  isSubscribed: boolean;
}

interface NotificationParams {
  type: string;
  message: string;
  unread: number;
  sender: string;
  receiver: string;
  created_date: Date;
}

export async function POST(req: NextRequest) {
  try {
    const { senderWallet, botName, receiverWallet, isSubscribed } =
      (await req.json()) as PurchaseNotificationBody;

    const authHeader = req.headers.get("authorization");

    // Validate required fields
    if (!senderWallet || !botName || !receiverWallet) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing required fields: buyerName, offerName, receiverWallet",
        },
        { status: 400 }
      );
    }
    const buyerName = await getSenderName(senderWallet);

    // Create notification message
    let message = `${buyerName} purchased the ${botName.replace("bot", "")} Bot offer.`;
    if (isSubscribed) {
      message = `${buyerName} subscribed to your ${botName.replace("bot", "")} Bot offer`;
    }

    // Prepare notification parameters
    const notificationParams: NotificationParams = {
      type: "offer_purchase",
      message: message,
      unread: 1,
      sender: senderWallet,
      receiver: receiverWallet,
      created_date: new Date(),
    };

    // Send notification to seller
    await sendNotification(notificationParams);
    await pushNotification(authHeader || "", notificationParams);

    return NextResponse.json({
      success: true,
      message: "Notification sent successfully",
      data: {
        receiver: receiverWallet,
        notification: message,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create notification",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

const sendNotification = async (params: NotificationParams) => {
  const notification = db.collection("mmosh-app-notifications");
  const notificationDetail = await notification.findOne({
    receiver: params.receiver,
    type: params.type,
    unread: 1,
  });

  if (!notificationDetail || true) {
    await notification.insertOne(params);
  }
};

const getSenderName = async (senderWallet: string) => {
  const usersCollection = db.collection("mmosh-users");
  let username = "unknown user";
  const senderDetails = await usersCollection.findOne({ wallet: senderWallet });
  if (senderDetails !== null) {
    username = senderDetails.guest_data
      ? senderDetails.guest_data.username || senderDetails.name
      : senderDetails.name;
  }
  return username;
};

const pushNotification = async (
  token: string,
  notification: NotificationParams
) => {
  try {
    let title = "Bot Update";
    let message = notification.message;
    const msg = message.toLowerCase();

    if (msg.includes("subscribed")) {
      title = "Someone Subscribed to Your Bot!";
    } else if (msg.includes("purchased")) {
      title = "Bot offer Purchased!";
    }

    const pushNotificationParams = {
      title,
      message,
      wallet: notification.receiver,
    };

    await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/push-notification`,
      pushNotificationParams,
      { headers: { Authorization: token } }
    );

    return true;
  } catch (error) {
    console.error("Push notification error:", error);
    return false;
  }
};
