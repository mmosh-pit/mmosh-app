import * as React from "react";
import { useAtom } from "jotai";
import Image from "next/image";

import { data, userData } from "@/app/store";
import Markdown from "markdown-to-jsx";
import ArrowUpHome from "@/assets/icons/ArrowUpHome";
import { selectedChatStore } from "@/app/store/chat";
import { Message } from "@/app/models/chat";
import { Bars } from "react-loader-spinner";

const ChatInteractionContainer = ({ socket }: { socket: WebSocket | null }) => {
  const [user] = useAtom(userData);
  const [currentUser] = useAtom(data);

  const [selectedChat] = useAtom(selectedChatStore);

  const [text, setText] = React.useState("");

  const messages = selectedChat?.messages;

  const getMessageImage = React.useCallback(
    (message: Message) => {
      if (message.type === "user") {
        if (!currentUser) {
          if (!user)
            return "https://storage.googleapis.com/mmosh-assets/g_avatar.png";

          return "https://storage.googleapis.com/mmosh-assets/v_avatar.png";
        }

        return currentUser!.profile.image;
      }

      if (message.type === "bot") {
        return selectedChat!.chatAgent!.image;
      }

      return "https://storage.googleapis.com/mmosh-assets/aunt-bea.png";
    },
    [currentUser, user, selectedChat],
  );

  const getMessageUsername = React.useCallback(
    (message: Message) => {
      if (message.type === "user") {
        if (!currentUser) {
          if (!user) return "Guest";

          return user.name;
        }

        return currentUser!.profile.username;
      }

      return selectedChat?.chatAgent?.name;
    },
    [currentUser, user, selectedChat],
  );

  const sendMessage = React.useCallback(
    (content: string) => {
      socket?.send(
        JSON.stringify({
          data: {
            chat_id: selectedChat!.id,
            agent_id: selectedChat!.chatAgent!.id,
            system_prompt: selectedChat!.chatAgent!.systemPrompt,
            namespaces: [selectedChat!.chatAgent!.key, "PUBLIC", "MMOSH"],
            content,
          },
          event: "message",
        }),
      );

      setText("");
    },
    [selectedChat, socket],
  );

  const isLoading = messages
    ? messages.length > 0
      ? messages[selectedChat?.messages.length - 1].is_loading
      : false
    : false;

  React.useEffect(() => {
    const objDiv = document.getElementById("message-container");
    if (objDiv) {
      objDiv.scrollTop = objDiv.offsetTop;
    }
  }, []);

  return (
    <div className="w-[75%] flex justify-center">
      {!selectedChat ? (
        <></>
      ) : (
        <div className="w-[90%] flex flex-col p-2 rounded-xl mt-16 bg-[#181747] backdrop-filter backdrop-blur-[6px] px-8 h-[65vh]">
          <>
            <div
              className="w-full h-full flex flex-col items-center grow overflow-y-auto px-16 pb-8"
              id="message-container"
            >
              {messages?.map((message, index) => (
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
                        {message.is_loading ? (
                          <Bars
                            height="50"
                            width="50"
                            color="rgba(255, 0, 199, 1)"
                            ariaLabel="bars-loading"
                            wrapperStyle={{}}
                            wrapperClass="bars-loading"
                            visible={true}
                          />
                        ) : (
                          <Markdown children={message.content} />
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="justify-between ml-4 flex flex-col py-2 px-6 rounded-lg">
                        <p className="text-base text-white text-end">
                          {getMessageUsername(message)}
                        </p>
                        <Markdown children={message.content} />
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
            </div>

            <div className="w-full pb-4 px-12 self-end">
              <form
                className="w-full flex justify-between p-2 bg-[#BBBBBB21] border-[1px] border-[#06052D] rounded-lg"
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage(text);
                }}
              >
                <textarea
                  className="home-ai-textfield w-full mr-4 px-2"
                  placeholder="Type here"
                  rows={2}
                  wrap="hard"
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value);
                  }}
                />

                <button
                  className={`p-3 rounded-lg ${!text ? "bg-[#565656]" : "bg-[#FFF]"}`}
                  disabled={!text || isLoading}
                  type="submit"
                >
                  <ArrowUpHome />
                </button>
              </form>
            </div>
          </>
        </div>
      )}
    </div>
  );
};

export default ChatInteractionContainer;
