import { LoaderFunctionArgs } from 'react-router-dom';
import { jobService } from '@/services/job.service';
import { applicationService } from '@/services/application.service';

export async function candidateDashboardLoader() {
  try {
    const response = await jobService.list({ status: 'open' });
    return response;
  } catch (error) {
    console.error('Failed to load jobs:', error);
    return { jobs: [], total: 0 };
  }
}

export async function adminDashboardLoader() {
  try {
    const jobs = await jobService.getMyJobs();
    return { jobs };
  } catch (error) {
    console.error('Failed to load my jobs:', error);
    return { jobs: [] };
  }
}

export async function jobDetailsLoader({ params }: LoaderFunctionArgs) {
  const { id } = params;
  if (!id) {
    throw new Error('Job ID is required');
  }

  try {
    const job = await jobService.getById(id);
    return { job };
  } catch (error) {
    console.error('Failed to load job:', error);
    throw error;
  }
}

export async function myApplicationsLoader() {
  try {
    const applications = await applicationService.getMyApplications();
    return { applications };
  } catch (error) {
    console.error('Failed to load applications:', error);
    return { applications: [] };
  }
}

export async function jobApplicationsLoader({ params }: LoaderFunctionArgs) {
  const { id } = params;
  if (!id) {
    throw new Error('Job ID is required');
  }

  try {
    const [job, applications] = await Promise.all([
      jobService.getById(id),
      applicationService.getJobApplications(id),
    ]);

    return { job, applications };
  } catch (error) {
    console.error('Failed to load job applications:', error);
    throw error;
  }
}

export async function jobFormLoader({ params }: LoaderFunctionArgs) {
  const { id } = params;
  
  if (!id) {
    return { job: null };
  }

  try {
    const job = await jobService.getById(id);
    return { job };
  } catch (error) {
    console.error('Failed to load job for edit:', error);
    throw error;
  }
}

