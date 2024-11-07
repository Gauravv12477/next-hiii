import axiosInstance from "@/lib/interceptor";

import ApiConfig from './../lib/apiConfig';



interface createTaskPayload {

}

class TaskServices {
    createTask(payload: createTaskPayload) {
        return axiosInstance.post(ApiConfig.TaskOperations);
    }

    // updateTask()
}