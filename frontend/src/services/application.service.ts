import { api } from './api';
import {
  Application,
  CreateApplicationRequest,
  UpdateApplicationStatusRequest,
} from '@/types/application';

export const applicationService = {
  async create(data: CreateApplicationRequest): Promise<Application> {
    const response = await api.post<Application>('/applications', data);
    return response.data;
  },

  async getMyApplications(): Promise<Application[]> {
    const response = await api.get<Application[]>('/applications/my-applications');
    return response.data;
  },

  async getJobApplications(jobId: string): Promise<Application[]> {
    const response = await api.get<Application[]>(`/jobs/${jobId}/applications`);
    return response.data;
  },

  async updateStatus(
    id: string,
    data: UpdateApplicationStatusRequest
  ): Promise<Application> {
    const response = await api.put<Application>(`/applications/${id}`, data);
    return response.data;
  },
};
