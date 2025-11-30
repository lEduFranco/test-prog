import { Job } from './job';
import { User } from './user';

export type ApplicationStatus = 'pending' | 'reviewing' | 'approved' | 'rejected';

export interface Application {
  id: string;
  job_id: string;
  candidate_id: string;
  status: ApplicationStatus;
  created_at: string;
  updated_at: string;
  job?: Job;
  candidate?: User;
}

export interface CreateApplicationRequest {
  job_id: string;
}

export interface UpdateApplicationStatusRequest {
  status: ApplicationStatus;
}
