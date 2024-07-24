import api from "../utils/api/user";
import { toast } from "sonner";
import { userLogout } from "../redux/reducers/userSlice";

// Services of comments in event 

// Add comment : /user/add-comment
export const addComment = async (commentData: {eventId:string,userId:string,text:string},dispatch:any): Promise<any> => {
  try {
    const response = await api.post("/user/add-comment", commentData);
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

// get comments : /user/comments/:id
export const fetchComments = async (eventId:string,dispatch:any): Promise<any> => {
    try {
      const response = await api.get(`/user/comments/${eventId}`);
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

// delete comment : /user/delete-comment/:id
export const deleteComment = async (commentId:string,dispatch:any): Promise<any> => {
    try {
      const response = await api.delete(`/user/delete-comment/${commentId}`);
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

// Like comment : /user/like-comment
export const likeComment = async (likeData: {userId:string,commentId:string},dispatch:any): Promise<any> => {
    try {
      const response = await api.post("/user/like-comment", likeData);
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
  