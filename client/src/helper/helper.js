import axios from "axios";
import jwt_decode from "jwt-decode";

axios.defaults.baseURL = "http://localhost:8000";

/** Make API Requests */

/** To get username from Token */
export async function getUsername() {
  const token = localStorage.getItem("token");
  if (!token) return Promise.reject("Cannot find Token");
  try {
    let decode = jwt_decode(token);
    return Promise.resolve(decode);
  } catch (error) {
    return Promise.reject("Invalid Token");
  }
}

/** Authenticate function */
export async function authenticate(username) {
  try {
    const response = await axios.post("/api/authenticate", { username });
    return Promise.resolve(response.data);
  } catch (error) {
    console.error("API call error:", error);
    return Promise.reject({
      error: error.response?.data?.error || "Username doesn't exist...!",
    });
  }
}

/** Get User details */
export async function getUser({ username }) {
  try {
    const { data } = await axios.get(`/api/user/${username}`);
    return Promise.resolve({ data });
  } catch (error) {
    return Promise.reject({ error: "User details could not be fetched...!" });
  }
}

/** Register user function */
export async function registerUser(userData) {
  try {
    const { data } = await axios.post("/api/register", userData);
    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject({
      error: error.response?.data?.error || "Registration failed",
    });
  }
}

/** Verify password function */
export async function verifyPassword({ username, password }) {
  try {
    const { data } = await axios.post("/api/login", { username, password });
    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject({ error: "Password doesn't match...!" });
  }
}

/** Update user profile function */
export async function updateUser(response) {
  try {
    const token = localStorage.getItem("token");
    const { data } = await axios.put("/api/updateuser", response, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject({ error: "Couldn't update profile...!" });
  }
}

export async function addNote(response) {
  try {
    const { data } = await axios.post("/api/addNote", response);
    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject({
      error: error.response?.data?.error || "Couldn't add note...!",
    });
  }
}

/** Generate OTP function */
export async function generateOTP(username) {
  try {
    const { data, status } = await axios.get("/api/generateOTP", {
      params: { username },
    });

    // Send mail with the OTP
    if (status === 201) {
      const { data: user } = await getUser({ username });
      const text = `Your Password Recovery OTP is ${data.code}. Verify and recover your password.`;
      await axios.post("/api/registerMail", {
        username,
        userEmail: user.email,
        text,
        subject: "Password Recovery OTP",
      });
    }
    return Promise.resolve(data.code);
  } catch (error) {
    return Promise.reject({
      error: error.response?.data?.error || "Failed to generate OTP",
    });
  }
}

/** Verify OTP function */
export async function verifyOTP({ username, code }) {
  try {
    const { data, status } = await axios.get("/api/verifyOTP", {
      params: { username, code },
    });
    return Promise.resolve({ data, status });
  } catch (error) {
    return Promise.reject({
      error: error.response?.data?.error || "OTP verification failed",
    });
  }
}

/** Reset password function */
export async function resetPassword({ username, password }) {
  try {
    const { data, status } = await axios.put("/api/resetPassword", {
      username,
      password,
    });
    return Promise.resolve({ data, status });
  } catch (error) {
    return Promise.reject({
      error: error.response?.data?.error || "Password reset failed",
    });
  }
}
