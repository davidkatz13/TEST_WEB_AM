import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../apiService";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    let headers = new Headers();
    headers.append("accept", "application/json");
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    let formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);

    fetch(`${BASE_URL}/users/login`, {
      method: "POST",
      headers: headers,
      body: formData.toString(),
    }).then((response) => {
      if (response.status === 200) {
        response.json().then((data) => {
          console.log(data);
          // save it to localStorage (better to make zustand and save it in a state for a bigger app)
          localStorage.setItem("email", data.email);
          localStorage.setItem("tokenType", data.tokenType);
          localStorage.setItem("accessToken", data.accessToken);
          navigate("/asset_overview");
        });
      } else {
        // need to better handle errors (displaying it visually to ui, what is going wrong!)
        throw new Error("Can not login");
      }
    });
  };

  const disabilityCheck = () => {
    if (email !== "" && password !== "") {
      return false;
    } else {
      return true;
    }
  };

  useEffect(() => {
    disabilityCheck();
  }, [email, password]);


  console.log(process.env.REACT_APP_API_URL);
  console.log(BASE_URL);


  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-semibold text-white mb-6 text-center">
          Login
        </h2>

        <form>
          <div className="space-y-6">
            <div className="w-full">
              <label
                className="block text-white font-medium mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="w-full p-3 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500"
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="w-full">
              <label
                className="block text-white font-medium mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="w-full p-3 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500"
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex justify-between items-center text-gray-400">
              <Link to="/signup" className="underline hover:text-violet-300">
                First time, sign on
              </Link>
              <button
                className={`bg-violet-500 hover:bg-violet-600 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400 ${
                  disabilityCheck() ? "opacity-50 cursor-not-allowed" : ""
                }`}
                type="submit"
                onClick={handleSubmit}
                disabled={disabilityCheck()}
              >
                Login
              </button>
            </div>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-violet-400 hover:text-violet-300 underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>

      <footer className="bg-gray-800 text-gray-400 text-center py-4 mt-8 w-full border-t border-gray-700">
        &copy; {new Date().getFullYear()} MyApp. All rights reserved.
      </footer>
    </div>
  );
}

export default Login;
