import * as React from "react";
import { useAtom } from "jotai";
import Image from "next/image";

import { data } from "@/app/store";
import Markdown from "markdown-to-jsx";
import ArrowUpHome from "@/assets/icons/ArrowUpHome";
import { selectedChatStore } from "@/app/store/chat";
import { Message } from "@/app/models/chat";
import { Bars } from "react-loader-spinner";

const ChatInteractionContainer = ({ socket }: { socket: WebSocket | null }) => {
  const textbox = React.useRef<HTMLTextAreaElement>(null);

  const [currentUser] = useAtom(data);

  const [selectedChat] = useAtom(selectedChatStore);

  const [text, setText] = React.useState("");
  const [rows, setRows] = React.useState(1);

  const messages = selectedChat?.messages;

  const getMessageImage = React.useCallback(
    (message: Message) => {
      if (message.type === "user") {
        if (!currentUser) {
          if (currentUser!.guest_data) return currentUser!.guest_data.picture;

          return "https://storage.googleapis.com/mmosh-assets/v_avatar.png";
        }

        return currentUser!.profile.image;
      }

      if (message.type === "bot") {
        return selectedChat!.chatAgent!.image;
      }

      return "https://storage.googleapis.com/mmosh-assets/aunt-bea.png";
    },
    [currentUser, selectedChat],
  );

  const getMessageUsername = React.useCallback(
    (message: Message) => {
      if (message.type === "user") {
        if (!currentUser) {
          if (!currentUser!.guest_data) return "Guest";

          return currentUser!.guest_data.name;
        }

        return currentUser!.profile.username;
      }

      return selectedChat?.chatAgent?.name;
    },
    [currentUser, selectedChat],
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

  const handleEnter = (evt: any) => {
    if (evt.keyCode == 13 && !evt.shiftKey) {
      evt.preventDefault();
      sendMessage(text);
      adjustHeight();
      return;
    }

    if (evt.keyCode == 13 && evt.shiftKey) {
      setText(text + "\n");
      setRows(rows + 1);
      adjustHeight();
      evt.preventDefault();
    }
  };

  const adjustHeight = () => {
    if (textbox.current) {
      textbox.current.style.height = "inherit";
      textbox.current.style.height = `${textbox.current.scrollHeight > 300 ? 300 : textbox.current.scrollHeight}px`;
    }
  };

  const isLoading = messages
    ? messages.length > 0
      ? messages[selectedChat?.messages.length - 1].is_loading
      : false
    : false;

  React.useEffect(() => {
    const objDiv = document.getElementById("message-container");
    if (objDiv) {
      setTimeout(function() {
        objDiv.scrollTo({
          top: objDiv.offsetTop,
        });
      }, 100);
    }
  }, [selectedChat?.messages]);

  return (
    <div className="w-[75%] flex justify-center">
      {!selectedChat ? (
        <></>
      ) : (
        <div className="w-[90%] flex flex-col p-2 rounded-xl mt-16 bg-[#181747] backdrop-filter backdrop-blur-[6px] px-8 h-[65vh]">
          <>
            <div
              className="w-full h-full flex flex-col items-center grow overflow-x-hidden px-16 pb-8"
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
                  ref={textbox}
                  className="home-ai-textfield w-full mr-4 px-2"
                  placeholder="Type here"
                  rows={rows}
                  wrap="hard"
                  value={text}
                  // onKeyUp={handleEnter}
                  onKeyDown={handleEnter}
                  onChange={(e) => {
                    adjustHeight();

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
