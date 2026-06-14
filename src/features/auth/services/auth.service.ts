import { api } from "../../../services/api.client";

export interface RegisterPayload {
    name : string,
    email : string,
    password : string
    role : 'admin' | 'user'
}
export interface Loginpayload {
    email : string,
    password : string
}

export const authService = {
    async register(data : RegisterPayload){
        const response = await api.post('/users/register',data)
        return response.data
    },
    async login(data : Loginpayload ){
       const response = await api.post('/users/login',data)
       return response.data
    }
}
