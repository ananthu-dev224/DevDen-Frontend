import { FC, useState, useEffect, useCallback } from "react";
import pfp from "../assets/pfp.jpeg";
import { getConversationUser } from "../services/chat";
import { useDispatch } from "react-redux";
import { formatTimestamp } from "../utils/chatTime";


interface ChatSidebarProps {
  userId: string;
  onSelectConversation: any;
}

const ChatSidebar: FC<ChatSidebarProps> = ({
  userId,
  onSelectConversation,
}) => {
  const [conversations, setConversations] = useState<any[]>([]);
  const dispatch = useDispatch();

  const fetchConversations = useCallback(async () => {
    try {
      const response = await getConversationUser(userId, dispatch);
      const fetchedConv = response.conversation;
      setConversations(fetchedConv);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  }, [userId, dispatch]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return (
    <div className="w-full md:w-1/3 bg-white shadow-lg p-4 mr-3 ">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search"
          className="w-full p-2 rounded-lg border mb-4  focus:border-black outline-none"
        />
        <button className="w-full p-2 bg-gray-900 text-white rounded-lg">
          Create Group Chat
        </button>
      </div>

      <h2 className="text-xl font-bold mb-4">Chats</h2>
      <ul className="space-y-4 max-h-[calc(100vh-240px)] overflow-y-auto">
        {conversations.map((conversation) => {
          const otherMembers = conversation.members.filter(
            (member: any) => member._id !== userId
          );

          return otherMembers.map((memberId: any) => (
            <li
              key={conversation._id}
              onClick={() => onSelectConversation(conversation._id, memberId)}
              className="flex items-center p-2 cursor-pointer hover:bg-gray-100 rounded-lg"
            >
              <img
                src={memberId.dp || pfp}
                alt="User Profile"
                className="w-12 h-12 rounded-full mr-4"
              />
              <div className="flex flex-col">
                <span className="text-gray-900 font-semibold">
                  @{memberId.username}
                </span>
                {memberId.chatStatus === "Online" ? (
                  <span className="text-green-500 text-sm">
                    Active
                  </span>
                ) : (
                  <span className="text-gray-500 text-sm">
                    Last seen {formatTimestamp(memberId.lastSeen)}
                  </span>
                )}
              </div>
            </li>
          ));
        })}
      </ul>
    </div>
  );
};

export default ChatSidebar;