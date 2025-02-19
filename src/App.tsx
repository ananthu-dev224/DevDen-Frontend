import { FC } from "react";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Toaster } from "sonner";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store";
import "react-toastify/dist/ReactToastify.css";
import 'react-confirm-alert/src/react-confirm-alert.css';
// Pages
import { Signup } from "./Pages/User/Signup";
import { Login } from "./Pages/User/Login";
import { Admin } from "./Pages/Admin/Admin";
import Dashboard from "./Pages/Admin/Dashboard";
import Users from "./Pages/Admin/Users";
import EventPortal from "./Pages/Admin/EventPortal";
import Home from "./Pages/User/Home";
import Profile from "./Pages/User/Profile";
import OtherProfile from "./Pages/User/OtherProfile";
import CreateEvent from "./Pages/User/CreateEvent";
import Explore from "./Pages/User/Explore";
import { ResetPass } from "./Pages/User/ResetPass";
import PaymentFail from "./Pages/User/PaymentFail";
import PaymentSuccess from "./Pages/User/PaymentSuccess";
import Tickets from "./Pages/User/Tickets";
import Page404 from "./Pages/Page404";
import VerifyQR from "./Pages/User/VerifyQR";
import Chat from "./Pages/User/Chat";
import Notifications from "./Pages/User/Notifications";
import CommentReport from "./Pages/Admin/CommentReport";
import EventReport from "./Pages/Admin/EventReport";
import Landing from "./Pages/User/Landing";
// Protected
import AdminProtected from "./routes/adminProtected";
import UserProtected from "./routes/userProtected";

const App: FC = () => {
  return (
    <>
      <ToastContainer />
      <Toaster richColors position="top-right" />
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Router>
            <Routes>
              <Route path="*" element={<Page404 />} />
              <Route path="/" element={<Landing />} />
              <Route path="/home" element={<UserProtected><Home /></UserProtected>} />
              <Route path="/profile" element={<UserProtected><Profile /></UserProtected>} />
              <Route path="/profile/:userId" element={<UserProtected><OtherProfile /></UserProtected>} />
              <Route path="/create-event" element={<UserProtected><CreateEvent /></UserProtected>} />
              <Route path="/explore" element={<UserProtected><Explore /></UserProtected>} />
              <Route path="/chat" element={<UserProtected><Chat /></UserProtected>} />
              <Route path="/notifications" element={<UserProtected><Notifications /></UserProtected>} />
              <Route path="/payment-success" element={<UserProtected><PaymentSuccess /></UserProtected>} />
              <Route path="/payment-failure" element={<UserProtected><PaymentFail /></UserProtected>} />
              <Route path="/my-tickets" element={<UserProtected><Tickets /></UserProtected>} />
              <Route path="/ticket-status/:ticketId" element={<UserProtected><VerifyQR /></UserProtected>} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/reset-password/:token" element={<ResetPass />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/dashboard" element={<AdminProtected><Dashboard /></AdminProtected>} />
              <Route path="/user-desk" element={<AdminProtected><Users /></AdminProtected>} />
              <Route path="/comments" element={<AdminProtected><CommentReport /></AdminProtected>} />
              <Route path="/events" element={<AdminProtected><EventReport /></AdminProtected>} />
              <Route path="/event-portal" element={<AdminProtected><EventPortal /></AdminProtected>} />
            </Routes>
          </Router>
        </PersistGate>
      </Provider>
    </>
  );
};


export default App;