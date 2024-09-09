import * as React from "react";
import Image from "next/image";
import { useAtom } from "jotai";

import { CandidateInfo } from "@/app/models/candidateInfo";
import { AIChatMessage } from "@/app/models/AIChatMessage";
import { data } from "@/app/store";
import EditIcon from "@/assets/icons/EditIcon";
import Markdown from "markdown-to-jsx";

type Props = {
  candidateInfo: CandidateInfo;
};

const AIChat = ({ candidateInfo }: Props) => {
  const [currentUser] = useAtom(data);

  const [messages, setMessages] = React.useState<AIChatMessage[]>([]);
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null);

  const [isDisabled, setIsDisabled] = React.useState(false);

  const [currentText, setCurrentText] = React.useState("");

  const messagesRef = React.useRef<HTMLDivElement>(null);

  const getMessageImage = React.useCallback(
    (message: AIChatMessage) => {
      if (message.type === "user") {
        if (!currentUser) return "";

        return currentUser!.profile.image;
      }

      return "https://storage.googleapis.com/mmosh-assets/candidates/ptv_blue_square.png";
    },
    [currentUser],
  );

  const sendMessage = React.useCallback(async () => {
    try {
      setIsDisabled(true);
      setMessages([
        ...messages,
        {
          type: "user",
          message: currentText,
        },
      ]);
      setCurrentText("");

      const response = await fetch(
        "https://mmoshapi-uodcouqmia-uc.a.run.app/generate_stream/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: currentUser!.profile.username,
            prompt: currentText,
            coinsList: [], // Add coin list if needed e.g coinsList: ["BTC", "Eth"]
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      if (!response.body) return;

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        setMessages((prev) => {
          const newMessages = [...prev];

          newMessages[newMessages.length - 1].message += chunk;

          return newMessages;
        });

        if (messagesRef.current) {
          messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        }
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsDisabled(false);
    }
  }, [currentText, currentUser, messages]);

  return (
    <>
      <div className="w-full flex flex-col" ref={messagesRef}>
        {messages.map((message, index) => (
          <div className="w-full flex items-start justify-start">
            <div className="relative w-[2vmax] h-[2vmax]">
              <Image layout="fill" src={getMessageImage(message)} alt="image" />
            </div>

            <div className="w-full ml-4 flex bg-[#04024185] p-4">
              <Markdown children={message.message} />

              <button
                className="cursor-pointer"
                onClick={() => {
                  setEditingIndex(index);
                  setCurrentText(message.message);
                }}
              >
                <EditIcon />
              </button>
            </div>
          </div>
        ))}
      </div>

      <form
        className="w-full flex items-stretch justify-around mt-4"
        onSubmit={sendMessage}
      >
        <input
          type="text"
          value={currentText}
          disabled={isDisabled}
          onChange={(e) => setCurrentText(e.target.value)}
          placeholder="Send a Message"
          className="w-[80%] input input-bordered border-[#E2E8F0] rounded-full h-10 text-base text-white bg-[#DEE4ED08] placeholder-white placeholder-opacity-[0.8] backdrop-container"
        />

        <button type="submit" className="px-12 rounded-full bg-[#3C00FF]">
          <p className="text-base text-white">Submit</p>
        </button>
      </form>
    </>
  );
};

export default AIChat;
