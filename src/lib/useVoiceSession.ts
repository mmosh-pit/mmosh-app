import { useEffect, useRef, useState } from "react";
import { useAtom } from "jotai";
import { selectedChatStore, chatsStore } from "@/app/store/chat";
import { Message } from "@/app/models/chat";

export default function useVoiceSession() {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [dataChannel, setDataChannel] = useState<RTCDataChannel | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [selectedChat, setSelectedChat] = useAtom(selectedChatStore);
  const [chats, setChats] = useAtom(chatsStore);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioQueueRef = useRef<AudioBuffer[]>([]);
  const isPlayingRef = useRef(false);
  const streamRef = useRef<MediaStream | null>(null);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const websocketRef = useRef<WebSocket | null>(null);

  // Voice Activity Detection (VAD) using Web Audio API
  const analyserRef = useRef<AnalyserNode | null>(null);
  const vadCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Flag to prevent recording when bot is speaking
  const shouldListenRef = useRef(true);
  
  // NEW: Track if session is being stopped to abort ongoing operations
  const isStoppingRef = useRef(false);
  
  // NEW: Track ongoing fetch requests to abort them
  const abortControllerRef = useRef<AbortController | null>(null);

async function startSession() {
  console.log("Starting voice session...");
  setIsLoadingSession(true);
  isStoppingRef.current = false;

  try {
    // Initialize Audio Context with proper sample rate
    audioContextRef.current = new AudioContext({ sampleRate: 24000 });

    // Get microphone access with better constraints
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        channelCount: 1,
        sampleRate: 16000,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });

    streamRef.current = stream;

    // IMPORTANT: Use the same AudioContext for VAD
    // Don't create a new one
    const source = audioContextRef.current.createMediaStreamSource(stream);
    const analyser = audioContextRef.current.createAnalyser();
    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = 0.8; // Smooth out rapid changes
    source.connect(analyser);
    analyserRef.current = analyser;

    console.log("Audio analysis setup complete");

    // Set up MediaRecorder
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: "audio/webm;codecs=opus",
    });

    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (event) => {
      console.log(`Audio data available: ${event.data.size} bytes`);
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = async () => {
      console.log("MediaRecorder stopped");
      
      if (isStoppingRef.current) {
        console.log("Session stopping, clearing chunks");
        audioChunksRef.current = [];
        return;
      }

      if (audioChunksRef.current.length > 0) {
        console.log(`Processing ${audioChunksRef.current.length} audio chunks`);
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        audioChunksRef.current = [];
        await sendAudioToBackend(audioBlob);
      } else {
        console.log("No audio chunks to process");
      }
    };

    // Start recording initially (will be controlled by VAD)
    mediaRecorder.start();
    console.log("Initial recording started");

    // Start VAD monitoring
    startVADMonitoring();

    setIsSessionActive(true);
    setIsLoadingSession(false);
    console.log("✅ Voice session active");
  } catch (error) {
    console.error("Failed to start session:", error);
    setIsLoadingSession(false);
    alert("Failed to access microphone. Please check permissions.");
  }
}

  function stopSession() {
    console.log("Stopping voice session...");
    
    // NEW: Set stopping flag to prevent new operations
    isStoppingRef.current = true;

    // NEW: Abort any ongoing fetch requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    // Stop speech synthesis immediately
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      console.log("Speech cancelled");
    }

    // Unmute microphone
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = true;
      });
    }

    // Stop VAD monitoring
    if (vadCheckIntervalRef.current) {
      clearInterval(vadCheckIntervalRef.current);
      vadCheckIntervalRef.current = null;
    }

    // Clear silence timeout
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }

    // Stop media recorder
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }

    // Stop all audio tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    // Close audio context
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    // Clear audio queue
    audioQueueRef.current = [];
    isPlayingRef.current = false;

    // Close WebSocket if open
    if (websocketRef.current) {
      websocketRef.current.close();
      websocketRef.current = null;
    }

    // Reset all state
    setIsSessionActive(false);
    setIsSpeaking(false);
    setIsProcessing(false);
    shouldListenRef.current = true;
    
    console.log("Voice session stopped");
  }

