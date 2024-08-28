import api from "../utils/api/user";
import { toast } from "sonner";
import { userLogout } from "../redux/reducers/userSlice";

// Services of chat

// Add conversation : /user/conversation
export const addConversation = async (data:{recieverId:any},dispatch:any): Promise<any> => {
    try {
      const response = await api.post("/user/conversation",data);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        const message = error.response.data.message || "An error occurred";
        toast.error(message);
  
        // Check for token verification and authorization errors
        if (message === "Token expired" || message === 'No token in request' || message === "Failed to authenticate token" || message === "Your access has been restricted by the admin." || message === "Access Denied") {
          dispatch(userLogout());
        }
  
        return error.response.data;
      } else {
        toast.error("An unexpected error occurred. Please try again later.");
      }
    }
};

// Get conversation by user  : /user/conversation/:userId
export const getConversationUser = async (userId:any,dispatch:any): Promise<any> => {
    try {
      const response = await api.get(`/user/conversation/${userId}`);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        const message = error.response.data.message || "An error occurred";
        toast.error(message);
  
        // Check for token verification and authorization errors
        if (message === "Token expired" || message === 'No token in request' || message === "Failed to authenticate token" || message === "Your access has been restricted by the admin." || message === "Access Denied") {
          dispatch(userLogout());
        }
  
        return error.response.data;
      } else {
        toast.error("An unexpected error occurred. Please try again later.");
      }
    }
};

// Get conversation  : /user/conversation?conversationId=convId
export const getConversation = async (convId:any,dispatch:any): Promise<any> => {
  try {
    const response = await api.get(`/user/conversation?conversationId=${convId}`);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const message = error.response.data.message || "An error occurred";
      toast.error(message);

      // Check for token verification and authorization errors
      if (message === "Token expired" || message === 'No token in request' || message === "Failed to authenticate token" || message === "Your access has been restricted by the admin." || message === "Access Denied") {
        dispatch(userLogout());
      }

      return error.response.data;
    } else {
      toast.error("An unexpected error occurred. Please try again later.");
    }
  }
};

// Add message : /user/message
export const addMessage = async (data:{conversationId:any,text:any},dispatch:any): Promise<any> => {
    try {
      const response = await api.post("/user/message",data);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        const message = error.response.data.message || "An error occurred";
        toast.error(message);
  
        // Check for token verification and authorization errors
        if (message === "Token expired" || message === 'No token in request' || message === "Failed to authenticate token" || message === "Your access has been restricted by the admin." || message === "Access Denied") {
          dispatch(userLogout());
        }
  
        return error.response.data;
      } else {
        toast.error("An unexpected error occurred. Please try again later.");
      }
    }
};

// get message : /user/message/:conversationId
export const getMessage = async (conversationId:any,dispatch:any): Promise<any> => {
    try {
      const response = await api.get(`/user/message/${conversationId}`);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        const message = error.response.data.message || "An error occurred";
        toast.error(message);
  
        // Check for token verification and authorization errors
        if (message === "Token expired" || message === 'No token in request' || message === "Failed to authenticate token" || message === "Your access has been restricted by the admin." || message === "Access Denied") {
          dispatch(userLogout());
        }
  
        return error.response.data;
      } else {
        toast.error("An unexpected error occurred. Please try again later.");
      }
    }
};




