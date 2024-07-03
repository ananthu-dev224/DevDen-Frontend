import { FC, useState , useEffect} from "react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import ForgotPassModal from "../../Components/Forgotpass";
import { useNavigate } from "react-router-dom";
import { useDispatch , useSelector } from "react-redux";
import { login } from "../../services/userAuth";
import { userLogin } from "../../redux/reducers/userSlice";
// Types
import { LoginFormState } from "../../types/type";

export const Login: FC = () => {
  const [state, setState] = useState<LoginFormState>({
    isModalOpen: false,
    email: "",
    password: "",
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
    if (state.email.trim() === "" || state.password.trim() === "") {
      return toast.info("Fill all the fields.");
    }else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) {
      return toast.error("Email is not valid");
    }
    const loginData = {
      email: state.email,
      password: state.password,
    };
    const result = await login(loginData);
    if (result.status === "success") {
      dispatch(userLogin({user:result.user,token:result.token}))
      navigate("/");
    }
  };

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
            <button
              type="button"
              className="w-full sm:w-auto px-4 py-2 bg-white border border-stone-950 font-medium rounded-md shadow-sm hover:bg-black hover:text-white focus:outline-none flex items-center justify-center"
            >
              <FcGoogle className="w-6 h-6 mr-2" />
              Login with Google
            </button>
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
        </div>
      </div>
      <ForgotPassModal
        isOpen={state.isModalOpen}
        onRequestClose={() => setState({ ...state, isModalOpen: false })}
      />
    </>
  );
};
