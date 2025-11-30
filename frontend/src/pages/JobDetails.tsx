import React, { useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Navbar } from '@/components/common/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { applicationService } from '@/services/application.service';
import { Job } from '@/types/job';
import { formatCurrency, formatDate, getJobTypeLabel, getJobStatusLabel } from '@/utils/format';

export const JobDetails: React.FC = () => {
  const { job } = useLoaderData() as { job: Job };
  const navigate = useNavigate();
  const { isCandidate } = useAuth();

  const [applying, setApplying] = useState(false);

  const handleApply = async () => {
    setApplying(true);

    const promise = applicationService.create({ job_id: job.id });

    toast.promise(
      promise,
      {
        loading: 'Enviando candidatura...',
        success: 'Candidatura enviada com sucesso! Redirecionando...',
        error: (err) => err.response?.data?.error || 'Falha ao enviar candidatura',
      }
    );

    try {
      await promise;
      setTimeout(() => navigate('/applications'), 1500);
    } catch (err) {
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/30">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-indigo-600 hover:text-indigo-800 flex items-center space-x-2 font-medium transition-colors group"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Voltar</span>
        </button>

        <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-100">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
              <p className="text-lg text-gray-600">{job.location}</p>
            </div>
            <div className="flex flex-col space-y-2">
              <span className="px-4 py-2 text-sm font-medium rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700">
                {getJobTypeLabel(job.type)}
              </span>
              <span
                className={`px-4 py-2 text-sm font-medium rounded-full text-center ${
                  job.status === 'open'
                    ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700'
                    : job.status === 'closed'
                    ? 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {getJobStatusLabel(job.status)}
              </span>
            </div>
          </div>

          {job.salary && (
            <div className="mb-6">
              <p className="text-2xl font-bold text-green-600">{formatCurrency(job.salary)}</p>
            </div>
          )}

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Descrição da Vaga</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
          </div>

          <div className="border-t pt-6 mb-6">
            <p className="text-sm text-gray-500">Publicada em {formatDate(job.created_at)}</p>
            {job.recruiter && (
              <p className="text-sm text-gray-500 mt-1">
                Por: {job.recruiter.email}
              </p>
            )}
          </div>

          {isCandidate && job.status === 'open' && (
            <button
              onClick={handleApply}
              disabled={applying}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg flex items-center justify-center space-x-2"
            >
              {applying ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Enviando candidatura...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Candidatar-se a esta vaga</span>
                </>
              )}
            </button>
          )}

          {isCandidate && job.status !== 'open' && (
            <div className="text-center py-6 bg-gray-100 rounded-lg border border-gray-300 flex flex-col items-center space-y-2">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <p className="text-gray-700 font-medium">Esta vaga não está aceitando candidaturas</p>
              <p className="text-sm text-gray-500">Status: {getJobStatusLabel(job.status)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
