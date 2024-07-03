export interface UserData {
  username: string;
  password: string;
}

export interface otpData {
  otp: string;
  email: string;
}

export interface resendData {
  email: string;
  username: string;
}

export interface loginData {
  email: string;
  password: string;
}

export interface adminData {
  email: string;
  password: string;
}

export interface forgotData {
  email: string;
}

export interface resetData {
  password: string;
  token: string;
}

export interface VerifyOtpModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  email: string;
  username: string;
  password: string;
}

export interface SignupFormState {
  isModalOpen: boolean;
  username: string;
  email: string;
  password: string;
  confirmpass: string;
}

export interface LoginFormState {
  isModalOpen: boolean;
  email: string;
  password: string;
}

export interface adminSliceType {
  admin:string | null;
  token:string | null;
}

export interface adminSlicePayload {
  email:string;
  token:string;
}

export interface userSlicePayload {
  _id: string;
  username: string;
  email: string;
  password: string;
  name?: string;
  image?: string;
  about?: string;
  website?: string;
  contact?: number;
  place?: string;
  isActive: boolean;
  createdAt: string;
}

export interface userSliceType {
  user: userSlicePayload | null;
  token:string | null;
}