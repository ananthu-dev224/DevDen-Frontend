import React, { FC, useState, CSSProperties } from "react";
import Modal from "react-modal";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";
import { forgotPassword } from "../services/userAuth";
import ScaleLoader from 'react-spinners/ScaleLoader';
import { ForgotPassProps } from "../types/type";


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

const ForgotPassModal: FC<ForgotPassProps> = ({ isOpen, onRequestClose }) => {
  const [email, setEmail] = useState("");
  const [loading,setLoading] = useState(false)

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setLoading(true)
    if (email.trim() === "") {
      setLoading(false)
      return toast.info("Fill all the fields.");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setLoading(false)
      return toast.error("Email is not valid");
    }
    const forgotData = {
      email,
    };

    const res = await forgotPassword(forgotData);
    setLoading(false)
    if (res.status === "success") {
      toast.success(res.message);
      onRequestClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Provide Registered Email"
      shouldCloseOnOverlayClick={false}
    >
      <button
        className="absolute top-2 right-2 text-gray-700 hover:text-gray-900"
        onClick={onRequestClose}
      >
        <IoClose size={24} />
      </button>
      <h1 className="text-2xl font-bold mb-6 text-center">Registered Email</h1>
      <form>
        <div className="mb-4">
          <label
            htmlFor="otp"
            className="block text-sm font-medium text-gray-700"
          >
            Enter your registered email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
            required
          />
        </div>
        {loading && (
        <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
        <ScaleLoader color="black" loading={loading} cssOverride={override} aria-label="Loading Spinner" data-testid="loader" />
      </div>
      )}
        <div className="flex justify-center mb-4">
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full sm:w-auto px-4 py-2 bg-black text-white font-medium rounded-md shadow-sm hover:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          >
            Send Reset Link
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ForgotPassModal;
