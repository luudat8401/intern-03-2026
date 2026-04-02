import axios from "./axiosClient";

export const getUsers = () => axios.get("/users");
export const createUser = (data) => axios.post("/users", data);
export const deleteUserApi = (id) => axios.delete(`/users/${id}`);
export const getUserById = (id) => axios.get(`/users/${id}`);
export const updateUserApi = (id, data) => axios.put(`/users/${id}`, data, {
  headers: { "Content-Type": "multipart/form-data" }
});