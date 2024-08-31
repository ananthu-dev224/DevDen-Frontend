import { FC, useState, useEffect, useRef } from "react";
import { FaPhone, FaVideo, FaTrash, FaPaperPlane } from "react-icons/fa";
import pfp from "../assets/pfp.jpeg";
import socket from "../config/socket";
import { useDispatch } from "react-redux";
import { getMessage, addMessage, deleteMessage } from "../services/chat";
import { formatTimestamp } from "../utils/chatTime";
import { confirmAlert } from 'react-confirm-alert';
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

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
  const [clickedMessageId, setClickedMessageId] = useState<string | null>(null);
  const dispatch = useDispatch();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!conversationId) return;

    const data = {
      conversationId,
      userId,
    };

    // Join the conversation room
    socket.emit("joinConversation", data);

    const fetchMessages = async () => {
      try {
        const response = await getMessage(conversationId, dispatch);
        if (response.status === "success") {
          setMessages(response.messages);
          console.log(messages)
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
      socket.emit("leaveConversation", data);
      socket.off("message");
    };
  }, [conversationId]);

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
    
    const tempId = uuidv4();
    
    const newMessage = {
      _id: tempId,
      conversationId,
      senderId: userId,
      text: messageText,
      createdAt: new Date(),
    };

    socket.emit("sendMessage", newMessage);

    const res = await addMessage(
      { conversationId, text: messageText },
      dispatch
    );
    if (res.status === "success") {
      // Replace the temporary message with the real one in the state
      setMessages((prevMessages) =>
        prevMessages.map((message) =>
          message._id === tempId
            ? { ...message, _id: res.message._id}
            : message
        )
      );
      setMessageText("");
    } else {
      setMessages((prevMessages) =>
        prevMessages.filter((message) => message._id !== tempId)
      );
      console.error("Failed to save message to database");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(e.target.value);
    handleTyping();
  };

  const handleClickMessage = (messageId: string, senderId: string) => {
    if (senderId === userId) {
      setClickedMessageId((prevMessageId) =>
        prevMessageId === messageId ? null : messageId
      );
      console.log(clickedMessageId);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    const res = await deleteMessage(messageId, dispatch);
    if (res.status === "success") {
      setMessages((prevMessages) =>
        prevMessages.filter((message) => message._id !== messageId)
      );
    }
  };

  return (
    <div className="flex-1 bg-white shadow-lg flex flex-col h-full">
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
      <Link to={`/profile/${selectedUser._id}`} >
        <div className="flex items-center space-x-4">
          <img src={selectedUser.dp || pfp} alt="Profile" className="w-10 h-10 rounded-full" />
          <div>
            <h2 className="text-xl font-bold">{selectedUser.name}</h2>
            <span className="text-sm text-gray-500">
              @{selectedUser.username}
            </span>
          </div>
        </div>
        </Link>
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
              onClick={() =>
                handleClickMessage(
                  message._id,
                  message.senderId._id || message.senderId
                )
              }
              className={`flex  ${
                message.senderId === userId || message.senderId._id === userId
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              {clickedMessageId === message._id && (
                <FaTrash
                  className="  text-gray-500 flex justify-end cursor-pointer mt-4 mr-2"
                  onClick={() => {
                    confirmAlert({
                      title: 'Confirm to Delete Message',
                      message: 'Are you sure?',
                      buttons: [
                        {
                          label: 'Yes',
                          onClick: () => {
                            handleDeleteMessage(message._id);
                          }
                        },
                        {
                          label: 'No',
                        }
                      ]
                    });
                  }}
                  size={15}
                />
              )}
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