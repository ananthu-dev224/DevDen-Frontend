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

export interface gData {
  token: string;
}

export interface eventData {
  hostId:String,
  image:String,
  description:String,
  date:String,
  time:String,
  venue:String,
  isFree:Boolean,
  totalTickets?:Number,
  ticketPrice?:Number,
}


export interface ImageCropperModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  cropShape: "rectangular" | "circular";
}

export interface EditProfileProps {
  isOpen: boolean;
  onClose: () => void;
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
  loading: boolean;
}

export interface LoginFormState {
  isModalOpen: boolean;
  email: string;
  password: string;
  loading:boolean;
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
  password?: string;
  name?: string;
  dp?: string;
  banner?: string;
  about?: string;
  website?: string;
  contact?: number;
  place?: string;
  isActive: boolean;
  createdAt: string;
  googleId?:string;
}

export interface editProfilePayload {
  _id: string;
  username: string;
  email: string;
  password?: string;
  name?: string;
  dp?: string;
  banner?: string;
  about?: string;
  website?: string;
  contact?: number;
  place?: string;
  isActive: boolean;
  createdAt: string;
  googleId?:string;
}

export interface userSliceType {
  user: userSlicePayload | null;
  token:string | null;
}

export interface users {
  _id:string;
  username:string;
  email:string;
  isActive:boolean;
  createdAt:string;
}

export interface profileData {
  _id: string;
  username: string;
  contact: string;
  name: string;
  about: string;
  website: string;
  place: string;
}

export interface dpData {
  userId: string;
  dp: string;
}

export interface bannerData {
  userId: string;
  banner: string;
}

export interface IconProps {
  fn?: () => void;
}

