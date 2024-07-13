import api from '../utils/api/user';
import { toast } from 'react-toastify';

// Types
import { UserData, otpData, resendData, loginData , forgotData, resetData, gData} from '../types/type';

// User auth services

export const signupUser = async (userData: UserData): Promise<any> => {
  try {
    const response = await api.post('/user/signup', userData);
    return response.data;
  } catch (error:any) {
    if (error.response) {
      toast.error(error.response.data.message || 'An error occured');
      return error.response.data
    } else {
      toast.error('An unexpected error occurred. Please try again later.');
    }
  }
};

export const verifyOtp = async (otpData: otpData): Promise<any> => {
  try {
    const response = await api.post('/user/verify-otp', otpData);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      toast.error(error.response.data.message || 'An error occurred.');
      return error.response.data;
    } else {
      toast.error('An unexpected error occurred. Please try again later.');
    }
  }
};

export const resendOtp = async (resendData:resendData): Promise<any> => {
  try {
    const response = await api.post('/user/resend-otp',resendData);
    return response.data;
  } catch (error:any) {
    if (error.response) {
      toast.error(error.response.data.message || 'An error occurred.');
      return error.response.data;;
    } else {
      toast.error('An unexpected error occurred. Please try again later.');
    }
  }
};

export const login = async (loginData:loginData): Promise<any> => {
  try {
    const response = await api.post('/user/login',loginData);
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

export const forgotPassword = async (forgotData:forgotData): Promise<any> => {
  try {
    const response = await api.post('/user/forgot-password',forgotData);
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

export const validateResetToken = async (token:string): Promise<any> => {
  try {
    const response = await api.get(`/user/validate-reset-token/${token}`);
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

export const resetPassword = async (resetData:resetData): Promise<any> => {
  try {
    const response = await api.post('/user/reset-password',resetData);
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

export const oauth = async (gData:gData): Promise<any> => {
  try {
    const response = await api.post('/user/oauth',gData);
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