import { Link } from "react-router-dom";

const Page404 = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-800 animate-bounce">404</h1>
        <p className="text-2xl font-semibold text-gray-600 mt-4 animate-fadeIn">
          Oops! Page not found.
        </p>
        <p className="text-md text-gray-500 mt-2 animate-fadeIn animation-delay-200">
          The page you are looking for does not exist.
        </p>{" "}
        <br />
        <Link
          to="/home"
          className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-md text-lg font-medium hover:bg-blue-500 transition-all duration-300 ease-in-out animate-fadeIn animation-delay-400"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default Page404;