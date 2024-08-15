import { useState, useEffect, useRef } from "react";
import { verifyQR } from "../services/ticket";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";

const QRStatus = () => {
  const [isSuccess, setSuccess] = useState(false);
  const { ticketId } = useParams();
  const dispatch = useDispatch();
  const hasCalled = useRef(false);

  useEffect(() => {
    const verifyTicket = async () => {
      if (!hasCalled.current && ticketId) {
        hasCalled.current = true;
        const res = await verifyQR(ticketId, dispatch);
        if (res.status === "success") {
          setSuccess(true);
        }
      }
    };
    verifyTicket();
  }, [dispatch, ticketId]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 py-8">
      <div className="text-center">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-800 mb-4 animate-bounce">
          QR Code Verification
        </h1>
        {isSuccess && (
          <p className="text-xl md:text-2xl font-semibold text-green-600 mb-2 animate-fadeIn">
            Ticket is Active
          </p>
        )}
        <p className="text-md text-gray-500 animate-fadeIn animation-delay-200">
          Your ticket status is currently being verified.
        </p>
      </div>
    </div>
  );
};

export default QRStatus;
