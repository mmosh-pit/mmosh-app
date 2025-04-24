import { Chat } from "@/app/models/chat";
import { atom } from "jotai";

export const chatsStore = atom<Chat[]>([]);

export const selectedChatStore = atom<Chat | null>(null);
