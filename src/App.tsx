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
import CreateEvent from "./Pages/User/CreateEvent";
import { ResetPass } from "./Pages/User/ResetPass";
import Page404 from "./Pages/Page404";
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
              <Route path="/" element={<UserProtected><Home /></UserProtected>} />
              <Route path="/profile" element={<UserProtected><Profile /></UserProtected>} />
              <Route path="/create-event" element={<UserProtected><CreateEvent /></UserProtected>} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/reset-password/:token" element={<ResetPass />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/dashboard" element={<AdminProtected><Dashboard /></AdminProtected>} />
              <Route path="/user-desk" element={<AdminProtected><Users /></AdminProtected>} />
              <Route path="/event-portal" element={<AdminProtected><EventPortal /></AdminProtected>} />
            </Routes>
          </Router>
        </PersistGate>
      </Provider>
    </>
  );
};



export default App;