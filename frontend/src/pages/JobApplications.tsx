import React, { useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Navbar } from '@/components/common/Navbar';
import { applicationService } from '@/services/application.service';
import { Application, ApplicationStatus } from '@/types/application';
import { Job } from '@/types/job';
import {
  formatDate,
  getApplicationStatusLabel,
  getApplicationStatusColor,
} from '@/utils/format';

export const JobApplications: React.FC = () => {
  const { job, applications: initialApplications } = useLoaderData() as {
    job: Job;
    applications: Application[];
  };
  const navigate = useNavigate();

  const [applications, setApplications] = useState<Application[]>(initialApplications);

  const handleStatusChange = async (applicationId: string, newStatus: ApplicationStatus) => {
    const promise = applicationService.updateStatus(applicationId, { status: newStatus });

    toast.promise(
      promise,
      {
        loading: 'Atualizando status...',
        success: `Status atualizado para: ${getApplicationStatusLabel(newStatus)}`,
        error: 'Falha ao atualizar status',
      }
    );

    try {
      await promise;
      setApplications(
        applications.map((app) =>
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      );
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="mb-6 text-blue-600 hover:text-blue-800 flex items-center space-x-2 font-medium transition-colors group"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Voltar para Minhas Vagas</span>
        </button>

        {job && (
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h1>
            <p className="text-gray-600">{job.location}</p>
          </div>
        )}

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              Candidatos ({applications.length})
            </h2>
          </div>

          {applications.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Nenhum candidato ainda</p>
              <p className="text-gray-400 mt-2">
                Quando alguém se candidatar, aparecerá aqui
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Candidato
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data da Candidatura
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {applications.map((application) => (
                    <tr key={application.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {application.candidate?.email || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {formatDate(application.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getApplicationStatusColor(
                            application.status
                          )}`}
                        >
                          {getApplicationStatusLabel(application.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <select
                          value={application.status}
                          onChange={(e) =>
                            handleStatusChange(application.id, e.target.value as ApplicationStatus)
                          }
                          className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="pending">Pendente</option>
                          <option value="reviewing">Em Análise</option>
                          <option value="approved">Aprovado</option>
                          <option value="rejected">Rejeitado</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
