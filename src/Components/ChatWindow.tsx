import { FC, useState, useEffect, useRef } from "react";
import { FaPhone, FaVideo, FaImage, FaPaperPlane } from "react-icons/fa";
import pfp from "../assets/pfp.jpeg";
import socket from "../config/socket";
import { useDispatch } from "react-redux";
import { getMessage, addMessage } from "../services/chat";
import { formatTimestamp } from "../utils/chatTime";

interface ChatWindowProps {
  userId: string;
  conversationId: string | null;
  selectedUser: any;
}

const ChatWindow: FC<ChatWindowProps> = ({
  userId,
  conversationId,
  selectedUser,
}) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [messageText, setMessageText] = useState("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const dispatch = useDispatch();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleImageClick = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = (event) => {
      const file = (event.target as HTMLInputElement)?.files?.[0];
      if (file) {
        console.log("Selected file:", file);
        // Handle file upload here
      }
    };
    fileInput.click();
  };

  useEffect(() => {
    if (!conversationId) return;

    const data = {
      conversationId,
      userId
    }

    // Join the conversation room
    socket.emit("joinConversation",data);

    const fetchMessages = async () => {
      try {
        const response = await getMessage(conversationId, dispatch);
        if (response.status === "success") {
          setMessages(response.messages);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
    scrollToBottom();

    // Listen for new messages
    socket.on("message", (message) => {
      console.log("Received message in window:", message);
      if (message.conversationId === conversationId) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });

    // Listen for typing events
    socket.on("typing", (userId: string) => {
        setIsTyping(true);
    });

    socket.on("stopTyping", (userId: string) => {
        setIsTyping(false);
    });

    return () => {
      socket.emit("leaveConversation",data);
      socket.off("message");
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleTyping = () => {
    socket.emit("typing", { conversationId, userId });
  };

  const handleStopTyping = () => {
    socket.emit("stopTyping", { conversationId, userId });
  };

  const handleSendMessage = async () => {
    handleStopTyping();
    if (messageText.trim() === "") return;

    const newMessage = {
      conversationId,
      senderId: userId,
      text: messageText,
      createdAt: new Date
    };

    socket.emit("sendMessage", newMessage);

    const res = await addMessage(
      { conversationId, text: messageText },
      dispatch
    );
    if (res.status === "success") {
      setMessageText("");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(e.target.value);
    handleTyping();
  };


  return (
    <div className="flex-1 bg-white shadow-lg flex flex-col h-full">
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <img src={pfp} alt="Profile" className="w-10 h-10 rounded-full" />
          <div>
            <h2 className="text-xl font-bold">{selectedUser.name}</h2>
            <span className="text-sm text-gray-500">
              @{selectedUser.username}
            </span>
          </div>
        </div>
        <div className="flex space-x-4">
          <FaPhone
            className="text-gray-500 cursor-pointer hover:text-gray-800"
            size={20}
          />
          <FaVideo
            className="text-gray-500 cursor-pointer hover:text-gray-800"
            size={20}
          />
        </div>
      </div>

      <div
        className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide"
        style={{ maxHeight: "calc(93vh - 200px)" }}
      >
        {messages.map((message, index) => (
          <>
            <div className="text-center text-gray-400 text-xs my-2">
              {formatTimestamp(message.createdAt)}
            </div>
            <div
              key={index}
              className={`flex ${
                message.senderId === userId || message.senderId._id === userId
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`p-3 rounded-lg max-w-xs ${
                  message.senderId === userId || message.senderId._id === userId
                    ? "bg-gray-900 text-white"
                    : "bg-gray-200"
                }`}
              >
                {message.text}
              </div>
            </div>
          </>
        ))}
        <div ref={messagesEndRef} />
        {isTyping && (
        <div className="bg-gray-200 p-4 rounded-lg w-10 flex align-middle justify-center">
          <div className="typing-dots">
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
        </div>
        </div>
      )}
      </div>
      <div className="flex items-center p-4 border-t border-gray-200 space-x-4">
        <input
          type="text"
          placeholder="Type a message"
          value={messageText}
          onBlur={handleStopTyping}
          onChange={handleInputChange}

          className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
        {/* <FaImage
          className="text-gray-500 cursor-pointer hover:text-gray-800"
          size={24}
          onClick={handleImageClick}
        /> */}
        <FaPaperPlane
          className="text-blue-500 cursor-pointer hover:text-blue-700"
          size={24}
          onClick={handleSendMessage}
        />
      </div>
    </div>
  );
};

export default ChatWindow;
