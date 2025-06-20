import { useEffect, useRef, useState } from "react";

export default function useVoiceSession() {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const [dataChannel, setDataChannel] = useState<RTCDataChannel | null>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const audioElement = useRef<HTMLAudioElement | null>(null);

  async function startSession() {
    try {
      // Get a session token for OpenAI Realtime API
      const tokenResponse = await fetch("/api/realtime-token");
      const data = await tokenResponse.json();
      const EPHEMERAL_KEY = data.client_secret.value;

      // Create a peer connection
      const pc = new RTCPeerConnection();

      // Set up to play remote audio from the model
      audioElement.current = document.createElement("audio");
      audioElement.current.autoplay = true;
      pc.ontrack = (e) => {
        if (audioElement.current) {
          audioElement.current.srcObject = e.streams[0];
        }
      };

      // Add local audio track for microphone input in the browser
      const ms = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      pc.addTrack(ms.getTracks()[0]);

      // Set up data channel for sending and receiving events
      const dc = pc.createDataChannel("oai-events");
      setDataChannel(dc);

      // Start the session using the Session Description Protocol (SDP)
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const baseUrl = "https://api.openai.com/v1/realtime";
      const model = "gpt-4o-realtime-preview-2025-06-03";
      const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
        method: "POST",
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${EPHEMERAL_KEY}`,
          "Content-Type": "application/sdp",
        },
      });

      const answer = {
        type: "answer" as RTCSdpType,
        sdp: await sdpResponse.text(),
      };
      await pc.setRemoteDescription(answer);

      peerConnection.current = pc;
    } catch (error) {
      console.error("Failed to start session:", error);
    }
  }

  // Stop current session, clean up peer connection and data channel
  function stopSession() {
    if (dataChannel) {
      dataChannel.close();
    }

    if (peerConnection.current) {
      peerConnection.current.getSenders().forEach((sender) => {
        if (sender.track) {
          sender.track.stop();
        }
      });
      peerConnection.current.close();
    }

    setIsSessionActive(false);
    setDataChannel(null);
    peerConnection.current = null;
    setEvents([]); // Clear events when stopping session
  }

  // Send a message to the model
  function sendClientEvent(message: any) {
    if (dataChannel && dataChannel.readyState === 'open') {
      try {
        const timestamp = new Date().toLocaleTimeString();
        // Ensure unique event ID for each message
        if (!message.event_id) {
          message.event_id = crypto.randomUUID();
        }

        // send event before setting timestamp since the backend peer doesn't expect this field
        dataChannel.send(JSON.stringify(message));

        // if guard just in case the timestamp exists by miracle
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
        dataChannel?.readyState
      );
    }
  }

  // Send a text message to the model
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

  // Attach event listeners to the data channel when a new one is created
  useEffect(() => {
    if (dataChannel) {
      // Append new server events to the list
      dataChannel.addEventListener("message", (e) => {
        const event = JSON.parse(e.data);
        if (!event.timestamp) {
          event.timestamp = new Date().toLocaleTimeString();
        }

        setEvents((prev) => [event, ...prev]);
      });

      // Set session active when the data channel is opened
      dataChannel.addEventListener("open", () => {
        console.log("Data channel opened, setting session active");
        setIsSessionActive(true);
        setEvents([]);
      });

      // Handle data channel errors and state changes
      dataChannel.addEventListener("error", (error) => {
        console.error("Data channel error:", error);
      });

      dataChannel.addEventListener("close", () => {
        console.log("Data channel closed");
        setIsSessionActive(false);
      });
    }
  }, [dataChannel]);

  return {
    isSessionActive,
    events,
    startSession,
    stopSession,
    sendClientEvent,
    sendTextMessage,
  };
} 