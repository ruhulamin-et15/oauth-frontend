"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // For redirecting after successful login
import { jwtDecode } from "jwt-decode";
import { Facebook } from "lucide-react";
import Image from "next/image";

interface User {
  displayName: string;
  email: string;
  photo: string;
}

const Home = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter(); // Router instance for redirection

  useEffect(() => {
    // Check URL params for accessToken or fallback to localStorage
    const urlParams = new URLSearchParams(window.location.search);
    let accessToken = urlParams.get("accessToken");

    if (accessToken) {
      // Store accessToken in localStorage if it's from URL
      localStorage.setItem("accessToken", accessToken);
    } else {
      // If no accessToken in URL, retrieve from localStorage
      accessToken = localStorage.getItem("accessToken");
    }

    if (accessToken) {
      try {
        // Decode accessToken to extract user information
        const decodedUser = jwtDecode<User>(accessToken);
        setUser(decodedUser); // Set the user data in state
        router.push("/"); // Redirect to homepage or another page after successful login
      } catch (error) {
        console.error("Invalid accessToken", error);
        localStorage.removeItem("accessToken"); // Remove invalid accessToken
        router.push("/"); // Redirect to login if accessToken is invalid
      }
    } else {
      router.push("/"); // Redirect to login if no accessToken found
    }
  }, [router]);

  const handleGoogleLogin = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    // Redirect to the backend to handle Google login
    window.location.href =
      "https://fuad-harzallah.code-commando.com/auth/google";
  };

  const handleFacebookLogin = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    window.location.href = "http://localhost:3001/auth/facebook";
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  return (
    <>
      {!user ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
              Login with
            </h2>
            <div className="space-y-4">
              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center px-4 py-2 space-x-2 transition-colors duration-300 border border-gray-300 rounded-md group hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <span>
                  <svg
                    className="w-5 h-5 text-gray-700 fill-current group-hover:text-gray-900"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" />
                  </svg>
                </span>
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  Sign in with Google
                </span>
              </button>

              <button
                className="w-full bg-[#1877F2] hover:bg-[#166FE5] text-white font-semibold py-2 px-4 rounded-md flex items-center justify-center transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1877F2]"
                onClick={handleFacebookLogin}
                type="button"
              >
                <Facebook className="w-5 h-5 mr-2" />
                Log in with Facebook
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Dont have an account?{" "}
                <a
                  href="#"
                  className="font-medium text-blue-600 hover:underline"
                >
                  Sign up
                </a>
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="text-center p-6 bg-gray-800 text-white">
              <Image
                className="h-32 w-32 rounded-full mx-auto"
                height={40}
                width={40}
                src={user.photo || "/default-avatar.png"}
                alt="User avatar"
              />
              <h1 className="text-2xl font-semibold mt-4">
                {user.displayName}
              </h1>
              <p className="text-sm">Full stack Developer</p>
            </div>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <span className="text-gray-700">{user.email}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center my-10">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default Home;
