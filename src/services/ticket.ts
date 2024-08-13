import api from "../utils/api/user";
import { toast } from "sonner";
import { userLogout } from "../redux/reducers/userSlice";

// Stripe checkout : /user/checkout-session
export const checkoutSession = async (data:{amount:number,quantity:number,eventImg:string,eventId:any},dispatch:any): Promise<any> => {
    try {
      const response = await api.post('/user/checkout-session',data)
      return response.data.id;
    } catch (error: any) {
      if (error.response) {
        console.log(error.response)
        const message = error.response.data.message || "An error occurred";
        toast.error(message);
  
        // Check for token verification and authorization errors
        if (message === "Token expired" || message === 'No token in request' || message === "Failed to authenticate token" || message === "Your access has been restricted by the admin." || message === "Access Denied") {
          dispatch(userLogout());
        }
  
        return error.response.data;
      } else {
        toast.error("An unexpected error occurred. Please try again later.");
      }
    }
};

// Buy Ticket : /user/ticket
export const buyTicket = async (data:{totalCost?:number,quantity?:number,eventId?:any,method:string,sessionId?:string},dispatch:any): Promise<any> => {
    try {
      const response = await api.post('/user/ticket',data)
      return response.data;
    } catch (error: any) {
      if (error.response) {
        console.log(error.response)
        const message = error.response.data.message || "An error occurred";
        toast.error(message);
  
        // Check for token verification and authorization errors
        if (message === "Token expired" || message === 'No token in request' || message === "Failed to authenticate token" || message === "Your access has been restricted by the admin." || message === "Access Denied") {
          dispatch(userLogout());
        }
  
        return error.response.data;
      } else {
        toast.error("An unexpected error occurred. Please try again later.");
      }
    }
};

// get user tickets : /user/my-tickets
export const userTickets = async (dispatch:any): Promise<any> => {
  try {
    const response = await api.get('/user/my-tickets')
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.log(error.response)
      const message = error.response.data.message || "An error occurred";
      toast.error(message);

      // Check for token verification and authorization errors
      if (message === "Token expired" || message === 'No token in request' || message === "Failed to authenticate token" || message === "Your access has been restricted by the admin." || message === "Access Denied") {
        dispatch(userLogout());
      }

      return error.response.data;
    } else {
      toast.error("An unexpected error occurred. Please try again later.");
    }
  }
};

// get eventDetails : /user/event-details/:id
export const eventDetails = async (eventId:any,dispatch:any): Promise<any> => {
  try {
    const response = await api.get(`/user/event-details/${eventId}`)
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.log(error.response)
      const message = error.response.data.message || "An error occurred";
      toast.error(message);

      // Check for token verification and authorization errors
      if (message === "Token expired" || message === 'No token in request' || message === "Failed to authenticate token" || message === "Your access has been restricted by the admin." || message === "Access Denied") {
        dispatch(userLogout());
      }

      return error.response.data;
    } else {
      toast.error("An unexpected error occurred. Please try again later.");
    }
  }
};

// cancel and refund ticket : /user/cancel-ticket
export const cancelTicket = async (cancelData:{ticketId:any},dispatch:any): Promise<any> => {
  try {
    const response = await api.post('/user/cancel-ticket',cancelData)
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.log(error.response)
      const message = error.response.data.message || "An error occurred";
      toast.error(message);

      // Check for token verification and authorization errors
      if (message === "Token expired" || message === 'No token in request' || message === "Failed to authenticate token" || message === "Your access has been restricted by the admin." || message === "Access Denied") {
        dispatch(userLogout());
      }

      return error.response.data;
    } else {
      toast.error("An unexpected error occurred. Please try again later.");
    }
  }
};

// downloadTicket as pdf : /user/download-ticket/:ticketId
export const downloadTicket = async (ticketId:any,dispatch:any): Promise<any> => {
  try {
    const response = await api.get(`/user/download-ticket/${ticketId}`, {
      responseType: 'blob', // Important for handling file downloads
    });
    // Create a URL for the blob object
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));

    // Create a link element and trigger a download
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `DevDen Ticket-${ticketId}.pdf`);
    document.body.appendChild(link);
    link.click();

    // Clean up and remove the link
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error: any) {
    if (error.response) {
      console.log(error.response)
      const message = error.response.data.message || "An error occurred";
      toast.error(message);

      // Check for token verification and authorization errors
      if (message === "Token expired" || message === 'No token in request' || message === "Failed to authenticate token" || message === "Your access has been restricted by the admin." || message === "Access Denied") {
        dispatch(userLogout());
      }

      return error.response.data;
    } else {
      toast.error("An unexpected error occurred. Please try again later.");
    }
  }
};