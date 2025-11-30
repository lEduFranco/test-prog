import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Job } from '@/types/job';
import { formatCurrency, formatDate, getJobTypeLabel, getJobStatusLabel } from '@/utils/format';

interface JobCardProps {
  job: Job;
  showActions?: boolean;
  onDelete?: (id: string) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, showActions = false, onDelete }) => {
  const navigate = useNavigate();

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button, a[href*="edit"], a[href*="applications"]')) {
      return;
    }
    navigate(`/jobs/${job.id}`);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="relative bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-indigo-200 cursor-pointer group hover:scale-[1.01] overflow-hidden"
    >
      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
        <svg className="w-6 h-6 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </div>
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
            {job.title}
          </h3>
          <p className="text-sm text-gray-500 mt-1 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {job.location}
          </p>
        </div>
        <div className="flex flex-col items-end space-y-1">
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700">
            {getJobTypeLabel(job.type)}
          </span>
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full ${
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

      <p className="text-gray-700 mb-4 line-clamp-3">{job.description}</p>

      <div className="flex justify-between items-center">
        <div className="flex flex-col space-y-1">
          {job.salary && (
            <span className="text-lg font-semibold text-green-600">
              {formatCurrency(job.salary)}
            </span>
          )}
          <span className="text-sm text-gray-500">Publicada em {formatDate(job.created_at)}</span>
        </div>

        {showActions && (
          <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
            <Link
              to={`/admin/jobs/${job.id}/edit`}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 text-sm font-medium transition-all transform hover:scale-105 shadow-md"
              onClick={(e) => e.stopPropagation()}
            >
              Editar
            </Link>
            <Link
              to={`/admin/jobs/${job.id}/applications`}
              className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 text-sm font-medium transition-all transform hover:scale-105 shadow-md"
              onClick={(e) => e.stopPropagation()}
            >
              Candidatos
            </Link>
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(job.id);
                }}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:from-red-700 hover:to-pink-700 text-sm font-medium transition-all transform hover:scale-105 shadow-md"
              >
                Deletar
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
