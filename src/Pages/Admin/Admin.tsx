import { FC, useState, useEffect, CSSProperties } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../services/adminAuth";
import { adminLogin } from "../../redux/reducers/adminSlice";
import ScaleLoader from "react-spinners/ScaleLoader";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "black",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

export const Admin: FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const admin = useSelector((state: any) => state.admin.admin);
  const dispatch = useDispatch();

  useEffect(() => {
    if (admin) {
      navigate("/dashboard");
    }
  }, []);

  const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    if (email.trim() === "" || password.trim() === "") {
      setLoading(false);
      return toast.info("Fill all the fields.");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setLoading(false);
      return toast.error("Email is not valid");
    }
    const adminData = {
      email,
      password,
    };

    const res = await login(adminData);
    setLoading(false);
    if (res.status === "success") {
      dispatch(adminLogin({ email: res.email, token: res.token }));
      navigate("/dashboard");
    }
  };

  return (
    <>
      <div className="bg-gray-100 flex items-center justify-center min-h-screen overflow-hidden">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold mb-6 text-center">
            DevDen Administrator ✅
          </h1>
          <form>
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
                name="email"
                onChange={(e) => setEmail(e.target.value)}
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
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-gray-950 sm:text-sm"
              />
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
        </div>
      </div>
    </>
  );
};