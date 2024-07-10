import { FC, useState , useEffect, CSSProperties} from "react";
import { toast } from "react-toastify";
import ForgotPassModal from "../../Components/Forgotpass";
import { useNavigate } from "react-router-dom";
import { useDispatch , useSelector } from "react-redux";
import { login, oauth } from "../../services/userAuth";
import { userLogin } from "../../redux/reducers/userSlice";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import ScaleLoader from 'react-spinners/ScaleLoader';
// Types
import { LoginFormState } from "../../types/type";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "black",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};


export const Login: FC = () => {
  const [state, setState] = useState<LoginFormState>({
    isModalOpen: false,
    email: "",
    password: "",
    loading: false
  });

  const navigate = useNavigate();
  const user = useSelector((state:any) => state.user.user)
  const dispatch = useDispatch()
  useEffect(() => {
       if(user){
          navigate('/')
       }
  },[])
  const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setState({ ...state, loading: true });
    if (state.email.trim() === "" || state.password.trim() === "") {
      setState({ ...state, loading: false });
      return toast.info("Fill all the fields.");
    }else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) {
      setState({ ...state, loading: false });
      return toast.error("Email is not valid");
    }
    const loginData = {
      email: state.email,
      password: state.password,
    };
    const result = await login(loginData);
    setState({ ...state, loading: false });
    if (result.status === "success") {
      dispatch(userLogin({user:result.user,token:result.token}))
      navigate("/");
    }
  };

  const gSuccess = async (res:any) => {
    setState({ ...state, loading: true });
    const gData = {
      token:res.credential
    }
    const result = await oauth(gData);
    setState({ ...state, loading: false });
    if (result.status === "success") {
      dispatch(userLogin({user:result.user,token:result.token}))
      navigate("/");
    }
  }

  const gFail = () => {
     toast.error("An error occured in google sigin , please use other method")
  }

  return (
    <>
      <div className="bg-gray-100 flex items-center justify-center min-h-screen overflow-hidden">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold mb-6 text-center">
            Welcome Back to DevDen.
          </h1>
          <form>
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="text"
                id="email"
                name="email"
                onChange={(e) => setState({ ...state, email: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none  focus:ring-black focus:border-gray-950 sm:text-sm"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                onChange={(e) =>
                  setState({ ...state, password: e.target.value })
                }
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-gray-950 sm:text-sm"
              />
              <p
                className="text-sm text-gray-600 hover:cursor-pointer"
                onClick={() => setState({ ...state, isModalOpen: true })}
              >
                forgot password?
              </p>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                onClick={handleLogin}
                className="w-full sm:w-auto px-4 py-2 bg-black text-white font-medium rounded-md shadow-sm  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              >
                Login
              </button>
            </div>
          </form>
          <div className="flex justify-center mb-4 mt-4">
          <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <div>
                <GoogleLogin
                    onSuccess={gSuccess}
                    onError={gFail}
                />
            </div>
        </GoogleOAuthProvider>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">
              New User?{" "}
              <a
                href="/signup"
                className="text-indigo-600 hover:text-indigo-500"
              >
                Signup
              </a>
            </p>
          </div>
          {state.loading && (
        <div className="fixed inset-0 bg-gray-100 bg-opacity-75 flex items-center justify-center z-50">
        <ScaleLoader color="black" loading={state.loading} cssOverride={override} aria-label="Loading Spinner" data-testid="loader" />
      </div>
      )}
        </div>
      </div>
      <ForgotPassModal
        isOpen={state.isModalOpen}
        onRequestClose={() => setState({ ...state, isModalOpen: false })}
      />
    </>
  );
};
