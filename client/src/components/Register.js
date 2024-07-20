import React, { useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

// Fonction de validation des formulaires
const validate = (values) => {
  const errors = {};
  if (!values.email) {
    errors.email = "Required";
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = "Invalid email address";
  }
  if (!values.username) {
    errors.username = "Required";
  }
  if (!values.password) {
    errors.password = "Required";
  }
  return errors;
};

export default function Register() {
  const [error, setError] = useState(null);

  // Utilisation de Formik pour la gestion du formulaire
  const formik = useFormik({
    initialValues: {
      email: "",
      username: "",
      password: "",
    },
    validate,
    onSubmit: async (values) => {
      try {
        // Appel de l'API pour l'enregistrement de l'utilisateur
        const response = await axios.post(
          "http://localhost:8000/api/register",
          values
        );
        toast.success("Registration successful!");
        console.log(response.data);
      } catch (err) {
        // Gestion des erreurs
        if (err.response) {
          setError({
            message: err.response.data.message || "An error occurred",
          });
        } else if (err.request) {
          setError({ message: "No response from server" });
        } else {
          setError({ message: err.message });
        }
        toast.error("Registration failed.");
      }
    },
  });

  return (
    <div className="container mx-auto py-10">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-purple-600">Register</h2>
          <form onSubmit={formik.handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                {...formik.getFieldProps("email")}
              />
              {formik.errors.email ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.email}
                </div>
              ) : null}
            </div>

            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-700">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                {...formik.getFieldProps("username")}
              />
              {formik.errors.username ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.username}
                </div>
              ) : null}
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                {...formik.getFieldProps("password")}
              />
              {formik.errors.password ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.password}
                </div>
              ) : null}
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Register
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error.message}
            </div>
          )}

          <div className="mt-4 text-center">
            <span className="text-gray-500">
              Already registered?{" "}
              <a href="/" className="text-purple-600 hover:underline">
                Login now
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
