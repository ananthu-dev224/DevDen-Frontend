import api from "../utils/api/user";
import { toast } from "sonner";
import { eventData } from "../types/type";
import { userLogout } from "../redux/reducers/userSlice";

// Services of event in user 

// Add event : /user/create-event
export const addEvent = async (eventData: eventData,dispatch:any): Promise<any> => {
  try {
    const response = await api.post("/user/create-event", eventData);
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

// get events : /user/events
export const getEvents = async (dispatch:any): Promise<any> => {
    try {
      const response = await api.get("/user/events");
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

// get user created Events : /user/event/:userId
export const getCreatedEvents = async (userId:any,dispatch:any): Promise<any> => {
  try {
    const response = await api.get(`/user/event/${userId}`);
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

// get events : /user/all-events
export const getAllEvents = async (dispatch:any): Promise<any> => {
  try {
    const response = await api.get("/user/all-events");
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

// Abort event : /user/abort-event/:eventId
export const abortEvent = async (eventId:any,dispatch:any): Promise<any> => {
  try {
    const response = await api.get(`/user/abort-event/${eventId}`);
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

// Add event : /user/create-event
export const updateEvent = async (eventData: eventData,dispatch:any): Promise<any> => {
  try {
    const response = await api.post("/user/edit-event", eventData);
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

// Like event : /user/like-event
export const likeEvent = async (likeData: {eventId:string},dispatch:any): Promise<any> => {
  try {
    const response = await api.post("/user/like-event", likeData);
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

// save event : /user/save-event
export const saveEvent = async (saveData: {eventId:string},dispatch:any): Promise<any> => {
  try {
    const response = await api.post("/user/save-event", saveData);
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

// check saved event : /user/save-event
export const checkSaved = async (eventId:string,dispatch:any): Promise<any> => {
  try {
    const response = await api.get(`/user/save-event?eventId=${eventId}`);
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

// user saved events : /user/saved
export const userSaved = async (dispatch:any): Promise<any> => {
  try {
    const response = await api.get('/user/saved');
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