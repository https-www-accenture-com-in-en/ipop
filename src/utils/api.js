import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/v1/api/admin", // base path
  headers: {
    "Content-Type": "application/json",
  },
});

export const apiGet = async (endpoint) => {
  const res = await axiosInstance.get(endpoint);
  console.log(res.data)
  return res.data;
};

export const apiPost = async (endpoint, data) => {
  const res = await axiosInstance.post(endpoint, data);
  return res.data;
};

export const apiPut = async (endpoint, data) => {
  const res = await axiosInstance.put(endpoint, data);
  return res.data;
};

export const apiDelete = async (endpoint) => {
  const res = await axiosInstance.delete(endpoint);
  return res.data;
};
