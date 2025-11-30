import { User } from './user';

export type JobType = 'remote' | 'onsite' | 'hybrid';
export type JobStatus = 'open' | 'closed' | 'archived';

export interface Job {
  id: string;
  recruiter_id: string;
  title: string;
  description: string;
  salary?: number;
  location: string;
  type: JobType;
  status: JobStatus;
  created_at: string;
  updated_at: string;
  recruiter?: User;
}

export interface CreateJobRequest {
  title: string;
  description: string;
  salary?: number;
  location: string;
  type: JobType;
}

export interface UpdateJobRequest {
  title?: string;
  description?: string;
  salary?: number;
  location?: string;
  type?: JobType;
  status?: JobStatus;
}

export interface JobFilters {
  search?: string;
  location?: string;
  type?: JobType;
  salary_min?: number;
  salary_max?: number;
  status?: JobStatus;
  sort_by?: string;
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface JobListResponse {
  jobs: Job[];
  total: number;
  page: number;
  limit: number;
}
