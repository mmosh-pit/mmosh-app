import * as React from "react";
import { useAtom } from "jotai";
import Image from "next/image";
import { Bars } from "react-loader-spinner";

import { chatsStore, selectedChatStore } from "@/app/store/chat";
import { data } from "@/app/store";
import KinshipIcon from "@/assets/icons/KinshipIcon";
import client from "@/app/lib/httpClient";
import moment from "moment";
import PersonalIcon from "@/assets/icons/PersonalIcon";

const ChatAgentSelector = () => {
  const [currentUser] = useAtom(data);
  const [chats, setChats] = useAtom(chatsStore);
  const [_, setSelectedChat] = useAtom(selectedChatStore);

  const [areChatsLoading, setAreChatsLoading] = React.useState(true);

  const getChats = async (keyword: any) => {
    try {
      setAreChatsLoading(true);
      let url = "/chats/active";

      if (keyword.length > 0) {
        url = url + "&&searchText=" + keyword;
      }

      const listResult = await client.get(url);

      let defaultChat;

      const otherChats = [];

      for (const chat of listResult.data.data) {
        if (chat?.chatAgent.symbol === "KIN") {
          defaultChat = chat;
          continue;
        }

        otherChats.push(chat);
      }

      otherChats.sort((a, b) => {
        if (
          new Date(a.lastMessage?.created_at) <
          new Date(b.lastMessage?.created_at)
        ) {
          return 1;
        }

        if (
          new Date(b.lastMessage?.created_at) <
          new Date(a.lastMessage?.created_at)
        ) {
          return -1;
        }

        return 0;
      });

      if (defaultChat) {
        setChats([defaultChat, ...otherChats]);
        setSelectedChat(defaultChat);
      } else {
        setChats(otherChats);
      }
      setAreChatsLoading(false);
    } catch (error) {
      setAreChatsLoading(false);
      setChats([]);
    }
  };

  React.useEffect(() => {
    getChats("");
  }, [currentUser]);

  return (
    <div className="flex flex-col w-[25%] bg-[#181747] backdrop-filter backdrop-blur-[6px] px-4 py-2">
      {areChatsLoading ? (
        <div className="self-center">
          <Bars
            height="80"
            width="80"
            color="rgba(255, 0, 199, 1)"
            ariaLabel="bars-loading"
            wrapperStyle={{}}
            wrapperClass="bars-loading"
            visible={areChatsLoading}
          />
        </div>
      ) : (
        <div className="py-4 overflow-y-auto h-[80%]">
          {chats.map((chat) => (
            <div
              className="my-4 px-4 flex justify-between cursor-pointer"
              onClick={() => setSelectedChat(chat)}
              key={chat.id}
            >
              <div className="flex">
                <div className="relative w-[3vmax] h-[3vmax] mr-2">
                  <Image
                    src={chat.chatAgent?.image ?? ""}
                    alt={chat.chatAgent?.symbol ?? ""}
                    layout="fill"
                    className="rounded-full"
                  />
                </div>

                <div className="flex flex-col">
                  <div className="flex">
                    <p className="text-sm text-white font-bold mx-2">
                      @{chat.chatAgent?.symbol}
                    </p>

                    {chat.chatAgent?.type === "personal" ? (
                      <PersonalIcon />
                    ) : (
                      <KinshipIcon />
                    )}
                  </div>

                  <p className="text-sm">{chat.chatAgent?.name}</p>

                  {chat.lastMessage?.id && (
                    <p className="text-sm truncate max-w-[14vmax] mt-2">
                      {chat.lastMessage!.content}
                    </p>
                  )}
                </div>
              </div>

              {chat.lastMessage?.id && (
                <p className="text-sm">
                  {moment(chat.lastMessage?.created_at).format("hh:mm")}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatAgentSelector;
