import api from "../utils/api/user";
import { toast } from "sonner";
import { profileData, dpData, bannerData } from "../types/type";
import { userLogout } from "../redux/reducers/userSlice";

// Services of profile and cloudinary

export const setProfile = async (
  profileData: profileData,
  dispatch: any
): Promise<any> => {
  try {
    const response = await api.post("/user/edit-profile", profileData);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const message = error.response.data.message || "An error occurred";
      toast.error(message);

      // Check for token verification and authorization errors
      if (
        message === "Token expired" ||
        message === "No token in request" ||
        message === "Failed to authenticate token" ||
        message === "Your access has been restricted by the admin." ||
        message === "Access Denied"
      ) {
        dispatch(userLogout());
      }

      return error.response.data;
    } else {
      toast.error("An unexpected error occurred. Please try again later.");
    }
  }
};

export const generateSign = async (dispatch: any): Promise<any> => {
  try {
    const response = await api.get("/user/cloud-signature");
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const message = error.response.data.message || "An error occurred";
      toast.error(message);

      // Check for token verification and authorization errors
      if (
        message === "Token expired" ||
        message === "No token in request" ||
        message === "Failed to authenticate token" ||
        message === "Your access has been restricted by the admin." ||
        message === "Access Denied"
      ) {
        dispatch(userLogout());
      }

      return error.response.data;
    } else {
      toast.error("An unexpected error occurred. Please try again later.");
    }
  }
};

export const editDp = async (dpData: dpData, dispatch: any): Promise<any> => {
  try {
    const response = await api.post("/user/edit-dp", dpData);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const message = error.response.data.message || "An error occurred";
      toast.error(message);

      // Check for token verification and authorization errors
      if (
        message === "Token expired" ||
        message === "No token in request" ||
        message === "Failed to authenticate token" ||
        message === "Your access has been restricted by the admin." ||
        message === "Access Denied"
      ) {
        dispatch(userLogout());
      }

      return error.response.data;
    } else {
      toast.error("An unexpected error occurred. Please try again later.");
    }
  }
};

export const editBanner = async (
  bannerData: bannerData,
  dispatch: any
): Promise<any> => {
  try {
    const response = await api.post("/user/edit-banner", bannerData);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const message = error.response.data.message || "An error occurred";
      toast.error(message);

      // Check for token verification and authorization errors
      if (
        message === "Token expired" ||
        message === "No token in request" ||
        message === "Failed to authenticate token" ||
        message === "Your access has been restricted by the admin." ||
        message === "Access Denied"
      ) {
        dispatch(userLogout());
      }

      return error.response.data;
    } else {
      toast.error("An unexpected error occurred. Please try again later.");
    }
  }
};