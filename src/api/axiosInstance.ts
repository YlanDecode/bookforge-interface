import axios from "axios";

const axiosInstance = axios.create({
    baseURL: `http://77.37.124.223:8000/api/ebooks`,
    withCredentials: true,
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("Response Error:", error.response?.status, error.response?.data);
        return Promise.reject(error);
    }
);

export { axiosInstance };