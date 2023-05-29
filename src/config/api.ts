import axios, { AxiosInstance } from "axios";
import BASE_URL from "./baseUrl";

const api: AxiosInstance = axios.create({
    baseURL: BASE_URL
})

export { api };