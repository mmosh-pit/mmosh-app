"use client";

import * as React from "react";
import { useAtom } from "jotai";
import ChatAgentSelector from "../components/Chat/ChatAgentSelector";
import ChatInteractionContainer from "../components/Chat/ChatInteractionContainer";
import { chatsStore } from "../store/chat";
import useWsConnection from "../lib/useWsConnection";
import { data, isAuth } from "../store";
import { useRouter } from "next/navigation";
import client from "../lib/httpClient";

export default function OPOS() {
  const router = useRouter();
  const [_, setChats] = useAtom(chatsStore);
  const [isUserAuth, setIsUserAuthenticated] = useAtom(isAuth);
  const [__, setCurrentUser] = useAtom(data);

  const socket = useWsConnection({ isAuth: isUserAuth });

  const checkIfIsAuthenticated = React.useCallback(async () => {
    const url = `/is-auth`;

    try {
      const result = await client.get(url);

      const user = result.data?.data?.user;

      if (user) {
        setIsUserAuthenticated(true);
        setCurrentUser(user);
        if (user.onboarding_step < 4) {
          router.replace("/account");
        }
      } else {
        router.replace("/login");
      }
    } catch (err) {
      router.replace("/login");
    }
  }, [router, setIsUserAuthenticated, setCurrentUser]);

  React.useEffect(() => {
    if (!isUserAuth) {
      checkIfIsAuthenticated();
    }
  }, [isUserAuth, checkIfIsAuthenticated]);

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
                e.chatAgent?.id === message.agent_id ||
                e.id === message.chat_id,
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
    <div className="background-content flex w-full justify-center overflow-y-hidden min-h-full">
      <ChatAgentSelector />

      <ChatInteractionContainer socket={socket} />
    </div>
  );
}
