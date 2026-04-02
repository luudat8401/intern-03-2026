import axiosClient from "./axiosClient";

export const loginApi = (data) => axiosClient.post("/auth/login", data);
export const registerApi = (data) => axiosClient.post("/auth/register", data);
export const googleLoginApi = (data) => axiosClient.post("/auth/google", data);
export const changePasswordApi = (data) => axiosClient.post("/auth/change-password", data);
