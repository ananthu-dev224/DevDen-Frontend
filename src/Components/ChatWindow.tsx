import { FC, useState, useEffect, useRef } from "react";
import {
  FaVideo,
  FaTrash,
  FaPaperPlane,
  FaReply,
  FaMicrophone,
  FaClock,
} from "react-icons/fa";
import { FiFile } from "react-icons/fi";
import { BsCheckAll } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import pfp from "../assets/pfp.jpeg";
import socket from "../config/socket";
import { useDispatch } from "react-redux";
import { getMessage, addMessage, deleteMessage } from "../services/chat";
import { generateSign } from "../services/profile";
import { formatTimestamp } from "../utils/chatTime";
import { confirmAlert } from "react-confirm-alert";
import { Link } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import axios from "axios";
import { toast } from "sonner";

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
  const [isRead, setIsRead] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [clickedMessageId, setClickedMessageId] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState<any | null>(null);
  const dispatch = useDispatch();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [incomingCall, setIncomingCall] = useState(false);
  const [callConversationId, setCallConversationId] = useState(null);
  const [inCall, setInCall] = useState<boolean>(false);
  const containerRef = useRef(null);
  const fileInputRef = useRef<any>(null);
  const [isSendingFile, setIsSendingFile] = useState<boolean>(false);

  const startVideoCall = async () => {
    // Emit a call request to the recipient
    socket.emit("startCall", { conversationId, userId });

    // Start the call on your end
    const appID = 1954868278;
    const serverSecret = import.meta.env.VITE_ZEGO_SECRET;
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      conversationId || "default_room",
      userId,
      selectedUser.username
    );

    const zego = ZegoUIKitPrebuilt.create(kitToken);
    zego.joinRoom({
      container: containerRef.current,
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONoneCall,
      },
      showScreenSharingButton: true,
      showPreJoinView: true,
      turnOnCameraWhenJoining: false,
      turnOnMicrophoneWhenJoining: false,
      showLeaveRoomConfirmDialog: true,
      onLeaveRoom: () => setInCall(false),
    });

    setInCall(true);
  };

  const acceptCall = async () => {
    socket.emit("acceptCall", { conversationId, userId });

    // Start the call on your end
    const appID = 1954868278;
    const serverSecret = import.meta.env.VITE_ZEGO_SECRET;
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      conversationId || "default_room",
      userId,
      selectedUser.username
    );

    const zego = ZegoUIKitPrebuilt.create(kitToken);
    zego.joinRoom({
      container: containerRef.current,
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONoneCall,
      },
      showScreenSharingButton: true,
      showPreJoinView: true,
      turnOnCameraWhenJoining: false,
      turnOnMicrophoneWhenJoining: false,
      showLeaveRoomConfirmDialog: true,
      onLeaveRoom: () => setInCall(false),
    });

    setInCall(true);
    setIncomingCall(false);
  };

  const handleDeclineCall = () => {
    socket.emit("declineCall", { conversationId, userId });
    setIncomingCall(false);
  };

  // Scroll to bottom function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!conversationId) return;

    if (callConversationId !== conversationId) {
      setIncomingCall(false);
    } else {
      setIncomingCall(true);
    }

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
          if (response.messages.length > 0) {
            const lastMessage = response.messages[response.messages.length - 1];
            if (lastMessage.senderId._id === userId && lastMessage.readBy) {
              const hasBeenReadByOtherUser = lastMessage.readBy.includes(
                selectedUser._id
              );
              setIsRead(hasBeenReadByOtherUser);
            } else {
              setIsRead(false);
            }
          } else {
            setIsRead(false);
          }
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
        if (messages.length > 0) {
          const lastMessage = messages[messages.length - 1];
          if (lastMessage.senderId._id === userId && lastMessage.readBy) {
            const hasBeenReadByOtherUser = lastMessage.readBy.includes(
              selectedUser._id
            );
            setIsRead(hasBeenReadByOtherUser);
          } else {
            setIsRead(false);
          }
        } else {
          setIsRead(false);
        }
      }
    });

    // Listen for typing events
    socket.on("typing", (userId: string) => {
      setIsTyping(true);
    });

    socket.on("stopTyping", (userId: string) => {
      setIsTyping(false);
    });

    // Listen for deleteMessage event
    socket.on("deleteMessage", (data) => {
      console.log("Delete message event:", data);
      setMessages((prevMessages) => {
        const updatedMessages = prevMessages.filter(
          (message) => message._id !== data._id
        );

        if (updatedMessages.length > 0) {
          const lastMessage = updatedMessages[updatedMessages.length - 1];
          if (lastMessage.senderId._id === userId && lastMessage.readBy) {
            const hasBeenReadByOtherUser = lastMessage.readBy.includes(
              selectedUser._id
            );
            setIsRead(hasBeenReadByOtherUser);
          } else {
            setIsRead(false);
          }
        } else {
          setIsRead(false);
        }
        return updatedMessages;
      });
    });

    const handleIncomingCall = (data: any) => {
      const { userId, callConversationId } = data;
      console.log(
        `Incoming call event received: ${callConversationId} - ${conversationId}`
      );
      if (conversationId === callConversationId) {
        setIncomingCall(true);
        setCallConversationId(callConversationId);
      } else {
        setIncomingCall(false);
        setCallConversationId(null);
      }
    };

    socket.on("incomingCall", handleIncomingCall);

    socket.on("callAccepted", () => {
      setIncomingCall(false);
    });

    socket.on("callDeclined", () => {
      setInCall(false);
      setIncomingCall(false);
    });

    return () => {
      socket.emit("leaveConversation", data);
      socket.off("message");
      socket.off("deleteMessage");
      socket.off("incomingCall");
      socket.off("callAccepted");
      socket.off("callDeclined");
    };
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
    // Function to emit messageRead event to the backend
    const markMessagesAsRead = () => {
      if (messages.length > 0) {
        const lastMessage = messages[messages.length - 1];

        if (
          lastMessage.senderId._id !== userId &&
          !lastMessage.readBy.includes(userId)
        ) {
          // Emit to the backend that the messages have been read
          socket.emit("markAsRead", { conversationId, userId });
        }
      }
    };

    // Trigger the markMessagesAsRead function when messages update
    markMessagesAsRead();

    // Listen for the 'messagesRead' event
    socket.on(
      "messagesRead",
      ({ conversationId: incomingConversationId, userId: readerId }) => {
        // Ensure the event is for the current conversation
        if (incomingConversationId === conversationId && userId !== readerId) {
          setIsRead(true);
        }
      }
    );

    return () => {
      socket.off("messagesRead");
    };
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
    const res = await addMessage(
      { conversationId, text: messageText, replyTo: replyMessage },
      dispatch
    );
    if (res.status === "success") {
      socket.emit("sendMessage", res.message);
      setMessageText("");
      setReplyMessage(null);
    } else {
      console.error("Failed to send message to user");
    }
  };

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  const handleSendFile = async (event: any) => {
    const file = event.target.files[0];
    if (!file) return;
    // Upload to Cloudinary
    setIsSendingFile(true);
    const { signature, timestamp } = await generateSign(dispatch);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET || "");
    formData.append("timestamp", timestamp.toString());
    formData.append("signature", signature);
    formData.append("cloud_name", import.meta.env.VITE_CLOUD_NAME || "");
    const contentType = file.type.includes("image") ? "image" : "video";
    try {
      let response;
      if (contentType === "video") {
        response = await axios.post(
          `https://api.cloudinary.com/v1_1/${
            import.meta.env.VITE_CLOUD_NAME
          }/video/upload`,
          formData,
          {
            params: {
              api_key: import.meta.env.VITE_CLOUD_API_KEY,
            },
          }
        );
      } else {
        response = await axios.post(
          `https://api.cloudinary.com/v1_1/${
            import.meta.env.VITE_CLOUD_NAME
          }/image/upload`,
          formData,
          {
            params: {
              api_key: import.meta.env.VITE_CLOUD_API_KEY,
            },
          }
        );
      }

      const fileUrl = response?.data.secure_url;
      handleStopTyping();

      const res = await addMessage(
        {
          conversationId,
          text: fileUrl,
          replyTo: replyMessage,
          content: contentType,
        },
        dispatch
      );
      if (res.status === "success") {
        setIsSendingFile(false);
        socket.emit("sendMessage", res.message);
      } else {
        console.error("Failed to send file to user");
      }
    } catch (error) {
      toast.error("Failed to send file.");
      console.error("Error uploading file:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(e.target.value);
    handleTyping();
  };

  const handleClickMessage = (message: any, senderId: string) => {
    if (senderId === userId) {
      setClickedMessageId((prevMessageId) =>
        prevMessageId === message._id ? null : message._id
      );
    } else {
      setReplyMessage(message);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    const res = await deleteMessage(messageId, dispatch);
    const data = {
      _id: messageId,
      conversationId,
    };
    socket.emit("deleteMessage", data);
  };

  return (
    <>
      {inCall ? (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            ref={containerRef}
            className="relative w-full max-w-screen-md h-full max-h-screen-md bg-white rounded-lg shadow-lg"
          ></div>
          <div className="absolute inset-0 bg-black opacity-50 blur-md"></div>
        </div>
      ) : null}

      <div className="flex-1 bg-white shadow-lg flex flex-col h-full">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <Link to={`/profile/${selectedUser._id}`}>
            <div className="flex items-center space-x-4">
              <img
                src={selectedUser.dp || pfp}
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h2 className="text-xl font-bold">{selectedUser.name}</h2>
                <span className="text-sm text-gray-500">
                  @{selectedUser.username}
                </span>
              </div>
            </div>
          </Link>
          <div className="flex space-x-4">
            <FaVideo
              className="text-gray-500 cursor-pointer hover:text-gray-800"
              size={20}
              onClick={startVideoCall}
            />
          </div>
        </div>
        {incomingCall && !inCall && (
          <div className="flex justify-between items-center p-4 bg-gray-100">
            <span className="font-sans text-blue-500">
              Incoming Call from @{selectedUser.username}
            </span>
            <div>
              <button
                className="px-2 py-2 bg-green-600 text-white font-semibold rounded-full"
                onClick={acceptCall}
              >
                Accept
              </button>
              <button
                className="px-2 py-2 bg-red-600 text-white font-semibold rounded-full ml-2"
                onClick={handleDeclineCall}
              >
                Decline
              </button>
            </div>
          </div>
        )}
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
                    message,
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
                  <>
                    <FaReply
                      className="  text-gray-500 flex justify-end cursor-pointer mt-4 mr-2"
                      onClick={() => setReplyMessage(message)}
                    />
                    <FaTrash
                      className="  text-gray-500 flex justify-end cursor-pointer mt-4 mr-2"
                      onClick={() => {
                        confirmAlert({
                          title: "Confirm to Delete Message",
                          message: "Are you sure?",
                          buttons: [
                            {
                              label: "Yes",
                              onClick: () => {
                                handleDeleteMessage(message._id);
                              },
                            },
                            {
                              label: "No",
                            },
                          ],
                        });
                      }}
                      size={15}
                    />
                  </>
                )}
                <div
                  className={`p-3 rounded-lg max-w-xs ${
                    message.senderId === userId ||
                    message.senderId._id === userId
                      ? "bg-gray-600 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {message.replyTo && (
                    <div
                      className={`mb-2 p-2 rounded-lg ${
                        message.senderId === userId ||
                        message.senderId._id === userId
                          ? "bg-gray-700 text-gray-300"
                          : "bg-gray-300 text-gray-700"
                      }`}
                    >
                      {message.replyTo.content === "image" ? (
                        <img
                          src={message.replyTo.text}
                          alt="reply"
                          className="w-24 h-24 object-cover rounded-md"
                        />
                      ) : message.replyTo.content === "video" ? (
                        <video
                          src={message.replyTo.text}
                          className="w-24 h-24 rounded-md"
                          controls={false}
                        />
                      ) : (
                        <span className="ml-1 text-sm">
                          {message.replyTo.text}
                        </span>
                      )}
                    </div>
                  )}

                  {message.content === "word" && <p>{message.text}</p>}

                  {message.content === "image" && (
                    <img
                      src={message.text}
                      alt="User-uploaded content"
                      className="max-w-full h-auto rounded-lg"
                    />
                  )}

                  {message.content === "video" && (
                    <video controls className="max-w-full h-auto rounded-lg">
                      <source src={message.text} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              </div>
            </>
          ))}
          <div ref={messagesEndRef} />
          {isSendingFile && (
            <div className="flex justify-end items-center text-gray-400">
              <FaClock className="mr-2 animate-rotate" />
              <p className="text-sm">Sending file, it might take a moment</p>
            </div>
          )}
          {isRead && (
            <div
              className="flex justify-end items-center text-blue-500 space-x-2"
              style={{ marginTop: "-1px" }}
            >
              <BsCheckAll className="text-lg" />
            </div>
          )}
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
        {replyMessage && (
          <>
            <div className="flex items-center p-4 border-t border-gray-200 space-x-4">
              <p className="text-gray-400 font-semibold">Reply To :</p>

              <div
                className={`p-3 rounded-lg max-w-xs ${
                  replyMessage.senderId === userId ||
                  replyMessage.senderId._id === userId
                    ? "bg-gray-900 text-white"
                    : "bg-gray-200"
                }`}
              >
                {replyMessage.content === "image" ? (
                  <img
                    src={replyMessage.text}
                    alt="reply"
                    className="w-24 h-24 object-cover rounded-md"
                  />
                ) : replyMessage.content === "video" ? (
                  <video
                    src={replyMessage.text}
                    className="w-24 h-24 rounded-md"
                    controls={false}
                  />
                ) : (
                  <p>{replyMessage.text}</p>
                )}
              </div>

              <div
                className="cursor-pointer"
                onClick={() => setReplyMessage(null)}
              >
                <IoClose />
              </div>
            </div>
          </>
        )}

        <div className="flex items-center p-4 border-t border-gray-200 space-x-4">
          <input
            type="text"
            placeholder="Type a message"
            value={messageText}
            onBlur={handleStopTyping}
            onChange={handleInputChange}
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <FiFile
            className="text-gray-500 cursor-pointer hover:text-gray-800"
            size={24}
            onClick={handleIconClick}
          />
          <input
            type="file"
            accept="image/*,video/*"
            style={{ display: "none" }}
            ref={fileInputRef}
            onChange={handleSendFile}
          />
          <FaMicrophone
            className="text-gray-500 cursor-pointer hover:text-gray-800"
            size={24}
          />
          <FaPaperPlane
            className="text-blue-500 cursor-pointer hover:text-blue-700"
            size={24}
            onClick={handleSendMessage}
          />
        </div>
      </div>
    </>
  );
};

export default ChatWindow;
