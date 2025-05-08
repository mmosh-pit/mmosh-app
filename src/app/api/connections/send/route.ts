import { db } from "../../../lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    // status from api
    // 0 - requested
    // 1 - follow
    // 2 - unlinked
    // 3 - cancelling requested
    // 4 - accept logic
    // 5 - decline logic

    console.log("test a")

    const collection = db.collection("mmosh-app-connections");
    const usercollection = db.collection("mmosh-users");

    console.log("test b")

    const { sender, receiver, status, badge} = await req.json();

    console.log("test c")
    
    const senderDetail = await usercollection.findOne({
        wallet: sender,
    });

    console.log("test d")

    const receiverDetail = await usercollection.findOne({
        wallet: receiver,
    });

    console.log("test e")

    if(!receiverDetail || !senderDetail) {
        return NextResponse.json("", { status: 200 });
    }

    // unlink logic
    if(status == 2) {
        await collection.deleteOne({ 
            sender: sender,
            receiver: receiver,
            status: 2
        });
        await collection.deleteOne({ 
            sender: receiver,
            receiver: sender,
            status: 2
        });

        await collection.updateOne(
            {
                sender: sender,
                receiver: receiver,
            },
            {
              $set: {
                status: 3,
              },
            },
        );

        receiverDetail.profile.follower = receiverDetail.profile.follower ? receiverDetail.profile.follower - 1 : 0;
        await usercollection.updateOne(
            {
                wallet: receiver,
            },
            {
                $set: {
                   profile: receiverDetail.profile,
                },
            },
        );
        senderDetail.profile.following = senderDetail.profile.following ? senderDetail.profile.following - 1 : 0;
        await usercollection.updateOne(
            {
                wallet: sender,
            },
            {
                $set: {
                profile: senderDetail.profile,
                },
            },
        );
        await sendNotification({
            type: "unlink",
            message: senderDetail.profile.username + " unlinked from your connection",
            unread: 1,
            sender,
            receiver,
            created_date:new Date()
        })
  
    } 

    // request logic
    if(status == 0) {
        const connectionDetail = await collection.findOne({
            sender: sender,
            receiver: receiver,
        });

        if (!connectionDetail) {
            await collection.insertOne({
                sender,
                receiver,
                status:0,
                badge
            })
            await sendNotification({
                type: "request",
                message: senderDetail.profile.username + " sent you connection request",
                unread: 0,
                sender,
                receiver,
                created_date:new Date()
            })
        } else {
            await collection.updateOne(
                {
                    sender: sender,
                    receiver: receiver,
                },
                {
                  $set: {
                    status: 0,
                  },
                },
            );
        }
    }

    // unfollow logic
    if(status == 3) {
        await collection.updateOne(
            {
                sender: sender,
                receiver: receiver,
            },
            {
              $set: {
                status: 3,
              },
            },
        );
    }

    if(status == 4 || status == 1) {
        console.log("test 1")
        if(status == 4) {
            await collection.updateOne(
                {
                    sender: sender,
                    receiver: receiver,
                },
                {
                  $set: {
                    status: 1,
                  },
                },
            );
            console.log("test 2")
        } else {
            const connectionDetail = await collection.findOne({
                sender: sender,
                receiver: receiver,
                status: 3
            });

            if(connectionDetail) {
                await collection.updateOne(
                    {
                        sender: sender,
                        receiver: receiver,
                    },
                    {
                      $set: {
                        status: 1,
                      },
                    },
                );
            } else {
                await collection.insertOne({
                    sender,
                    receiver,
                    status:1,
                    badge
                })
                console.log("test 3")
            }
        }
        console.log("test 4")
        receiverDetail.profile.follower =  receiverDetail.profile.follower ? receiverDetail.profile.follower + 1 : 1
        console.log("test 5")
        await usercollection.updateOne(
            {
                wallet: receiver,
            },
            {
                $set: {
                profile: receiverDetail.profile,
                },
            },
        );
        console.log("test 6")
        senderDetail.profile.following = senderDetail.profile.following ? senderDetail.profile.following + 1 : 1;
        console.log("test 7")
        await usercollection.updateOne(
            {
                wallet: sender,
            },
            {
                $set: {
                   profile: senderDetail.profile
                },
            },
        );
        console.log("test 8")
        if(status == 4) {
            console.log("test 9")
            await sendNotification({
                type: "accept",
                message: receiverDetail.profile.username + " accepted your connection request",
                unread: 1,
                sender: receiver,
                receiver: sender,
                created_date:new Date()
            })
        } else {
            console.log("test 10")
            await sendNotification({
                type: "follow",
                message: senderDetail.profile.username + " connected with you",
                unread: 1,
                sender,
                receiver,
                created_date:new Date()
            })
        }
        console.log("test 11")
        const connectionDetail = await collection.findOne({
            sender: receiver,
            receiver: sender,
            status: 1
        });

        if(connectionDetail) {
            await collection.insertOne({
                sender,
                receiver,
                status:2,
                badge
            })
            await collection.insertOne({
                sender: receiver,
                receiver: sender,
                status:2,
                badge
            })
        }
    }

    if(status == 5) {
        await collection.updateOne(
            {
                sender: sender,
                receiver: receiver,
            },
            {
              $set: {
                status: 3,
              },
            },
        );
        await sendNotification({
            type: "decline",
            message: receiverDetail.profile.username + " decline your connection request",
            unread: 1,
            sender: receiver,
            receiver: sender,
            created_date:new Date()
        })
    }

    return NextResponse.json("", { status: 200 });
}

const sendNotification = async (params:any) => {
    const notification = db.collection("mmosh-app-notifications");
    const notificationDetail = await notification.findOne({
        sender: params.sender,
        receiver: params.receiver,
        type: params.type
    });

    if(!notificationDetail) {
        await notification.insertOne(params)
    }
}