import axios from "./axiosClient";

export const getMasters = () => axios.get("/masters")
export const createMaster = (data) => axios.post("/masters", data)
export const deleteMaster = (id) => axios.delete(`/masters/${id}`)
export const updateMasterApi = (id, data) => axios.put(`/masters/${id}`, data);
export const getMasterById = (id) => axios.get(`/masters/${id}`);
export const getMaster = (data) => axios.post(`/masters/get`, data);