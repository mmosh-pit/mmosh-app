import { db } from "@/app/lib/mongoClient";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

interface NotificationParams {
  type: string;
  message: string;
  unread: number;
  sender: string;
  receiver: string;
  created_date: Date;
}

interface TransactionRequest {
  amount: number;
  currency: string;
  senderAddress: string;
  receiverAddress: string;
  transactionHash?: string;
}

export async function POST(req: NextRequest) {
  try {
    const {
      amount,
      currency,
      senderAddress,
      receiverAddress,
      transactionHash,
    } = (await req.json()) as TransactionRequest;

    const authHeader = req.headers.get("authorization");

    // Validate required fields
    if (!amount || !currency || !senderAddress || !receiverAddress) {
      return NextResponse.json(
        {
          error: "Missing required fields: amount, currency, sender, receiver",
        },
        { status: 400 }
      );
    }

    const senderName: string = await getSenderName(senderAddress);

    // Create notification message
    const message = `You've received ${amount} ${currency} from ${senderName || senderAddress}`;

    // Prepare notification params
    const notificationParams: NotificationParams = {
      type: "transaction_received",
      message: message,
      unread: 1,
      sender: senderAddress,
      receiver: receiverAddress,
      created_date: new Date(),
    };

    // Send notification
    await sendNotification(notificationParams);
    await pushNotification(authHeader || "", notificationParams);

    return NextResponse.json(
      {
        success: true,
        message: "Notification sent successfully",
        notification: notificationParams,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating notification:", error);
    return NextResponse.json(
      { error: "Failed to create notification" },
      { status: 500 }
    );
  }
}

const sendNotification = async (params: NotificationParams) => {
  const notification = db.collection("mmosh-app-notifications");
  const notificationDetail = await notification.findOne({
    receiver: params.receiver,
    type: params.type,
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

/**
 * Push notifications to one signal queue.
 * Sends relevant titles/messages for transactions.
 */
const pushNotification = async (
  token: string,
  notification: NotificationParams
) => {
  try {
    let title = "Transaction Alert";
    let message = notification.message;
    const msg = message.toLowerCase();

    // Dynamically adjust the title based on context
    if (msg.includes("received")) {
      title = "Payment Received";
    } else if (msg.includes("sent")) {
      title = "Payment Sent";
    } else if (msg.includes("failed")) {
      title = "Transaction Failed";
    } else if (msg.includes("pending")) {
      title = "Transaction Pending";
    } else if (msg.includes("confirmed")) {
      title = "Transaction Confirmed";
    }
    console.log("===== RECEIVER WALLET ADDRESS =====", notification.receiver);

    const pushNotificationParams = {
      title,
      message,
      wallet: notification.receiver,
    };

    await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/push-notification`,
      pushNotificationParams,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    return true;
  } catch (error) {
    return false;
  }
};
