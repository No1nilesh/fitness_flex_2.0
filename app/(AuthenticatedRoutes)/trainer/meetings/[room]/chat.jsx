"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";

const Chat = ({ socket, room }) => {
  const [messages, setMessages] = useState([]);
  const { data: session } = useSession();
  const [msgInput, setMsgInput] = useState("");
  const lastMessageRef = useRef(null);

  const OnMessage = useCallback(() => {
    if (msgInput.trim() === "") return;
    socket.emit("send:message", {
      message: msgInput,
      email: session?.user.email,
      roomName: room,
      socketId: socket.id,
    });
    setMsgInput("");
  }, [msgInput, session?.user.email, room, socket]);

  const handleMessage = useCallback((data) => {
    setMessages((prevMessages) => [...prevMessages, data]);
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`/api/redis/chat?key=${room}`);
        const data = res.data.value || [];

        const parsedMessages = data.map((element) => JSON.parse(element));
        setMessages(parsedMessages);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    if (socket) {
      socket.on("on:message", handleMessage);
      fetchMessages();
    }

    return () => {
      if (socket) {
        socket.off("on:message", handleMessage);
      }
    };
  }, [socket, handleMessage, room]);

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="px-2 h-[50vh] md:h-[75vh]">
      <div className="flex flex-row md:flex-col gap-2 h-full w-full">
        <ScrollArea className="bg-gray-300 flex-1 rounded-lg max-h-full w-full px-2 flex">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`rounded-md my-2 w-fit px-2 py-1 ${
                msg.from === session?.user.email
                  ? "ml-auto bg-purple-400 text-white"
                  : "bg-blue-100"
              }`}
            >
              <div className="text-xs text-gray-500">{msg.from}</div>
              {msg.message}
            </div>
          ))}
          <div ref={lastMessageRef}></div>
        </ScrollArea>

        <div className="flex">
          <Input
            onChange={(e) => setMsgInput(e.target.value)}
            value={msgInput}
            className="rounded-e-none focus-visible:ring-0"
          />
          <Button onClick={OnMessage} className="rounded-s-none">
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
