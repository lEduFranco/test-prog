import React, { useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import { Navbar } from '@/components/common/Navbar';
import { Loader } from '@/components/common/Loader';
import { JobCard } from '@/components/jobs/JobCard';
import { JobFilters } from '@/components/jobs/JobFilters';
import { jobService } from '@/services/job.service';
import { Job, JobFilters as JobFiltersType } from '@/types/job';

export const CandidateDashboard: React.FC = () => {
  const initialData = useLoaderData() as { jobs: Job[]; total: number };
  
  const [jobs, setJobs] = useState<Job[]>(initialData.jobs);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(initialData.total);
  const [error, setError] = useState('');

  const loadJobs = async (filters: JobFiltersType) => {
    setLoading(true);
    setError('');

    try {
      const response = await jobService.list(filters);
      setJobs(response.jobs);
      setTotal(response.total);
    } catch (err: any) {
      setError('Falha ao carregar vagas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/30">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Buscar Vagas
          </h1>
          <p className="mt-2 text-gray-600 flex items-center">
            <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {total} vaga{total !== 1 ? 's' : ''} disponível{total !== 1 ? 'eis' : ''}
          </p>
        </div>

        <JobFilters onFilter={loadJobs} />

        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-6">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {loading ? (
          <Loader />
        ) : jobs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-md border border-gray-100">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-gray-900 text-lg font-semibold mb-2">Nenhuma vaga encontrada</p>
            <p className="text-gray-500">Tente ajustar os filtros de busca para encontrar mais oportunidades</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
