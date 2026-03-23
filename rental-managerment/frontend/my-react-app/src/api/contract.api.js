import axios from "./axiosClient";

export const getContracts = () => axios.get("/contracts");
export const createContract = (data) => axios.post("/contracts", data);
export const updateContractApi = (id, data) => axios.put(`/contracts/${id}`, data);
export const deleteContractApi = (id) => axios.delete(`/contracts/${id}`);
