import { useState, FC, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import VerifyOtpModal from "../../Components/VerifyOtp";
import { useSelector } from "react-redux";
import { signupUser } from "../../services/userAuth";
import { useNavigate } from "react-router-dom";
// Types
import { SignupFormState } from "../../types/type";

export const Signup: FC = () => {
  const [state, setState] = useState<SignupFormState>({
    isModalOpen: false,
    username: " ",
    email: "",
    password: "",
    confirmpass: "",
  });
  const navigate = useNavigate()
  const user = useSelector((state:any) => state.user.user)

  useEffect(() => {
         if(user){
          navigate('/')
         }
  },[])


  const handleSignup = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (
      state.username.trim() === "" ||
      state.email.trim() === "" ||
      state.password.trim() === ""
    ) {
      return toast.error("Please fill in all fields.");
    } else if (state.password !== state.confirmpass) {
      return toast.error("Passwords do not match.");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) {
      return toast.error("Email is not valid");
    }else if (!/^[a-z0-9\W]+$/.test(state.username)) {
      return toast.error("Username should contain only small letters, numbers and special cases");
    }else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        state.password
      )
    ) {
      return toast.info(
        "Password should contain an upper case , lower case , digit and an special character"
      );
    }
    const userData = {
      username: state.username,
      email: state.email,
      password: state.password,
    };
    const result = await signupUser(userData);
    if (result.status === "success") {
      toast.success(`OTP successfully sent to ${state.email}`)
      setState({ ...state, isModalOpen: true });
    }
  };
  return (
    <>
      <div className="bg-gray-100 flex items-center justify-center min-h-screen overflow-hidden">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold mb-6 text-center">
            Join the DevDen Community, Host or Join Tech events
          </h1>
          <form>
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                onChange={(e) => setState({...state,username:e.target.value})}
                name="username"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none  focus:ring-black focus:border-gray-950 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                onChange={(e) => setState({...state,email:e.target.value})}
                name="email"
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
                id="confirmpassword"
                name="password"
                onChange={(e) => setState({...state,password:e.target.value})}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-gray-950 sm:text-sm"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="password"
                name="confirmpassword"
                onChange={(e) => setState({...state,confirmpass:e.target.value})}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-gray-950 sm:text-sm"
              />
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                onClick={handleSignup}
                className="w-full sm:w-auto px-4 py-2 bg-black text-white font-medium rounded-md shadow-sm  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              >
                Signup
              </button>
            </div>
          </form>
          <div className="flex justify-center mb-4 mt-4">
            <button
              type="button"
              className="w-full sm:w-auto px-4 py-2 bg-white border border-stone-950 font-medium rounded-md shadow-sm hover:bg-black hover:text-white focus:outline-none flex items-center justify-center"
            >
              <FcGoogle className="w-6 h-6 mr-2" />
              Sign up with Google
            </button>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already registered?{" "}
              <a
                href="/login"
                className="text-indigo-600 hover:text-indigo-500"
              >
                Login
              </a>
            </p>
          </div>
        </div>
      </div>
      <VerifyOtpModal
        isOpen={state.isModalOpen}
        onRequestClose={() => setState({ ...state, isModalOpen: false })}
        email={state.email}
        username={state.username}
        password={state.password}
      />
    </>
  );
};
