"use client";

import * as React from "react";
import Image from "next/image";
import ArrowUpHome from "@/assets/icons/ArrowUpHome";
import { AIChatMessage } from "../models/AIChatMessage";
import { data, userData } from "../store";
import { useAtom } from "jotai";
import Markdown from "markdown-to-jsx";
import { Bars } from "react-loader-spinner";
import { bagsNfts } from "../store/bags";

export default function OPOS() {
  const lastBotMessageIndex = React.useRef(0);
  const [currentUser] = useAtom(data);
  const [user] = useAtom(userData);
  const [nfts] = useAtom(bagsNfts);

  const [text, setText] = React.useState("");
  const [availableNamespaces, setAvailableNamespaces] = React.useState<
    string[]
  >([]);
  const [messages, setMessages] = React.useState<AIChatMessage[]>([]);
  const [isDisabled, setIsDisabled] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const messagesRef = React.useRef<HTMLDivElement>(null);

  const sendToAI = async () => {
    const namespaces = ["PUBLIC", ...availableNamespaces];

    if (currentUser?.profilenft) {
      namespaces.push("PRIVATE");
    }

    try {
      setIsDisabled(true);
      setIsLoading(true);
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
            namespaces: namespaces,
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

      setIsLoading(false);

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

  const setupAvailableNamespaces = React.useCallback(() => {
    if (!nfts?.passes) return;

    const namespaces: string[] = [];

    for (const nft of nfts.passes) {
      if (!nft.parentKey) continue;
      namespaces.push(nft.parentKey);
    }

    setAvailableNamespaces(namespaces);
  }, [nfts]);

  React.useEffect(() => {
    setupAvailableNamespaces();
  }, [nfts]);

  return (
    <div className="background-content flex w-full h-full justify-center">
      <div className="lg:w-[60%] md:w-[75%] w-[90%] h-[65vh] flex flex-col p-2 rounded-xl mt-16 bg-[#181747] backdrop-filter backdrop-blur-[6px]">
        <div className="flex justify-center items-center bg-[#030234] w-full py-2 rounded-t-xl">
          <div className="flex flex-col">
            <div className="relative w-[4vmax] h-[5vmax]">
              <Image
                src="https://storage.googleapis.com/mmosh-assets/uncle_psy.png"
                alt="Uncle Psy"
                layout="fill"
              />
            </div>
            <p className="text-base text-white">Uncle Psy</p>
          </div>

          <div className="mx-4" />

          <div className="flex flex-col">
            <div className="relative w-[4vmax] h-[5vmax]">
              <Image
                src="https://storage.googleapis.com/mmosh-assets/aunt_bea.png"
                alt="Aunt Bea"
                layout="fill"
              />
            </div>
            <p className="text-base text-white">Aunt Bea</p>
          </div>
        </div>

        <div
          className="w-full h-full flex flex-col items-center grow overflow-y-auto px-16"
          ref={messagesRef}
        >
          <div className="flex flex-col items-center max-w-[85%] mt-8">
            <p className="text-sm text-[#C1C1C1] text-center">
              Hello, I’m Uncle Psy, your Kinship Greeter! Aunt Bea and I
              currently have two active agents, CAT-FAWN Connection, a
              self-hypnosis program for mental, physical, spiritual and
              emotional wellbeing, and FULL Disclosure Bot, which is working to
              expose hidden forces and nefarious programs and reveal the truth
              of our Star Trek future.
            </p>

            <div className="my-2" />

            <p className="text-sm text-[#C1C1C1] text-center">
              You can address your questions and requests to me, Aunt Bea or to
              any of the active agents.
            </p>
          </div>

          {messages.length > 0 && (
            <div className="my-2 h-[2px] w-full bg-[#2D2C56]" />
          )}

          {messages.map((message, index) => (
            <div
              className={`w-full flex items-center ${message.type === "bot" ? "justify-start" : "justify-end"} my-1 rounded-lg`}
              key={`${message.type}-${index}`}
            >
              {message.type === "bot" ? (
                <>
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
                </>
              ) : (
                <>
                  <div className="justify-between ml-4 flex flex-col py-2 px-6 rounded-lg">
                    <p className="text-base text-white text-end">
                      {getMessageUsername(message)}
                    </p>
                    <Markdown children={message.message} />
                  </div>
                  <div className="relative w-[2vmax] h-[2vmax]">
                    <Image
                      layout="fill"
                      src={getMessageImage(message)}
                      alt="image"
                      className="rounded-full"
                    />
                  </div>
                </>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="w-full flex items-center justify-start my-1 rounded-lg">
              <div className="relative w-[2vmax] h-[2vmax]">
                <Image
                  layout="fill"
                  src={getMessageImage({
                    type: "bot",
                    message: "",
                  })}
                  alt="image"
                  className="rounded-full"
                />
              </div>

              <div className="w-full justify-between ml-4 flex flex-col py-2 px-6 rounded-lg">
                <Bars
                  height="60"
                  width="60"
                  color="rgba(255, 0, 199, 1)"
                  ariaLabel="bars-loading"
                  wrapperStyle={{}}
                  wrapperClass="bars-loading"
                  visible={true}
                />
              </div>
            </div>
          )}
        </div>

        <div className="w-full pb-4 px-12">
          <form
            className="w-full flex justify-between p-2 bg-[#BBBBBB21] border-[1px] border-[#06052D] rounded-lg"
            onSubmit={(e) => {
              e.preventDefault();
              sendToAI();
            }}
          >
            <textarea
              className="home-ai-textfield w-full mr-4 px-2"
              placeholder="Ask Uncle Psy and Aunt Bea"
              rows={2}
              wrap="hard"
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
