import axios, { AxiosInstance } from "axios";
import Cookies from "js-cookie";
const api: AxiosInstance = axios.create({
    baseURL: "http://localhost:3001"
})

export { api };