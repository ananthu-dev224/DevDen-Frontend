import { FC, useState, useEffect, CSSProperties} from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { IoClose } from "react-icons/io5";
import { useDispatch  } from "react-redux";
import { userLogin } from "../redux/reducers/userSlice";
import { verifyOtp, resendOtp } from "../services/userAuth";
import { toast } from "react-toastify";
import ScaleLoader from 'react-spinners/ScaleLoader';

// Types
import { VerifyOtpModalProps } from "../types/type";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "black",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    maxWidth: "400px",
  },
};

Modal.setAppElement("#root");

const VerifyOtpModal: FC<VerifyOtpModalProps> = ({
  isOpen,
  onRequestClose,
  email,
  username,
  password,
}) => {
  const [otp, setOtp] = useState<string>("");
  const [otpTimer, setOtpTimer] = useState<number>(30); 
  const [showResendButton, setShowResendButton] = useState<boolean>(false);
  const [startTimer, setStartTimer] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useDispatch()

  useEffect(() => {
    setOtpTimer(30); // Reset timer when modal opens
    setShowResendButton(false); // Hide resend button initially

    const timer = setInterval(() => {
      setOtpTimer((prevTimer) => {
        if (prevTimer === 1) {
          setShowResendButton(true); // Show resend button when timer reaches 1
          clearInterval(timer); // Stop the timer
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // Cleanup timer on component unmount or modal close
  }, [isOpen,startTimer]); // Depend on isOpen so that it resets every time the modal opens

  const handleResendOtp = () => {
    setStartTimer(true)
    setLoading(true)
    const resendData = {
      email,
      username,
    };
    resendOtp(resendData).then((res) => {
      setLoading(false)
      if (res.status === "success") {
        toast.success(`OTP successfully sent to ${res.email}`);
      }
    });
  };

  const handleVerifyOtp = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setLoading(true)
    if (otp.trim() === "" || otp.length !== 6) {
      return toast.error("Enter 6 digit OTP");
    }
    const otpData = {
      otp: otp,
      email,
      username,
      password,
    };
    const result = await verifyOtp(otpData);
    setLoading(false)
    if (result.status === "success") {
      dispatch(userLogin({user:result.newUser,token:result.token}))
      onRequestClose();
      navigate("/home");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Verify OTP"
      shouldCloseOnOverlayClick={false}
    >
      <button
        className="absolute top-2 right-2 text-gray-700 hover:text-gray-900"
        onClick={onRequestClose}
      >
        <IoClose size={24} />
      </button>
      <h1 className="text-2xl font-bold mb-6 text-center">Verify OTP</h1>
      <form>
        <div className="mb-4">
          <label
            htmlFor="otp"
            className="block text-sm font-medium text-gray-700"
          >
            Enter OTP
          </label>
          <input
            type="text"
            id="otp"
            name="otp"
            maxLength={6}
            onChange={(e) => setOtp(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
            required
          />
        </div>
        <div className="mb-4 flex justify-center">
          {!showResendButton ? (
            <p className="text-gray-600">Resend OTP in {otpTimer} seconds</p>
          ) : (
            <button
              type="button"
              className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white font-medium rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              onClick={handleResendOtp}
            >
              Resend OTP
            </button>
          )}
        </div>
        {loading && (
        <div className="fixed inset-0 bg-gray-100 bg-opacity-75 flex items-center justify-center z-50">
        <ScaleLoader color="black" loading={loading} cssOverride={override} aria-label="Loading Spinner" data-testid="loader" />
      </div>
      )}
        <div className="flex justify-center mb-4">
          <button
            type="submit"
            onClick={handleVerifyOtp}
            className="w-full sm:w-auto px-4 py-2 bg-black text-white font-medium rounded-md shadow-sm hover:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          >
            Verify
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default VerifyOtpModal;