import { api } from "@/config/api";
import Cookies from "js-cookie";

export default class AuthApi {
    static get(url: string) {
        return api.get(url, {
            headers: {
                Authorization: `Bearer ${Cookies.get('jwt')}`
            }
        });
    }

    static post(url: string, payload: any) {
        return api.post(url, payload, {
            headers: {
                Authorization: `Bearer ${Cookies.get('jwt')}`
            }
        })
    }
}