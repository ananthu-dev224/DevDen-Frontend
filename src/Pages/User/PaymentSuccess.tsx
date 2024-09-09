import { useEffect, FC, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { buyTicket } from "../../services/ticket";
import { toast } from "sonner";
import Navbar from "../../Components/Navbar";

const PaymentSuccess: FC = () => {
  const [purchased, setPurchased] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const sessionId = searchParams.get("session_id");
  const dispatch = useDispatch();

  const hasProcessedRef = useRef(false);

  useEffect(() => {
    const handlePayment = async () => {
      if (sessionId && !hasProcessedRef.current) {
        hasProcessedRef.current = true;
        try {
          const data = {
            sessionId,
            method: "stripe",
          };
          const res = await buyTicket(data, dispatch);
          if (res.status === "success") {
            setPurchased(true);
          }
        } catch (error) {
          toast.error("Failed to make ticket purchase.");
        }
      } else if (!sessionId) {
        navigate("/");
      }
    };

    handlePayment();
  }, [sessionId, dispatch, navigate]);

  return (
    <div className="flex bg-gray-200 min-h-screen">
      <Navbar />
      <div className="flex-1 p-4 md:p-10 ml-0 md:ml-72 overflow-auto">
        <div className="flex flex-col space-y-10 pb-20 md:pb-0">
          <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-xl font-semibold text-gray-700">
              Payment Successful ✅
            </h1>
            <p className="text-gray-500 mt-2">
              {purchased
                ? "Ticket purchased, Thank you 🤩"
                : "We are processing your ticket purchase, Just a moment..."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;