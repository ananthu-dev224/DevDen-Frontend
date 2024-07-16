import { toast } from "react-toastify";
import {toast as sonner} from 'sonner'
import api from '../utils/api/admin';
import { adminLogout } from "../redux/reducers/adminSlice";
import { adminData } from "../types/type";

// Admin all services

export const login = async (adminData:adminData): Promise<any> => {
    try {
      const response = await api.post('/admin/login',adminData);
      return response.data;
    } catch (error:any) {
      if (error.response) {
        toast.error(error.response.data.message || 'An error occurred.');
        return error.response.data;
      } else {
        toast.error('An unexpected error occurred. Please try again later.');
      }
    }
};

export const getUsers = async (dispatch:any): Promise<any> => {
  try {
    const response = await api.get('/admin/user-management');
    return response.data;
  } catch (error:any) {
    if (error.response) {
      const message = error.response.data.message || "An error occurred";
      sonner(message);

      // Check for token verification and authorization errors
      if (message === "Token expired"  || message === 'No token in request' || message === "Failed to authenticate token" || message === "Invalid Token Structure" || message === "Access Denied: Admin Only") {
        dispatch(adminLogout());
      }

      return error.response.data;
    } else {
      sonner("An unexpected error occurred. Please try again later.");
    }
  }
};

export const toggleUser = async (id:string,dispatch:any): Promise<any> => {
  try {
    const response = await api.get(`/admin/user-management/${id}`);
    return response.data;
  } catch (error:any) {
    if (error.response) {
      const message = error.response.data.message || "An error occurred";
      sonner(message);

      // Check for token verification and authorization errors
      if (message === "Token expired"  || message === 'No token in request' || message === "Failed to authenticate token" || message === "Invalid Token Structure" || message === "Access Denied: Admin Only") {
        dispatch(adminLogout());
      }

      return error.response.data;
    } else {
      sonner("An unexpected error occurred. Please try again later.");
    }
  }
};