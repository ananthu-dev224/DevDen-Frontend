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
  eventId?:String
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

export interface DropdownProps {
  onReport?: () => void;
  onClose: () => void;
  onEdit?: () => void;
  onAbort?: () => void;
  onDetails?: () => void;
  isProfile?: boolean;
}

export interface NavItemProps {
  icon: JSX.Element;
  text?: string;
  to?: string;
}

export interface BuyTicketsModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  ticketPrice: number;
  eventImg: string;
  eventId: any;
}

export interface CardProps {
  eventId: string;
  userProfileImage: string;
  username: string;
  postedTime: string;
  image: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  isFree: boolean;
  ticketsLeft?: number;
  ticketPrice?: number;
  likeCount: any[];
  isProfile?:boolean;
  profileEventChange?: () => void;
  fetchSaved?: () => void;
}

export interface CommentModalProps {
  eventId: string;
  isOpen: boolean;
  onRequestClose: () => void;
}

export interface EditEventModalProps {
  showModal: boolean;
  closeModal: () => void;
  profileEventChange?: () => void;
  initialEventData: {
    eventId: string;
    description: string;
    image: string;
    date: string;
    time: string;
    venue: string;
    isFree: boolean;
    totalTickets?: number;
    ticketPrice?: number;
  };
}

export interface EventCropProps {
  imageSrc: string;
  onCropComplete: (croppedImage: string, imageBlob: Blob) => void;
  onClose: () => void;
}

export interface ForgotPassProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

export interface ListNetworkProps {
  isOpen: boolean;
  onClose: () => void;
  followers: any[];
  following: any[];
}

export interface NavItemProps {
  icon: JSX.Element;
  text?: string;
  handleClick?: () => void;
}

export interface ReportModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  category: string;
  id: string;
}