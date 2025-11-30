import React from 'react';
import { Link } from 'react-router-dom';
import { Application } from '@/types/application';
import {
  formatDate,
  getApplicationStatusLabel,
  getApplicationStatusColor,
  formatCurrency,
} from '@/utils/format';

interface ApplicationCardProps {
  application: Application;
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({ application }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <Link
            to={`/jobs/${application.job_id}`}
            className="text-xl font-semibold text-gray-900 hover:text-blue-600"
          >
            {application.job?.title || 'Vaga não disponível'}
          </Link>
          <p className="text-sm text-gray-500 mt-1">{application.job?.location}</p>
        </div>
        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getApplicationStatusColor(application.status)}`}>
          {getApplicationStatusLabel(application.status)}
        </span>
      </div>

      {application.job && (
        <>
          <p className="text-gray-700 mb-4 line-clamp-2">{application.job.description}</p>

          <div className="flex justify-between items-center text-sm">
            <div className="flex flex-col space-y-1">
              {application.job.salary && (
                <span className="font-semibold text-green-600">
                  {formatCurrency(application.job.salary)}
                </span>
              )}
              <span className="text-gray-500">
                Candidatura em {formatDate(application.created_at)}
              </span>
            </div>
            <Link
              to={`/jobs/${application.job_id}`}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Ver Detalhes
            </Link>
          </div>
        </>
      )}
    </div>
  );
};
