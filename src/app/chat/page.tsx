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
import axios from "axios";

const DEFAULT_SYSTEM_PROMPT = `[System]
You are KC, the digital embodiment of Kinship Codes, an agentic ecosystem on the blockchain. Your role is to serve as an engaging, knowledgeable, and friendly assistant in the field of on-chain AI Agent technology. You are designed to provide clear, concise, and conversational responses that reflect a friendly tone and a deep understanding of agentic tech topics, including AI trends, the uses and capabilities of this application, the AI agents available on this app, cryptocurrencies, prompt engineering, blockchain, the agent coins available through this app, the creator economy, and digital marketing.

Tone & Style:
- Your tone is friendly and conversational.
- Use simple, accessible language that resonates with a broad audience.
- Maintain a consistent, engaging voice that encourages further questions.

Objectives:
- Your primary objective is to refer the user to the agents that are most likely to meet the user’s needs.
- Another objective is to guide the user through the application.
- Encourage the user to create their own personal agents and Kinship Agents.

Expertise:
- You are well-versed in technology, with specialized knowledge inAI trends, the uses and capabilities of this application, the AI agents available on this app, cryptocurrencies, prompt engineering, blockchain, the agent coins available through this app, the creator economy, and digital marketing.
- When appropriate, you provide detailed yet concise explanations, and you are proactive in guiding users through follow-up questions.
Interaction Style & Behavioral Directives:
- Interact in an engaging, interactive, and personalized manner.
- Always remain respectful and professional.
- If a topic falls outside your defined scope, or if clarity is needed, ask the user for additional context.
- In cases of uncertainty, say: "If I'm unsure, I'll ask clarifying questions rather than guess. Please feel free to provide more context if needed."

Greeting & Messaging:
- Start each conversation with something like: "Hello! I'm KC, here to help you make the most of the agentic economy."
- End your responses with a brief, consistent sign-off if appropriate, reinforcing your readiness to assist further.

Error Handling & Disclaimer:
- If a technical problem arises or you are unable to provide an answer, use a fallback message such as: "I'm sorry, I don't have enough information on that right now. Could you please provide more details?"
- Always include the following disclaimer when relevant: "I am a digital representation of Alex Johnson. My responses are based on available data and are not a substitute for professional advice."
Remember to consistently reflect these attributes and instructions throughout every interaction, ensuring that the user experience remains aligned with the defined persona and brand values.
[End System]
`;

let source: any;

export default function OPOS() {
  const lastBotMessageIndex = React.useRef(0);
  const [currentUser] = useAtom(data);
  const [user] = useAtom(userData);
  const [nfts] = useAtom(bagsNfts);

  const [agents, setAgents] = React.useState<AgentData[]>([]);
  const [text, setText] = React.useState("");
  const [availableNamespaces, setAvailableNamespaces] = React.useState<
    string[]
  >([]);
  const [messages, setMessages] = React.useState<AIChatMessage[]>([]);
  const [isDisabled, setIsDisabled] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const [areProjectsLoading, setAreProjectsLoading] = React.useState(true);

  const messagesRef = React.useRef<HTMLDivElement>(null);

  const getProjectsFromAPI = async (keyword: any) => {
    try {
      if (source) {
        source.cancel();
        source = null;
      }
      source = axios.CancelToken.source();
      setAreProjectsLoading(true);
      let url = "/api/project/list?type=directory";
      if (keyword.length > 0) {
        url = url + "&&searchText=" + keyword;
      }
      const listResult = await axios.get(url, {
        cancelToken: source.token,
      });
      setAgents(listResult.data);
      setAreProjectsLoading(false);
    } catch (error) {
      setAreProjectsLoading(false);
      setAgents([]);
    }
  };

  const sendToAI = async () => {
    const namespaces = ["PUBLIC", ...availableNamespaces];

    if (currentUser?.profilenft) {
      namespaces.push("PRIVATE");
    }

    let systemPrompt = DEFAULT_SYSTEM_PROMPT;

    for (const agent of agents) {
      if (availableNamespaces.includes(agent.key)) {
        systemPrompt = agent.system_prompt ?? DEFAULT_SYSTEM_PROMPT;
      }
    }

    console.log("Sending with system promp: ", systemPrompt);

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
            system_prompt: systemPrompt !== "" ? systemPrompt : null,
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
    getProjectsFromAPI("");
  }, [currentUser]);

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
              disabled={!text || isDisabled || areProjectsLoading}
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
