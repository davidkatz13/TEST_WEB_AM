import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { BASE_URL } from "../apiService";

function SignUp() {
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const signUp = (event) => {
    event.preventDefault();
    let headers = new Headers();
    headers.append("accept", "application/json");
    headers.append("Content-Type", "application/json");
    let requestBody = {
      email: email,
      phone_number: phoneNumber,
      password: password,
    };

    console.log("requested!!!!");

    fetch(`${BASE_URL}/users/`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(requestBody),
    }).then((response) => {
      if (response.status === 200) {
        response.json().then((data) => {
          console.log(data);
        });
        navigate("/");
      } else {
        throw new Error("Can not sign up");
      }
    });
    // sign up logic backend
  };

  const disabilityCheck = () => {
    if (email !== "" && phoneNumber !== "" && password !== "") {
      return false;
    } else {
      return true;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-semibold text-white mb-6 text-center">
          Sign Up
        </h2>

        <form>
          <div className="space-y-6">
            <div className="w-full">
              <label
                htmlFor="email"
                className="block text-white font-medium mb-2"
              >
                Email
              </label>
              <input
                type="text"
                id="email"
                placeholder="Enter your email"
                className="w-full p-3 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="w-full">
              <label
                htmlFor="phoneNumber"
                className="block text-white font-medium mb-2"
              >
                Phone Number
              </label>
              <input
                type="text"
                id="phoneNumber"
                placeholder="Enter your phone number"
                className="w-full p-3 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <div className="w-full">
              <label
                htmlFor="password"
                className="block text-white font-medium mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                className="w-full p-3 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <button
              className={`bg-violet-500 hover:bg-violet-600 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400 ${
                disabilityCheck() ? "opacity-50 cursor-not-allowed" : ""
              }`}
              type="submit"
              onClick={signUp}
              disabled={disabilityCheck}
            >
              Sign Up
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Back to{" "}
            <Link
              to="/"
              className="text-violet-400 hover:text-violet-300 underline"
            >
              Login
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

export default SignUp;
