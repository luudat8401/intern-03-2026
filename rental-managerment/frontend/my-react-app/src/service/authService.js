import axiosClient from "../api/axiosClient";

export async function login(username, password) {
  const response = await axiosClient.post("/auth/login", {
    username,
    password
  });
  return response.data;
}
export async function register(username, password, role) {
  const response = await axiosClient.post("/auth/register", {
    username,
    password,
    role
  });
  return response.data;
}