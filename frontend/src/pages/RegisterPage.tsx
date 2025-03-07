import React, { useState } from "react";
import { toast } from "react-toastify";

import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const RegisterPage = () => {
  const [name, setname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await axiosInstance
        .post("/api/users/registration", {
          name,
          email,
          password,
        })
        .then((res) => {
          toast.success("success!");
          navigate("/");
          localStorage.setItem("access_token", res.data.accessToken);
          console.log(res);
        })
        .catch((error) => {
          toast.error(error?.response?.data?.message);
          console.error("Error:", error);
        });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="w-full h-[100vh] flex justify-center items-center">
      <div className="flex flex-col justify-center items-center w-full h-[70%] gap-16">
        <div className="flex flex-col justify-center items-center gap-4">
          <h1 className="text-2xl font-bold">Register Page</h1>
          <p className="text-gray-600">This is the registration page.</p>
        </div>
        <div className="w-[80%] md:w-[40%] mx-auto h-auto bg-white shadow rounded-2xl">
          <form
            className="flex w-full flex-col gap-4 p-4 justify-center items-center"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col gap-2 w-full justify-center items-center">
              <label htmlFor="name" className="text-gray-500 text-md">
                User Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setname(e.target.value)}
                className="w-[80%] md:w-[65%] p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-600 focus:ring-blue-600"
              />
            </div>
            <div className="flex flex-col gap-2 w-full justify-center items-center">
              <label htmlFor="email" className="text-gray-500 text-md">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-[80%] md:w-[65%] p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-600 focus:ring-blue-600"
              />
            </div>
            <div className="flex flex-col gap-2 w-full justify-center items-center">
              <label htmlFor="password" className="text-gray-500 text-md">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-[80%] md:w-[65%] p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-600 focus:ring-blue-600"
              />
            </div>
            <button
              type="submit"
              className="p-3 w-[30%] mx-auto text-white rounded bg-gradient-to-r from-blue-600 to-purple-500"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
