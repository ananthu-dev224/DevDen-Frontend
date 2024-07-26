import api from "../utils/api/user";
import { toast } from "sonner";
import { userLogout } from "../redux/reducers/userSlice";

// search users in explore : /user/search/:query
export const searchUsers = async (query:string,dispatch:any): Promise<any> => {
    try {
        const response = await api.get(`/user/search/${query}`,)
      return response.data;
    } catch (error: any) {
      if (error.response) {
        console.log(error.response)
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

// get users profile : /user/profile/:userId
export const getUserDetails = async (userId:string,dispatch:any): Promise<any> => {
    try {
      const response = await api.get(`/user/profile/${userId}`,)
      return response.data;
    } catch (error: any) {
      if (error.response) {
        console.log(error.response)
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


// follow : /user/follow
export const follow = async (data:{followerId:string},dispatch:any): Promise<any> => {
  try {
    const response = await api.post('/user/follow',data)
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.log(error.response)
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

// unfollow : /user/unfollow
export const unfollow = async (data:{followerId:string},dispatch:any): Promise<any> => {
  try {
    const response = await api.post('/user/unfollow',data)
    console.log(response.data)
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.log(error.response)
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

// get following : /user/following/:userId
export const getFollowing = async (userId:string,dispatch:any): Promise<any> => {
  try {
    const response = await api.get(`/user/following/${userId}`)
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.log(error.response)
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

// get followers : /user/followers/:userId
export const getFollowers = async (userId:string,dispatch:any): Promise<any> => {
  try {
    const response = await api.get(`/user/followers/${userId}`)
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.log(error.response)
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