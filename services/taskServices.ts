import axiosInstance from "@/lib/interceptor";

import ApiConfig from "./../lib/apiConfig";

interface createTaskPayload {
  title: string;
  dueDate?: Date;
  description?: string;
  priority?: string;
}

interface updateTaskPayload {
  title?: string;
  dueDate?: Date;
  description?: string;
  priority?: string;
}

class TaskServices {
  createTask(payload: createTaskPayload) {
    return axiosInstance.post(ApiConfig.TaskOperations, payload);
  }

  getMyAllTasks() {
    return axiosInstance.get(ApiConfig.TaskOperations);
  }

  updateTask({ payload, id }: { payload: updateTaskPayload; id: string }) {
    return axiosInstance.patch(`${ApiConfig.TaskOperations}/${id}`, payload);
  }
}

export default new TaskServices();

