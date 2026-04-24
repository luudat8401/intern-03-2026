import axiosClient from "../api/axiosClient";

export async function login(username, password, role) {
  const response = await axiosClient.post("/auth/login", {
    username,
    password,
    role
  });
  return response.data;
}
export async function register(username, password, role, name, phone, email) {
  const response = await axiosClient.post("/auth/register", {
    username,
    password,
    role,
    name,
    phone,
    email
  });
  return response.data;
}



export async function loginWithGoogle(credential, role = "user") {
  const response = await axiosClient.post("/auth/google", {
    credential,
    role
  });
  return response.data;
}

export async function logoutUser() {
  const response = await axiosClient.post("/auth/logout");
  return response.data;
}