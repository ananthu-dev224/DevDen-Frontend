import { FC, useState } from "react";
import { FaTimes, FaPlus, FaMinus } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { checkoutSession } from "../services/ticket";
import { toast } from "sonner";
import { loadStripe } from "@stripe/stripe-js";
import { BuyTicketsModalProps } from "../types/type";

const BuyTicketModal: FC<BuyTicketsModalProps> = ({
  isOpen,
  onRequestClose,
  ticketPrice,
  eventImg,
  eventId,
}) => {
  const [numberOfTickets, setNumberOfTickets] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const dispatch = useDispatch();

  const handleNumberOfTicketsChange = (amount: number) => {
    setNumberOfTickets((prev) => Math.max(1, Math.min(prev + amount, 10)));
  };

  const handlePaymentMethodChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPaymentMethod(e.target.value);
  };

  const totalCost = ticketPrice * numberOfTickets;

  const handlePayment = async () => {
    if (paymentMethod === "stripe") {
      try {
        const data = {
          amount: ticketPrice * 100, //dollars to cents convert
          quantity: numberOfTickets,
          eventImg,
          eventId,
        };

        const sessionId = await checkoutSession(data, dispatch);
        const stripe = await loadStripe(import.meta.env.VITE_STRIPE_API_KEY || "");

        if (!stripe) {
          toast.error("Stripe.js has not loaded.");
          return;
        }

        const { error } = await stripe.redirectToCheckout({
          sessionId,
        });

        if (error) {
          toast.error("Redirect to Stripe checkout failed. Please try again");
        }
      } catch (error) {
        console.log(error);
        toast.error("Redirect to Stripe checkout failed. Please try again");
      }
    } else {
      // Handle other payment methods
    }

    onRequestClose();
  };

  return isOpen ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Buy Tickets</h2>
          <FaTimes
            className="text-gray-500 cursor-pointer"
            onClick={onRequestClose}
          />
        </div>
        <div className="w-full h-auto">
          <img
            src={eventImg}
            alt="Event"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <div className="mb-4 flex items-center">
            <label className="block text-gray-700 mb-2 mr-4">
              Number of Tickets
            </label>
            <button
              onClick={() => handleNumberOfTicketsChange(-1)}
              className="bg-gray-300 rounded-full p-2 disabled:opacity-50"
              disabled={numberOfTickets <= 1}
            >
              <FaMinus />
            </button>
            <span className="mx-4">{numberOfTickets}</span>
            <button
              onClick={() => handleNumberOfTicketsChange(1)}
              className="bg-gray-300 rounded-full p-2 disabled:opacity-50"
              disabled={numberOfTickets >= 10}
            >
              <FaPlus />
            </button>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Payment Method</label>
            <div className="flex items-center">
              <input
                type="radio"
                id="stripe"
                name="paymentMethod"
                value="stripe"
                checked={paymentMethod === "stripe"}
                onChange={handlePaymentMethodChange}
              />
              <label htmlFor="stripe" className="ml-2">
                Stripe
              </label>
            </div>
          </div>
          <div className="flex justify-between text-gray-700 mb-4">
            <span>Cost per Ticket</span>
            <span>${ticketPrice}</span>
          </div>
          <div className="flex justify-between text-gray-700 mb-4">
            <span>Total Cost</span>
            <span>${totalCost}</span>
          </div>
          <div className="flex justify-end p-4 border-t">
            <button
              className="bg-indigo-600 text-white px-4 py-2 rounded-sm"
              onClick={handlePayment}
            >
              Purchase
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default BuyTicketModal;