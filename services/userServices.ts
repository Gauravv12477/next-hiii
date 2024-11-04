import axiosInstance from "@/lib/interceptor";
import ApiConfig from './../lib/apiConfig';


interface singupPayload {
    firstname: string,
    lastname: string,
    email: string,
}

interface loginPayload{
    email: string,
    password: string
}



class UserServices {
    signup(singupPayload) {
        return axiosInstance.post(ApiConfig.signup, singupPayload);
    }
    login(payload){
        return axiosInstance.post(ApiConfig.login, payload);
    }
}
