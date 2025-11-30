import React, { useState } from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Navbar } from '@/components/common/Navbar';
import { JobCard } from '@/components/jobs/JobCard';
import { jobService } from '@/services/job.service';
import { Job } from '@/types/job';

export const AdminDashboard: React.FC = () => {
  const { jobs: initialJobs } = useLoaderData() as { jobs: Job[] };
  
  const [jobs, setJobs] = useState<Job[]>(initialJobs);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja deletar esta vaga?')) {
      return;
    }

    const promise = jobService.delete(id);

    toast.promise(
      promise,
      {
        loading: 'Deletando vaga...',
        success: 'Vaga deletada com sucesso!',
        error: 'Falha ao deletar vaga',
      }
    );

    try {
      await promise;
      setJobs(jobs.filter((job) => job.id !== id));
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/30">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Minhas Vagas
            </h1>
            <p className="mt-2 text-gray-600 flex items-center">
              <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {jobs.length} vaga{jobs.length !== 1 ? 's' : ''} criada{jobs.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Link
            to="/admin/jobs/new"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Nova Vaga</span>
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-md border border-gray-100">
            <div className="w-28 h-28 mx-auto mb-6 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 rounded-full flex items-center justify-center">
              <svg className="w-14 h-14 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-gray-900 text-xl font-semibold mb-2">Nenhuma vaga criada ainda</p>
            <p className="text-gray-500 mb-6">Comece criando sua primeira vaga para atrair candidatos</p>
            <Link
              to="/admin/jobs/new"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Criar Primeira Vaga</span>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} showActions onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
