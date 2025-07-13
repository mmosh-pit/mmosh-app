import * as React from "react";
import { useAtom } from "jotai";

import { data } from "@/app/store";
import Markdown from "react-markdown";
import ArrowUpHome from "@/assets/icons/ArrowUpHome";
import { selectedChatStore, chatsStore, chatsLoading } from "@/app/store/chat";
import { Message } from "@/app/models/chat";
import { Bars } from "react-loader-spinner";
import Avatar from "../common/Avatar";
import { useRouter } from "next/navigation";
import VoiceIcon from "@/assets/icons/VoiceIcon";

const ChatInteractionContainer = () => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const router = useRouter();

  const [currentUser] = useAtom(data);
  const [chats, setChats] = useAtom(chatsStore);
  const [selectedChat, setSelectedChat] = useAtom(selectedChatStore);
  const [areChatsLoading] = useAtom(chatsLoading);

  const [text, setText] = React.useState("");

  const messages = selectedChat?.messages;

  const getMessageImage = React.useCallback(
    (message: Message) => {
      if (message.type === "user") {
        if (!currentUser) {
          return "https://storage.googleapis.com/mmosh-assets/v_avatar.png";
        }

        if (!currentUser!.profile) {
          return currentUser!.guest_data.picture;
        }

        return currentUser!.profile?.image;
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
          return "Guest";
        }

        if (!currentUser!.profile) {
          return currentUser!.guest_data.name;
        }

        return currentUser!.profile?.username;
      }

      return selectedChat?.chatAgent?.name;
    },
    [currentUser, selectedChat],
  );
  const sendMessage = React.useCallback(
    async (content: string) => {
      if (!selectedChat?.messages) return;

      // Add user message to the chat immediately
      const userMessage: Message = {
        id: Date.now().toString(),
        content,
        sender_id: currentUser?.profile?.username || "user",
        type: "user",
        created_at: new Date().toISOString(),
        sender: currentUser?.profile?.username || "user",
        is_loading: false,
      };

      // Add loading bot message
      const loadingBotMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "",
        sender_id: selectedChat.chatAgent!.id,
        type: "bot",
        created_at: new Date().toISOString(),
        sender: selectedChat.chatAgent!.name,
        is_loading: true,
      };

      // Update the selected chat with new messages
      const updatedSelectedChat = {
        ...selectedChat,
        messages: [...selectedChat.messages, userMessage, loadingBotMessage],
      };

      setSelectedChat(updatedSelectedChat);

      // Update the chats array
      const updatedChats = chats.map((chat) =>
        chat.id === selectedChat.id ? updatedSelectedChat : chat,
      );
      setChats(updatedChats);

      setText("");

      try {
        const queryData = {
          namespaces: [selectedChat!.chatAgent!.key, "PUBLIC"],
          query: content,
          instructions: selectedChat!.chatAgent!.system_prompt,
        };

        console.log("Message data being sent:", queryData);

        const response = await fetch(
          "https://rewoo-api-1094217356440.us-central1.run.app/query",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(queryData),
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        // Create the final bot message
        const botMessage: Message = {
          id: (Date.now() + 2).toString(),
          content: result.result,
          sender_id: selectedChat.chatAgent!.id,
          type: "bot",
          created_at: new Date().toISOString(),
          sender: selectedChat.chatAgent!.name,
          is_loading: false,
        };

        // Replace the loading message with the actual response
        const finalMessages = [...updatedSelectedChat.messages];
        finalMessages[finalMessages.length - 1] = botMessage;

        const finalSelectedChat = {
          ...updatedSelectedChat,
          messages: finalMessages,
        };

        setSelectedChat(finalSelectedChat);

        // Update the chats array
        const finalChats = chats.map((chat) =>
          chat.id === selectedChat.id ? finalSelectedChat : chat,
        );
        setChats(finalChats);

        // Save the chat conversation to the database
        try {
          const saveChatData = {
            chatId: selectedChat.id,
            agentID: selectedChat.chatAgent!.id,
            namespaces: [selectedChat.chatAgent!.key, "PUBLIC"],
            systemPrompt: selectedChat.chatAgent!.system_prompt,
            userContent: content,
            botContent: result.result,
          };

          console.log("Saving chat to database:", saveChatData);

          const saveResponse = await fetch(
            "https://chat-save-api-1094217356440.us-central1.run.app/save-chat",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(saveChatData),
            },
          );

          if (!saveResponse.ok) {
            console.warn(
              `Failed to save chat: ${saveResponse.status} ${saveResponse.statusText}`,
            );
          } else {
            console.log("Chat saved successfully to database");
          }
        } catch (saveError) {
          console.error("Error saving chat to database:", saveError);
          // Note: We don't want to show this error to the user as the main functionality (chat) worked
        }
      } catch (error) {
        console.error("Error sending message:", error);

        // Create error message
        const errorMessage: Message = {
          id: (Date.now() + 2).toString(),
          content:
            "Sorry, I encountered an error while processing your message. Please try again.",
          sender_id: selectedChat.chatAgent!.id,
          type: "bot",
          created_at: new Date().toISOString(),
          sender: selectedChat.chatAgent!.name,
          is_loading: false,
        };

        // Replace the loading message with error message
        const finalMessages = [...updatedSelectedChat.messages];
        finalMessages[finalMessages.length - 1] = errorMessage;

        const finalSelectedChat = {
          ...updatedSelectedChat,
          messages: finalMessages,
        };

        setSelectedChat(finalSelectedChat);

        // Update the chats array
        const finalChats = chats.map((chat) =>
          chat.id === selectedChat.id ? finalSelectedChat : chat,
        );
        setChats(finalChats);
      }
    },
    [selectedChat, currentUser, chats, setChats, setSelectedChat],
  );

  const handleEnter = (evt: any) => {
    if (evt.keyCode == 13 && !evt.shiftKey) {
      evt.preventDefault();
      if (text.trim()) {
        sendMessage(text);
      }
      return;
    }
  };

  const isLoading = messages
    ? messages.length > 0
      ? messages[selectedChat?.messages.length - 1].is_loading
      : false
    : false;

  // Auto-scroll to bottom when messages change
  React.useEffect(() => {
    const objDiv = document.getElementById("message-container");
    if (objDiv) {
      setTimeout(() => {
        objDiv.scrollTop = objDiv.scrollHeight;
      }, 100);
    }
  }, [selectedChat?.messages]);

  // Auto-scroll to bottom when chat loads
  React.useEffect(() => {
    const objDiv = document.getElementById("message-container");
    if (objDiv) {
      objDiv.scrollTop = objDiv.scrollHeight;
    }
  }, [selectedChat?.id]);

  return (
    <div className="w-[75%] flex justify-center">
      {areChatsLoading ? (
        <div className="w-[90%] flex flex-col items-center justify-center mt-16 bg-[#181747] backdrop-filter backdrop-blur-[6px] px-8 py-16 rounded-xl">
          <div className="text-center space-y-4">
            <Bars
              height="60"
              width="60"
              color="rgba(255, 0, 199, 1)"
              ariaLabel="bars-loading"
              wrapperStyle={{}}
              wrapperClass="bars-loading"
              visible={true}
            />
            <h3 className="text-xl text-white font-semibold">
              Loading chats...
            </h3>
            <p className="text-gray-400">
              Please wait while we load your conversations
            </p>
          </div>
        </div>
      ) : !selectedChat ? (
        <div className="w-[90%] flex flex-col items-center justify-center mt-16 bg-[#181747] backdrop-filter backdrop-blur-[6px] px-8 py-16 rounded-xl">
          <div className="text-center space-y-4">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-xl text-white font-semibold">
              No chat selected
            </h3>
            <p className="text-gray-400">
              Choose a chat agent from the sidebar to start a conversation
            </p>
          </div>
        </div>
      ) : (
        <div className="w-[90%] flex flex-col rounded-xl mt-8 bg-[#181747] backdrop-filter backdrop-blur-[6px] h-[75vh] overflow-hidden">
          {/* Chat Header */}
          <div
            className="flex items-center px-6 py-4 border-b border-[#FFFFFF1A] cursor-pointer"
            onClick={() =>
              router.push(`/bots/${selectedChat.chatAgent?.symbol}`)
            }
          >
            <Avatar
              src={selectedChat.chatAgent?.image}
              alt={selectedChat.chatAgent?.name}
              size={48}
              className="mr-3"
            />
            <div>
              <h3 className="text-lg font-semibold text-white underline">
                {selectedChat.chatAgent?.name}
              </h3>
              <p className="text-sm text-gray-400">
                @{selectedChat.chatAgent?.symbol}
              </p>
            </div>
          </div>

          {/* Messages Container */}
          <div
            className="flex-1 flex flex-col overflow-y-auto px-6 py-4 space-y-4"
            id="message-container"
            style={{ scrollBehavior: "smooth" }}
          >
            {messages?.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center space-y-3">
                  <div className="text-4xl mb-2">👋</div>
                  <p className="text-gray-400">
                    Start a conversation with {selectedChat.chatAgent?.name}!
                  </p>
                </div>
              </div>
            ) : (
              messages?.map((message, index) => (
                <div
                  className={`flex items-start gap-3 ${message.type === "user" ? "flex-row-reverse" : "flex-row"}`}
                  key={`${message.type}-${index}`}
                >
                  <Avatar
                    src={getMessageImage(message)}
                    alt={getMessageUsername(message)}
                    size={40}
                    className="flex-shrink-0"
                  />

                  <div
                    className={`flex flex-col space-y-1 max-w-[70%] ${message.type === "user" ? "items-end" : "items-start"}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400 font-medium">
                        {getMessageUsername(message)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(message.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <div
                      className={`
                        px-4 py-3 rounded-2xl 
                        ${message.type === "user"
                          ? "bg-[#25235a] text-white rounded-tr-md"
                          : "bg-[#00073a] text-white rounded-tl-md"
                        }
                        ${message.is_loading ? "min-h-[60px] flex items-center justify-center" : ""}
                      `}
                    >
                      {message.is_loading ? (
                        <div className="flex items-center space-x-2">
                          <Bars
                            height="24"
                            width="24"
                            color="rgba(255, 0, 199, 1)"
                            ariaLabel="bars-loading"
                            wrapperStyle={{}}
                            wrapperClass="bars-loading"
                            visible={true}
                          />
                          <span className="text-sm text-gray-400">
                            Thinking...
                          </span>
                        </div>
                      ) : (
                        <div className="text-base leading-relaxed">
                          <Markdown children={message.content} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Input Area */}
          <div className="px-6 py-4 border-t border-[#FFFFFF1A]">
            <form
              className="flex items-center space-x-3"
              onSubmit={(e) => {
                e.preventDefault();
                if (text.trim()) {
                  sendMessage(text);
                }
              }}
            >
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  className="w-full px-4 py-3 pr-12 bg-[#00073a] border border-[#FFFFFF1A] rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A4B6C] focus:border-transparent transition-all"
                  placeholder="Type your message..."
                  value={text}
                  onKeyDown={handleEnter}
                  onChange={(e) => {
                    setText(e.target.value);
                  }}
                  maxLength={1000}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                  {text.length}/1000
                </div>
              </div>

              <button className="bg-[#FFFFFF14] border-[1px] border-[#FFFFFF28] rounded-md ">
                <VoiceIcon />
              </button>

              <button
                className={`
                  flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200 
                  ${!text.trim() || isLoading
                    ? "bg-[#565656] cursor-not-allowed"
                    : "bg-[#4A4B6C] hover:bg-[#5A5B7C] transform hover:scale-105"
                  }
                `}
                disabled={!text.trim() || isLoading}
                type="submit"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <ArrowUpHome />
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInteractionContainer;
