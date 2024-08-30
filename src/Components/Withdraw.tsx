import { FC, useState, CSSProperties } from "react";
import Modal from "react-modal";
import { IoClose } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import ScaleLoader from "react-spinners/ScaleLoader";
import { withdraw } from "../services/ticket";
import { editProfile } from "../redux/reducers/userSlice";

// Types
export interface WithdrawProps {
  isOpen: boolean;
  onRequestClose: () => void;
  balance: number;
}

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

const WithdrawModal: FC<WithdrawProps> = ({
  isOpen,
  onRequestClose,
  balance,
}) => {
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

  const handleWithdraw = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    if (balance < amount || amount === 0) {
      setLoading(false);
      return toast.error("Insufficient wallet balance");
    }
    const data = {
      amount,
    };
    const res = await withdraw(data, dispatch);
    setLoading(false);
    if (res.status === "success") {
      const userData = res.updatedUser;
      console.log(userData)
      toast.success("Withdrawal success to your stripe connect account.");
      dispatch(editProfile({ user: userData }));
      onRequestClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Enter amount to withdraw."
      shouldCloseOnOverlayClick={false}
    >
      <button
        className="absolute top-2 right-2 text-gray-700 hover:text-gray-900"
        onClick={onRequestClose}
      >
        <IoClose size={24} />
      </button>
      <h1 className="text-2xl font-bold mb-6 text-center">
        Enter amount to withdraw.
      </h1>
      <form>
        <div className="mb-4">
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700"
          >
            Available Balance : $ {balance}
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            maxLength={5}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
            required
          />
        </div>
        {loading && (
          <div className="fixed inset-0 bg-gray-100 bg-opacity-75 flex items-center justify-center z-50">
            <ScaleLoader
              color="black"
              loading={loading}
              cssOverride={override}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
        )}
        <div className="flex justify-center mb-4">
          <button
            type="submit"
            onClick={handleWithdraw}
            className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white font-medium rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          >
            Withdraw
          </button>
        </div>
      </form>
    </Modal>
  );
};



export default WithdrawModal;