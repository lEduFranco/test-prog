import { api } from './api';
import {
  Job,
  CreateJobRequest,
  UpdateJobRequest,
  JobFilters,
  JobListResponse,
} from '@/types/job';

export const jobService = {
  async list(filters?: JobFilters): Promise<JobListResponse> {
    const params = new URLSearchParams();

    if (filters?.search) params.append('search', filters.search);
    if (filters?.location) params.append('location', filters.location);
    if (filters?.type) params.append('type', filters.type);
    if (filters?.salary_min) params.append('salary_min', filters.salary_min.toString());
    if (filters?.salary_max) params.append('salary_max', filters.salary_max.toString());
    if (filters?.status) params.append('status', filters.status);
    if (filters?.sort_by) params.append('sort_by', filters.sort_by);
    if (filters?.order) params.append('order', filters.order);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const response = await api.get<JobListResponse>(`/jobs?${params.toString()}`);
    return response.data;
  },

  async getById(id: string): Promise<Job> {
    const response = await api.get<Job>(`/jobs/${id}`);
    return response.data;
  },

  async create(data: CreateJobRequest): Promise<Job> {
    const response = await api.post<Job>('/jobs', data);
    return response.data;
  },

  async update(id: string, data: UpdateJobRequest): Promise<Job> {
    const response = await api.put<Job>(`/jobs/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/jobs/${id}`);
  },

  async getMyJobs(): Promise<Job[]> {
    const response = await api.get<Job[]>('/jobs/my-jobs');
    return response.data;
  },
};
