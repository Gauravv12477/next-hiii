import axiosInstance from "@/lib/interceptor";
import ApiConfig from './../lib/apiConfig';

interface SignupPayload {
  firstname: string;
  lastname: string;
  email: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

class UserServices {
  signup(payload: SignupPayload) {
    return axiosInstance.post(ApiConfig.signup, payload);
  }

  login(payload: LoginPayload) {
    return axiosInstance.post(ApiConfig.login, payload);
  }

  logout() {
    return axiosInstance.post(ApiConfig.logout);
  }
}

export default new UserServices();
 