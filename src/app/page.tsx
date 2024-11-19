"use client";

import * as React from "react";
import Image from "next/image";
import ArrowUpHome from "@/assets/icons/ArrowUpHome";
import { AIChatMessage } from "./models/AIChatMessage";
import { data, userData } from "./store";
import { useAtom } from "jotai";
import Markdown from "markdown-to-jsx";

export default function Home() {
  const lastBotMessageIndex = React.useRef(0);
  const [currentUser] = useAtom(data);
  const [user] = useAtom(userData);

  const [text, setText] = React.useState("");
  const [messages, setMessages] = React.useState<AIChatMessage[]>([]);
  const [isDisabled, setIsDisabled] = React.useState(false);

  const messagesRef = React.useRef<HTMLDivElement>(null);

  const sendToAI = async () => {
    try {
      setIsDisabled(true);
      setMessages([
        ...messages,
        {
          type: "user",
          message: text,
        },
      ]);
      setText("");

      const response = await fetch(
        "https://mmoshapi-uodcouqmia-uc.a.run.app/generate_stream/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: currentUser?.profile.username ?? user?.name ?? "Visitor",
            prompt: text,
            namespaces: [],
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      if (!response.body) return;

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let messageContent = "";

      const existingMessages = [
        ...messages,
        {
          type: "user",
          message: text,
        },
      ];

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        messageContent += chunk;

        setMessages([
          ...existingMessages,
          {
            type: "bot",
            message: messageContent,
            index: lastBotMessageIndex.current,
          },
        ]);

        if (messagesRef.current) {
          messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        }
      }

      lastBotMessageIndex.current += 1;
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsDisabled(false);
    }
  };

  const getMessageImage = React.useCallback(
    (message: AIChatMessage) => {
      if (message.type === "user") {
        if (!currentUser) {
          if (!user)
            return "https://storage.googleapis.com/mmosh-assets/g_avatar.png";

          return "https://storage.googleapis.com/mmosh-assets/v_avatar.png";
        }

        return currentUser!.profile.image;
      }

      if ((message.index || 0) % 2 === 0) {
        return "https://storage.googleapis.com/mmosh-assets/uncle-psy.png";
      }

      return "https://storage.googleapis.com/mmosh-assets/aunt-bea.png";
    },
    [currentUser, user],
  );

  const getMessageUsername = React.useCallback(
    (message: AIChatMessage) => {
      if (message.type === "user") {
        if (!currentUser) {
          if (!user) return "Guest";

          return user.name;
        }

        return currentUser!.profile.username;
      }

      if ((message.index || 0) % 2 === 0) {
        return "Uncle Psy";
      }

      return "Aunt Bea";
    },
    [currentUser, user],
  );

  return (
    <div className="background-content flex w-full h-full justify-center">
      <div className="lg:w-[60%] md:w-[75%] w-[90%] h-[65vh] flex flex-col p-2 rounded-xl mt-16 bg-[#181747] backdrop-filter backdrop-blur-[6px]">
        <div className="bg-[#030234] flex w-full justify-center items-center">
          <div className="relative w-[3vmax] h-[5vmax]">
            <Image
              src="https://storage.googleapis.com/mmosh-assets/uncle-psy.png"
              alt="Uncle Psy"
              layout="fill"
            />
          </div>

          <div className="relative w-[8vmax] h-[5vmax] mx-8">
            <Image
              src="https://storage.googleapis.com/mmosh-assets/opos-logo.png"
              alt="Opos logo"
              layout="fill"
            />
          </div>

          <div className="relative w-[3vmax] h-[5vmax]">
            <Image
              src="https://storage.googleapis.com/mmosh-assets/aunt-bea.png"
              alt="Aunt Bea"
              layout="fill"
            />
          </div>
        </div>

        <div className="w-full flex flex-col items-center mt-4">
          <h4 className="text-xl">Ask Uncle Psy and Aunt Bea</h4>
          <p className="text-base">The Composable Opossums.</p>
        </div>

        <div
          className="w-full h-full flex flex-col grow overflow-y-auto px-4"
          ref={messagesRef}
        >
          {messages.map((message, index) => (
            <div
              className="w-full flex items-center justify-start my-1 rounded-lg"
              key={`${message.type}-${index}`}
            >
              <div className="relative w-[2vmax] h-[2vmax]">
                <Image
                  layout="fill"
                  src={getMessageImage(message)}
                  alt="image"
                  className="rounded-full"
                />
              </div>

              <div className="w-full justify-between ml-4 flex flex-col py-2 px-6 rounded-lg">
                <p className="text-base text-white">
                  {getMessageUsername(message)}
                </p>
                <Markdown children={message.message} />
              </div>
            </div>
          ))}
        </div>

        <div className="w-full pb-4 px-12">
          <form
            className="w-full flex justify-between p-2 bg-[#BBBBBB21] border-[1px] border-[#06052D] rounded-lg"
            onSubmit={(e) => {
              e.preventDefault();
              sendToAI();
            }}
          >
            <input
              className="home-ai-textfield w-full mr-4 px-2"
              type="text"
              placeholder="Ask Uncle Psy and Aunt Bea"
              value={text}
              onChange={(e) => {
                setText(e.target.value);
              }}
            />

            <button
              className={`p-3 rounded-lg ${!text ? "bg-[#565656]" : "bg-[#FFF]"}`}
              disabled={!text || isDisabled}
              type="submit"
            >
              <ArrowUpHome />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
