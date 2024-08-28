import { FC, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import ChatSidebar from "../../Components/ChatSidebar";
import ChatWindow from "../../Components/ChatWindow";
import socket from "../../config/socket";
import { useSelector } from "react-redux";
import { getConversation } from "../../services/chat";


const Chat: FC = () => {
  const [selectedConversationId, setSelectedConversationId] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const { _id: userId }  = useSelector((store: any) => store.user.user);
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect( () => {
    const query = new URLSearchParams(location.search);
    const conversationId = query.get('conversationId');
    if(conversationId) {
       const fetchConv = async () => {
           const res = await getConversation(conversationId,dispatch);
           if(res.status === 'success'){
            setSelectedConversationId(conversationId);
            setSelectedUser(res.otherUser);
           }
       }
       fetchConv()
    }
  },[location.search])

  const handleSelectConversation = (conversationId: any, user: any) => {
    setSelectedConversationId(conversationId);
    setSelectedUser(user);
  };
  

  return (
    <div className="flex bg-gray-200 min-h-screen">
      <Navbar />
      <div className="flex-1 flex p-4 md:p-10 ml-0 md:ml-72 overflow-auto">
      <ChatSidebar userId={userId} onSelectConversation={handleSelectConversation} />
        {selectedUser && (
          <ChatWindow
            conversationId={selectedConversationId}
            userId={userId}
            selectedUser={selectedUser}
          />
        )}
      </div>
    </div>
  );
};

export default Chat;