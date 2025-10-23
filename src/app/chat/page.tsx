"use client";

import * as React from "react";
import { useAtom } from "jotai";
import ChatAgentSelector from "../components/Chat/ChatAgentSelector";
import ChatInteractionContainer from "../components/Chat/ChatInteractionContainer";
import { chatsStore } from "../store/chat";
import useWsConnection from "../lib/useWsConnection";
import { isAuth } from "../store";
import MessageBanner from "../components/common/MessageBanner";
import internalClient from "../lib/internalHttpClient";
import useWallet from "@/utils/wallet";

export default function OPOS() {
  const [_, setChats] = useAtom(chatsStore);
  const [isUserAuth] = useAtom(isAuth);
  const wallet = useWallet();

  const socket = useWsConnection({ isAuth: isUserAuth });
  const [showMessage, setShowMessage] = React.useState<boolean>(false);

  const [hasAllowed, setHasAllowed] = React.useState<boolean>(false);
  const [membershipStatus, setMembershipStatus] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const checkUsage = async () => {
    console.log("membershipStatus", membershipStatus);
    if (membershipStatus !== "active") {
      try {
        const result = await internalClient.get("/api/check-usage", {
          params: {
            wallet: wallet?.publicKey.toBase58(),
            agentId: "",
            role: "guest",
          },
        });
        setShowMessage(!result.data.allowed);
        setHasAllowed(result.data.allowed);
        setIsLoading(false);
      } catch (error) {
        setShowMessage(true);
        setHasAllowed(false);
        setIsLoading(false);
      }
    } else {
      setShowMessage(false);
      setHasAllowed(true);
      setIsLoading(false);
    }
  };
  const checkMembershipStatus = async () => {
    const token = localStorage.getItem("token") || "";
    const membershipInfo = await internalClient.get(
      "/api/membership/has-membership?wallet=" + wallet!.publicKey.toBase58(),
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setMembershipStatus(membershipInfo.data);
  };

  React.useEffect(() => {
    if (membershipStatus.length > 0) {
      checkUsage();
    }
  }, [membershipStatus]);
  React.useEffect(() => {
    if (wallet) {
      checkMembershipStatus();
    }
  }, [wallet])

  React.useEffect(() => {
    if (socket) {
      socket!.onmessage = (event) => {
        const message = event.data;

        if (message === "connected") return;

        const data = JSON.parse(message);

        if (["aiMessage", "userMessage", "message"].includes(data.event)) {
          const message = data.data;

          setChats((prev) => {
            const newChats = [...prev];

            const currentChatIdx = newChats.findIndex(
              (e) =>
                e.chatAgent?.id === message.agent_id || e.id === message.chat_id
            );

            const messages = newChats[currentChatIdx].messages;

            if (!messages) {
              newChats[currentChatIdx].messages = [message];
              newChats[currentChatIdx].lastMessage = message;
              return newChats;
            }

            if (messages.length === 0) {
              newChats[currentChatIdx].messages = [message];
              newChats[currentChatIdx].lastMessage = message;
              return newChats;
            }

            if (
              messages[messages.length - 1].type === "bot" &&
              message.type === "bot"
            ) {
              messages[messages.length - 1].content += message.content;
              if (newChats[currentChatIdx].lastMessage?.id) {
                newChats[currentChatIdx].lastMessage!.content +=
                  message.content;
              } else {
                newChats[currentChatIdx].lastMessage = message;
              }
              messages[messages.length - 1].is_loading = false;
            } else {
              newChats[currentChatIdx].messages.push(message);
              newChats[currentChatIdx].lastMessage = message;
            }

            return newChats;
          });

          const objDiv = document.getElementById("message-container");
          if (objDiv) {
            setTimeout(function () {
              objDiv.scrollTo({
                top: -objDiv.offsetTop,
              });
            }, 100);
          }
        }
      };
    }
  }, [socket]);

  return (
    <>
      {showMessage && (
        <div>
          <MessageBanner
            type="warn"
            message="Daily usage limit ($0.20) reached. Access temporarily disabled."
          />
        </div>
      )}
      <div className="background-content flex w-full justify-center overflow-y-hidden min-h-full">
        <ChatAgentSelector isLoading={isLoading} />

        <ChatInteractionContainer setShowMessage={setShowMessage} hasAllowed={hasAllowed} checkUsage={() => checkUsage()}/>
      </div>
    </>
  );
}