function startVADMonitoring() {
  const bufferLength = analyserRef.current!.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  let isSpeechDetected = false;
  
  // Track noise floor (ambient noise level when not speaking)
  const noiseFloorSamples: number[] = [];
  const NOISE_FLOOR_SAMPLE_SIZE = 30; // First 3 seconds to establish baseline
  let noiseFloorCalibrated = false;
  let noiseFloor = 15; // Default baseline
  
  console.log("startVADMonitoring started");

  vadCheckIntervalRef.current = setInterval(() => {
    if (isStoppingRef.current) {
      return;
    }
    
    if (!analyserRef.current) return;

    // Don't process audio if bot is speaking or processing
    if (!shouldListenRef.current || isSpeaking || isProcessing) {
      return;
    }

    analyserRef.current.getByteFrequencyData(dataArray);

    // Calculate RMS (Root Mean Square)
    const rms = Math.sqrt(
      dataArray.reduce((sum, value) => sum + value * value, 0) / bufferLength
    );
    
    // Calibrate noise floor during the first few seconds
    if (!noiseFloorCalibrated) {
      noiseFloorSamples.push(rms);
      
      if (noiseFloorSamples.length >= NOISE_FLOOR_SAMPLE_SIZE) {
        // Calculate noise floor as average of lowest 70% of samples
        const sortedSamples = [...noiseFloorSamples].sort((a, b) => a - b);
        const bottomSamples = sortedSamples.slice(0, Math.floor(sortedSamples.length * 0.7));
        noiseFloor = bottomSamples.reduce((a, b) => a + b, 0) / bottomSamples.length;
        noiseFloorCalibrated = true;
        console.log(`🎤 Noise floor calibrated: ${noiseFloor.toFixed(2)}`);
      }
    }
    
    // Use a fixed multiplier above the noise floor for speech detection
    // This threshold does NOT adapt during speech
    const SPEECH_MULTIPLIER = 2.0; // Speech should be 2x louder than ambient noise
    const MIN_ABSOLUTE_THRESHOLD = 12; // Minimum threshold regardless of noise floor
    const SPEECH_THRESHOLD = Math.max(noiseFloor * SPEECH_MULTIPLIER, MIN_ABSOLUTE_THRESHOLD);
    
    const SILENCE_DURATION = 1500; // 1.5 seconds of silence

    console.log(`RMS: ${rms.toFixed(2)}, Threshold: ${SPEECH_THRESHOLD.toFixed(2)}, NoiseFloor: ${noiseFloor.toFixed(2)}, State: ${mediaRecorderRef.current?.state}`);

    if (rms > SPEECH_THRESHOLD) {
      // Speech detected
      if (!isSpeechDetected) {
        console.log("🎤 Speech detected! Starting recording...");
        isSpeechDetected = true;

        // Clear any existing silence timeout
        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current);
          silenceTimeoutRef.current = null;
        }

        // Start fresh recording
        if (
          mediaRecorderRef.current &&
          mediaRecorderRef.current.state === "inactive"
        ) {
          audioChunksRef.current = [];
          try {
            mediaRecorderRef.current.start();
            console.log("✅ Recording started");
          } catch (error) {
            console.error("Failed to start recording:", error);
          }
        }
      } else {
        // Continue speech - clear silence timeout
        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current);
          silenceTimeoutRef.current = null;
        }
      }
    } else if (isSpeechDetected && !silenceTimeoutRef.current) {
      // Silence detected after speech - start countdown
      console.log("🔇 Silence detected, waiting for confirmation...");
      silenceTimeoutRef.current = setTimeout(() => {
        console.log("⏹️ Stopping recording after silence");
        if (
          mediaRecorderRef.current &&
          mediaRecorderRef.current.state === "recording"
        ) {
          mediaRecorderRef.current.stop();
        }
        isSpeechDetected = false;
        silenceTimeoutRef.current = null;
      }, SILENCE_DURATION);
    } else if (!isSpeechDetected && noiseFloorCalibrated) {
      // Continuously update noise floor during silence (adaptive to environment changes)
      // Use exponential moving average to slowly adapt to environment
      const ADAPTATION_FACTOR = 0.02; // Very slow adaptation (2% weight to new sample)
      noiseFloor = noiseFloor * (1 - ADAPTATION_FACTOR) + rms * ADAPTATION_FACTOR;
    }
  }, 100); // Check every 100ms
}

  async function sendAudioToBackend(audioBlob: Blob) {
    // NEW: Don't process if session is being stopped
    if (isStoppingRef.current) {
      return;
    }
    
    if (!selectedChat) return;

    // Disable listening while processing
    shouldListenRef.current = false;
    setIsProcessing(true);

    // NEW: Create new AbortController for this request
    abortControllerRef.current = new AbortController();

    try {
      // Step 1: Send audio to backend for transcription
      const transcription = await transcribeAudio(audioBlob);

      // NEW: Check if session was stopped during transcription
      if (isStoppingRef.current) {
        setIsProcessing(false);
        return;
      }

      if (!transcription || transcription.trim().length === 0) {
        console.log("No transcription detected, skipping...");
        setIsProcessing(false);
        shouldListenRef.current = true;
        return;
      }

      console.log("Transcription:", transcription);

      // Add user message to chat
      const userMessage: Message = {
        id: Date.now().toString(),
        content: transcription,
        sender_id: "user",
        type: "user",
        created_at: new Date().toISOString(),
        sender: "user",
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

      const updatedSelectedChat = {
        ...selectedChat,
        messages: [...selectedChat.messages, userMessage, loadingBotMessage],
      };

      setSelectedChat(updatedSelectedChat);

      const updatedChats = chats.map((chat) =>
        chat.id === selectedChat.id ? updatedSelectedChat : chat
      );
      setChats(updatedChats);

      // Step 2: Send to your existing /react/stream endpoint
      const chatHistory = formatChatHistory(selectedChat.messages);

      const queryData = {
        namespaces: [selectedChat!.chatAgent!.key, "PUBLIC"],
        query: transcription,
        instructions: selectedChat!.chatAgent!.system_prompt,
        chatHistory: chatHistory,
        agentId: selectedChat.chatAgent!.id,
        bot_id: selectedChat.chatAgent!.key,
      };

      const response = await fetch("https://ai.kinshipbots.com/react/stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
        body: JSON.stringify(queryData),
        signal: abortControllerRef.current.signal, // NEW: Add abort signal
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = "";

      let streamingBotMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: "",
        sender_id: selectedChat.chatAgent!.id,
        type: "bot",
        created_at: new Date().toISOString(),
        sender: selectedChat.chatAgent!.name,
        is_loading: false,
      };

      while (true) {
        // NEW: Check if session was stopped during streaming
        if (isStoppingRef.current) {
          reader.cancel();
          setIsProcessing(false);
          return;
        }

        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));

              if (data.type === "content") {
                accumulatedContent += data.content;

                streamingBotMessage = {
                  ...streamingBotMessage,
                  content: accumulatedContent,
                };

                const currentMessages = [...updatedSelectedChat.messages];
                currentMessages[currentMessages.length - 1] =
                  streamingBotMessage;

                const streamingSelectedChat = {
                  ...updatedSelectedChat,
                  messages: currentMessages,
                };

                setSelectedChat(streamingSelectedChat);

                const streamingChats = chats.map((chat) =>
                  chat.id === selectedChat.id ? streamingSelectedChat : chat
                );
                setChats(streamingChats);
              } else if (data.type === "complete") {
                // NEW: Check if session was stopped before playing audio
                if (isStoppingRef.current) {
                  setIsProcessing(false);
                  return;
                }

                // Step 3: Convert text response to audio and play
                await textToSpeechAndPlay(accumulatedContent);

                const finalBotMessage: Message = {
                  ...streamingBotMessage,
                  content: accumulatedContent,
                };

                const finalMessages = [...updatedSelectedChat.messages];
                finalMessages[finalMessages.length - 1] = finalBotMessage;

                const finalSelectedChat = {
                  ...updatedSelectedChat,
                  messages: finalMessages,
                };

                setSelectedChat(finalSelectedChat);

                const finalChats = chats.map((chat) =>
                  chat.id === selectedChat.id ? finalSelectedChat : chat
                );
                setChats(finalChats);
                 try {
                      const saveChatData = {
                        chatId: selectedChat.id,
                        agentID: selectedChat.chatAgent!.id,
                        namespaces: [selectedChat.chatAgent!.key, "PUBLIC"],
                        systemPrompt: selectedChat.chatAgent!.system_prompt,
                        userContent: transcription,
                        botContent: accumulatedContent,
                      };

                      console.log("Saving chat to database:", saveChatData);

                      const saveResponse = await fetch(
                        "https://ai.kinshipbots.com/save-chat",
                        {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${window.localStorage.getItem("token")}`,
                          },
                          body: JSON.stringify(saveChatData),
                        }
                      );

                      if (!saveResponse.ok) {
                        console.warn(
                          `Failed to save chat: ${saveResponse.status} ${saveResponse.statusText}`
                        );
                      } else {
                        console.log("Chat saved successfully to database");
                      }
                    } catch (saveError) {
                      console.error(
                        "Error saving chat to database:",
                        saveError
                      );
                      // Note: We don't want to show this error to the user as the main functionality (chat) worked
                    }

                    break;
              }
            } catch (parseError) {
              console.error("Error parsing SSE data:", parseError);
            }
          }
        }
      }

      setIsProcessing(false);
    } catch (error: any) {
      // NEW: Don't log error if it was aborted intentionally
      if (error.name === 'AbortError') {
        console.log("Request aborted by user");
        setIsProcessing(false);
        return;
      }
      
      console.error("Error processing audio:", error);
      setIsProcessing(false);
      shouldListenRef.current = true;
    }
  }

  async function transcribeAudio(audioBlob: Blob): Promise<string> {
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "audio.webm");

      const response = await fetch("https://ai.kinshipbots.com/transcribe", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
        body: formData,
        signal: abortControllerRef.current?.signal, // NEW: Add abort signal
      });

      if (!response.ok) {
        throw new Error(`Transcription failed with status: ${response.status}`);
      }

      const data = await response.json();
      return data.text || "";
    } catch (error: any) {
      // NEW: Don't log error if it was aborted intentionally
      if (error.name === 'AbortError') {
        console.log("Transcription aborted by user");
        return "";
      }
      
      console.error("Transcription error:", error);
      return "";
    }
  }

  async function textToSpeechAndPlay(text: string) {
    // NEW: Don't play audio if session is being stopped
    if (isStoppingRef.current) {
      return;
    }

    try {
      setIsSpeaking(true);

      // Mute the microphone while speaking
      if (streamRef.current) {
        streamRef.current.getAudioTracks().forEach((track) => {
          track.enabled = false;
          console.log("Microphone muted during speech");
        });
      }

      // Stop any ongoing speech first
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }

      // Use Web Speech API for TTS
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      utterance.onend = () => {
        // NEW: Don't unmute if session was stopped
        if (isStoppingRef.current) {
          return;
        }

        // Unmute the microphone after speaking
        if (streamRef.current) {
          streamRef.current.getAudioTracks().forEach((track) => {
            track.enabled = true;
            console.log("🎤 Microphone unmuted after speech");
          });
        }
        setIsSpeaking(false);
        shouldListenRef.current = true;
        console.log("Finished speaking");
      };

      utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event);
        // Unmute the microphone on error
        if (streamRef.current && !isStoppingRef.current) {
          streamRef.current.getAudioTracks().forEach((track) => {
            track.enabled = true;
          });
        }
        setIsSpeaking(false);
        shouldListenRef.current = true;
      };

      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error("Error in text-to-speech:", error);
      // Unmute the microphone on error
      if (streamRef.current && !isStoppingRef.current) {
        streamRef.current.getAudioTracks().forEach((track) => {
          track.enabled = true;
        });
      }
      setIsSpeaking(false);
      shouldListenRef.current = true;
    }
  }

  function formatChatHistory(messages: Message[]) {
    const historyLimit = 20;
    const relevantMessages = messages
      .filter((msg) => !msg.is_loading)
      .slice(-historyLimit)
      .map((msg) => ({
        role: msg.type === "user" ? "user" : "assistant",
        content: msg.content,
        timestamp: msg.created_at,
      }));
    return relevantMessages;
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isSessionActive) {
        stopSession();
      }
    };
  }, [isSessionActive]);

  function sendClientEvent(message: any) {
    if (dataChannel && dataChannel.readyState === "open") {
      try {
        const timestamp = new Date().toLocaleTimeString();
        if (!message.event_id) {
          message.event_id = crypto.randomUUID();
        }

        dataChannel.send(JSON.stringify(message));

        if (!message.timestamp) {
          message.timestamp = timestamp;
        }
        setEvents((prev) => [message, ...prev]);
      } catch (error) {
        console.error("Failed to send message through data channel:", error);
      }
    } else {
      console.error(
        "Failed to send message - data channel not available or not open. State:",
        dataChannel?.readyState,
      );
    }
  }

  function sendTextMessage(message: string) {
    const event = {
      type: "conversation.item.create",
      item: {
        type: "message",
        role: "user",
        content: [
          {
            type: "input_text",
            text: message,
          },
        ],
      },
    };

    sendClientEvent(event);
    sendClientEvent({ type: "response.create" });
  }

  return {
    isSessionActive,
    startSession,
    stopSession,
    isSpeaking: isSpeaking || isProcessing,
    isProcessing: isProcessing,
    isLoadingSession,
    events,
    sendClientEvent,
    sendTextMessage
  };
}
