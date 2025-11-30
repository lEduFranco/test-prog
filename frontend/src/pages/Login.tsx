import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';

interface LoginFormData {
  email: string;
  password: string;
}

export const Login: React.FC = () => {
  const { login, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormData>();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(isAdmin ? '/admin/dashboard' : '/dashboard', { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
      toast.success('Login realizado com sucesso!');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Falha no login. Verifique suas credenciais.');
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-md w-full space-y-8 animate-fade-in">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4 transform hover:scale-110 transition-transform duration-300">
              <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Bem-vindo de volta!
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Não tem uma conta?{' '}
              <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                Cadastre-se gratuitamente
              </Link>
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div className="group">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    type="email"
                    {...register('email', {
                      required: 'Email é obrigatório',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Email inválido'
                      }
                    })}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="seu@email.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 animate-shake">{errors.email.message}</p>
                )}
              </div>

              <div className="group">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    type="password"
                    {...register('password', {
                      required: 'Senha é obrigatória'
                    })}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600 animate-shake">{errors.password.message}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Entrando...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>Entrar</span>
                  <svg className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              )}
            </button>
          </form>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-700 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-20 right-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        
        <div className="relative z-10 text-white text-center max-w-lg">
          <h1 className="text-5xl font-bold mb-6 animate-fade-in">
            Sistema de Recrutamento
          </h1>
          <p className="text-xl text-purple-100 mb-8 animate-fade-in animation-delay-200">
            Conectando talentos às melhores oportunidades
          </p>
          <div className="grid grid-cols-2 gap-4 mt-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 animate-fade-in animation-delay-400">
              <div className="text-3xl font-bold">1000+</div>
              <div className="text-sm text-purple-100">Vagas Ativas</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 animate-fade-in animation-delay-600">
              <div className="text-3xl font-bold">500+</div>
              <div className="text-sm text-purple-100">Empresas</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
