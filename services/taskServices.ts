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
  completed?: boolean;
}

class TaskServices {
  createTask(payload: createTaskPayload) {
    return axiosInstance.post(ApiConfig.TaskOperations, payload);
  }

  getMyAllTasks() {
    return axiosInstance.get(ApiConfig.TaskOperations);
  }

  updateTask({ id, payload }: { id: string; payload: updateTaskPayload }) {
    return axiosInstance.patch(`${ApiConfig.TaskOperations}/${id}`, payload);
  }

  deleteTask({ id }: { id: string }) {
    return axiosInstance.delete(`${ApiConfig.TaskOperations}/${id}`);
  }

  updateOrderListing(payload: any) {
    return axiosInstance.patch(`${ApiConfig.TaskOperations}/order`, payload);
  }
}

export default new TaskServices();
