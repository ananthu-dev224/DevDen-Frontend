import api from "../utils/api/user";
import { toast } from "sonner";
import { userLogout } from "../redux/reducers/userSlice";

// report comment : /user/report-comment
export const reportComment = async (
  data: { id: any; type: string },
  dispatch: any
): Promise<any> => {
  try {
    const response = await api.post("/user/report-comment", data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.log(error.response);
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

// report event : /user/report-event
export const reportEvent = async (
  data: { id: any; type: string },
  dispatch: any
): Promise<any> => {
  try {
    const response = await api.post("/user/report-event", data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.log(error.response);
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