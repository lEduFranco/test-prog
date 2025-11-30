import React from 'react';
import { useLoaderData } from 'react-router-dom';
import { Navbar } from '@/components/common/Navbar';
import { ApplicationCard } from '@/components/applications/ApplicationCard';
import { Application } from '@/types/application';

export const MyApplications: React.FC = () => {
  const { applications } = useLoaderData() as { applications: Application[] };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/30">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Minhas Candidaturas
          </h1>
          <p className="mt-2 text-gray-600 flex items-center">
            <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {applications.length} candidatura{applications.length !== 1 ? 's' : ''}
          </p>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-md border border-gray-100">
            <div className="w-28 h-28 mx-auto mb-6 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 rounded-full flex items-center justify-center">
              <svg className="w-14 h-14 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-900 text-xl font-semibold mb-2">Nenhuma candidatura ainda</p>
            <p className="text-gray-500 mb-6">Explore vagas disponíveis e candidate-se às oportunidades que mais combinam com você!</p>
            <a
              href="/dashboard"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Buscar Vagas</span>
            </a>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {applications.map((application) => (
              <ApplicationCard key={application.id} application={application} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
