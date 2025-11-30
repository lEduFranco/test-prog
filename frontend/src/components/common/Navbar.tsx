import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const Navbar: React.FC = () => {
  const { user, logout, isAdmin, isCandidate } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'bg-white/20 text-white backdrop-blur-sm'
        : 'text-white/90 hover:bg-white/10 hover:text-white'
    }`;

  return (
    <nav className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to={isAdmin ? '/admin/dashboard' : '/dashboard'} className="flex items-center space-x-2">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-xl font-bold">Recrutamento & Seleção</span>
            </Link>
          </div>

          <div className="flex items-center space-x-1">
            {isAdmin && (
              <>
                <NavLink to="/admin/dashboard" className={navLinkClass}>
                  Minhas Vagas
                </NavLink>
                <NavLink to="/admin/jobs/new" className={navLinkClass}>
                  + Nova Vaga
                </NavLink>
              </>
            )}

            {isCandidate && (
              <>
                <NavLink to="/dashboard" className={navLinkClass}>
                  Buscar Vagas
                </NavLink>
                <NavLink to="/applications" className={navLinkClass}>
                  Minhas Candidaturas
                </NavLink>
              </>
            )}

            <div className="flex items-center space-x-3 ml-6 pl-6 border-l border-white/20">
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium">{user?.email}</span>
                <span className="text-xs text-white/70">
                  {user?.role === 'admin' ? 'Recrutador' : 'Candidato'}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
