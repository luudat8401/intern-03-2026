import axios from "./axiosClient";

export const getRooms = (params) => axios.get("/rooms", { params });
export const getRoomById = (id) => axios.get(`/rooms/${id}`);
export const getRandomRooms = (params) => axios.get("/rooms/random", { params });
export const getRoomsByMaster = (masterId, params) => axios.get(`/rooms/master/${masterId}`, { params });
export const createRoom = (formData) => axios.post("/rooms", formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateRoomApi = (id, formData) => axios.put(`/rooms/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});

export const deleteRoomApi = (id) => axios.delete(`/rooms/${id}`);
