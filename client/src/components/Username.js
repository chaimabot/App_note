import React from "react";
import { Link, useNavigate } from "react-router-dom";
import avatar from "../assets/profile.png";
import toast, { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import axios from "axios";

export default function Username() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        const response = await axios.post(
          "http://localhost:8000/api/login",
          values,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.userExists) {
          navigate("/home");
          toast.success("Login successful!");
        } else {
          toast.error(response.data.error || "User does not exist!");
        }
      } catch (error) {
        console.error("Error during authentication:", error);
        toast.error("Error during authentication!");
      }
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-purple-100">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <div className="flex flex-col items-center mb-6">
          <img src={avatar} className="w-24 h-24 rounded-full" alt="avatar" />
          <h2 className="text-3xl font-semibold text-purple-700 mt-4">
            Welcome Back!
          </h2>
          <p className="text-gray-500">Log in to your account to continue.</p>
        </div>

        <form className="space-y-6" onSubmit={formik.handleSubmit}>
          <div>
            <label className="block text-gray-600 mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              {...formik.getFieldProps("email")}
              className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
                formik.errors.email && formik.touched.email
                  ? "border-purple-500 ring-purple-500"
                  : "border-gray-300 ring-gray-300"
              }`}
              type="email"
              id="email"
              placeholder="you@example.com"
            />
            {formik.errors.email && formik.touched.email && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.email}
              </div>
            )}
          </div>

          <div>
            <label className="block text-gray-600 mb-2" htmlFor="password">
              Password
            </label>
            <input
              {...formik.getFieldProps("password")}
              className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
                formik.errors.password && formik.touched.password
                  ? "border-purple-500 ring-purple-500"
                  : "border-gray-300 ring-gray-300"
              }`}
              type="password"
              id="password"
              placeholder="********"
            />
            {formik.errors.password && formik.touched.password && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.password}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-purple-600 text-white font-semibold rounded-lg shadow-lg hover:bg-purple-700 transition duration-200"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-500">
            Not a member?{" "}
            <Link to="/register" className="text-purple-600 hover:underline">
              Register Now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
