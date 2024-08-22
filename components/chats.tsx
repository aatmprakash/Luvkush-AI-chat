"use client";
import axios from "axios";
import { useState } from "react";

export default function ChatComponent() {
  const [messages, setMessages] = useState([
    {
      message: "HI Gud 😊 Morning",
      sender: "ChatGPT",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const API_KEY = "AIzaSyAj-UzfEbDfbYDwTmScLLseaL81qyuOKhI"; // Replace with your API key

  const handleSend = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!input.trim()) return; // Prevent sending empty messages

    const newMessage = {
      message: input,
      sender: "user",
    };

    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setInput("");

    // Start typing indicator
    setIsTyping(true);

    await generateAnswer(newMessages);
  };

  async function generateAnswer(chatMessages: { message: any }[]) {
    try {
      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`,
        method: "POST",
        data: {
          contents: [
            {
              parts: [
                {
                  text: chatMessages
                    .map((msg: { message: any }) => msg.message)
                    .join(" "),
                },
              ],
            },
          ],
        },
      });

      const botMessage = {
        message: response.data.candidates[0].content.parts[0].text, // Update this based on the actual response structure
        sender: "ChatGPT",
      };

      setMessages([...chatMessages, botMessage]);
    } catch (error) {
      console.error("Error generating response:", error);
    } finally {
      setIsTyping(false);
    }
  }

  return (
    <>
      <div className="flex flex-col h-full overflow-y-auto addme">
        <div className="avatar ml-2 -mb-2">
          <div className="w-10 rounded-full">
            <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiCfvvRtL44vg31AAp8jXYyLZaoPB6RFGx1nNFhqiWo1OjMl0kNraDYbIYjGilD7X13sp5SE1aev-AvMz4fWHh2CWBLhUL0xn06RBJ13Eg3rlMj8Dm66ZdUFtDwxPh7HzrZKwy9nQBpyNitAXpQFTOcPmp_FCnm6Yv4xVswZkQ3QVz-lp2THquXWyPkj8Vv/s41/logo.jpg" />
          </div>
        </div>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat ${
              msg.sender === "user" ? "chat-end  " : "chat-start"
            }`}
          >
            <div className="chat-bubble bg-neutral-content/30 text-primary-content max-w-xs p- rounded-lg mt-4 mb-0 animate-fadeIn">
              {msg.message}
            </div>
          </div>
        ))}
        {isTyping && (
          <span className="loading loading-dots loading-md ml-2 bg-primary-content"></span>
        )}
      </div>
      <form className="mt-12 flex-none " onSubmit={handleSend}>
        <input
          type="text"
          placeholder="Type here"
          className="input input-md w-5/6 ml-2 mb-2 bg-artboard text-primary-content placeholder-neutral-content bg-neutral-content/50"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="rounded-xl bg-primary-content p-3 ml-1">{"-->"}</button>
      </form>
    </>
  );
}
