import { toast } from "react-toastify";
import { toast as sonner } from "sonner";
import api from "../utils/api/admin";
import { adminLogout } from "../redux/reducers/adminSlice";
import { adminData } from "../types/type";

// Admin all services

export const login = async (adminData: adminData): Promise<any> => {
  try {
    const response = await api.post("/admin/login", adminData);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      toast.error(error.response.data.message || "An error occurred.");
      return error.response.data;
    } else {
      toast.error("An unexpected error occurred. Please try again later.");
    }
  }
};

export const getUsers = async (dispatch: any): Promise<any> => {
  try {
    const response = await api.get("/admin/user-management");
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const message = error.response.data.message || "An error occurred";
      sonner.error(message);

      // Check for token verification and authorization errors
      if (
        message === "Token expired" ||
        message === "No token in request" ||
        message === "Failed to authenticate token" ||
        message === "Invalid Token Structure" ||
        message === "Access Denied: Admin Only"
      ) {
        dispatch(adminLogout());
      }

      return error.response.data;
    } else {
      sonner.error("An unexpected error occurred. Please try again later.");
    }
  }
};

export const toggleUser = async (id: string, dispatch: any): Promise<any> => {
  try {
    const response = await api.get(`/admin/user-management/${id}`);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const message = error.response.data.message || "An error occurred";
      sonner.error(message);

      // Check for token verification and authorization errors
      if (
        message === "Token expired" ||
        message === "No token in request" ||
        message === "Failed to authenticate token" ||
        message === "Invalid Token Structure" ||
        message === "Access Denied: Admin Only"
      ) {
        dispatch(adminLogout());
      }

      return error.response.data;
    } else {
      sonner.error("An unexpected error occurred. Please try again later.");
    }
  }
};

// get not approved events : /admin/event-portal
export const getAdminEvents = async (dispatch: any): Promise<any> => {
  try {
    const response = await api.get("/admin/event-portal");
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const message = error.response.data.message || "An error occurred";
      sonner.error(message);

      // Check for token verification and authorization errors
      if (
        message === "Token expired" ||
        message === "No token in request" ||
        message === "Failed to authenticate token" ||
        message === "Your access has been restricted by the admin." ||
        message === "Access Denied"
      ) {
        dispatch(adminLogout());
      }

      return error.response.data;
    } else {
      sonner.error("An unexpected error occurred. Please try again later.");
    }
  }
};

// approve event : /admin/event-approve/:id
export const approveEvent = async (id: string, dispatch: any): Promise<any> => {
  try {
    const response = await api.get(`/admin/event-approve/${id}`);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const message = error.response.data.message || "An error occurred";
      sonner.error(message);

      // Check for token verification and authorization errors
      if (
        message === "Token expired" ||
        message === "No token in request" ||
        message === "Failed to authenticate token" ||
        message === "Invalid Token Structure" ||
        message === "Access Denied: Admin Only"
      ) {
        dispatch(adminLogout());
      }

      return error.response.data;
    } else {
      sonner.error("An unexpected error occurred. Please try again later.");
    }
  }
};

export const getComments = async (dispatch: any): Promise<any> => {
  try {
    const response = await api.get("/admin/comment-reports");
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const message = error.response.data.message || "An error occurred";
      sonner.error(message);

      // Check for token verification and authorization errors
      if (
        message === "Token expired" ||
        message === "No token in request" ||
        message === "Failed to authenticate token" ||
        message === "Invalid Token Structure" ||
        message === "Access Denied: Admin Only"
      ) {
        dispatch(adminLogout());
      }

      return error.response.data;
    } else {
      sonner.error("An unexpected error occurred. Please try again later.");
    }
  }
};

export const toggleComment = async (
  id: string,
  dispatch: any
): Promise<any> => {
  try {
    const response = await api.patch("/admin/report-comment", { id });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const message = error.response.data.message || "An error occurred";
      sonner.error(message);

      // Check for token verification and authorization errors
      if (
        message === "Token expired" ||
        message === "No token in request" ||
        message === "Failed to authenticate token" ||
        message === "Invalid Token Structure" ||
        message === "Access Denied: Admin Only"
      ) {
        dispatch(adminLogout());
      }

      return error.response.data;
    } else {
      sonner.error("An unexpected error occurred. Please try again later.");
    }
  }
};

export const getEventReports = async (dispatch: any): Promise<any> => {
  try {
    const response = await api.get("/admin/event-reports");
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const message = error.response.data.message || "An error occurred";
      sonner.error(message);

      // Check for token verification and authorization errors
      if (
        message === "Token expired" ||
        message === "No token in request" ||
        message === "Failed to authenticate token" ||
        message === "Invalid Token Structure" ||
        message === "Access Denied: Admin Only"
      ) {
        dispatch(adminLogout());
      }

      return error.response.data;
    } else {
      sonner.error("An unexpected error occurred. Please try again later.");
    }
  }
};

export const toggleEvent = async (id: string, dispatch: any): Promise<any> => {
  try {
    const response = await api.patch("/admin/report-event", { id });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const message = error.response.data.message || "An error occurred";
      sonner.error(message);

      // Check for token verification and authorization errors
      if (
        message === "Token expired" ||
        message === "No token in request" ||
        message === "Failed to authenticate token" ||
        message === "Invalid Token Structure" ||
        message === "Access Denied: Admin Only"
      ) {
        dispatch(adminLogout());
      }

      return error.response.data;
    } else {
      sonner.error("An unexpected error occurred. Please try again later.");
    }
  }
};

// dashboard stati: /admin/dashboard
export const getDashboard = async (dispatch: any): Promise<any> => {
  try {
    const response = await api.get("/admin/dashboard");
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const message = error.response.data.message || "An error occurred";
      sonner.error(message);

      // Check for token verification and authorization errors
      if (
        message === "Token expired" ||
        message === "No token in request" ||
        message === "Failed to authenticate token" ||
        message === "Your access has been restricted by the admin." ||
        message === "Access Denied"
      ) {
        dispatch(adminLogout());
      }

      return error.response.data;
    } else {
      sonner.error("An unexpected error occurred. Please try again later.");
    }
  }
};