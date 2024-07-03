import { toast } from "react-toastify";
import api from '../utils/api';

import { adminData } from "../types/type";

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