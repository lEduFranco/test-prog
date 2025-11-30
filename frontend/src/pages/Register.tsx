import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/user';

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
}

export const Register: React.FC = () => {
  const { register: registerUser, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<RegisterFormData>({
    defaultValues: {
      role: 'candidate'
    }
  });

  const password = watch('password');

  useEffect(() => {
    if (isAuthenticated) {
      navigate(isAdmin ? '/admin/dashboard' : '/dashboard', { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser({
        email: data.email,
        password: data.password,
        role: data.role
      });
      toast.success('Conta criada com sucesso! Bem-vindo!');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Falha no cadastro. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-700 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        
        <div className="relative z-10 text-white text-center max-w-lg">
          <h1 className="text-5xl font-bold mb-6 animate-fade-in">
            Comece Agora
          </h1>
          <p className="text-xl text-purple-100 mb-8 animate-fade-in animation-delay-200">
            Crie sua conta e encontre as melhores oportunidades de carreira
          </p>
          <div className="grid grid-cols-3 gap-4 mt-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 animate-fade-in animation-delay-400">
              <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <div className="text-xs text-purple-100">Rápido</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 animate-fade-in animation-delay-600">
              <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <div className="text-xs text-purple-100">Seguro</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 animate-fade-in animation-delay-800">
              <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-xs text-purple-100">Gratuito</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-md w-full space-y-8 animate-fade-in">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4 transform hover:scale-110 transition-transform duration-300">
              <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Criar nova conta
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Já tem uma conta?{' '}
              <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                Faça login
              </Link>
            </p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
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
                    required: 'Senha é obrigatória',
                    minLength: {
                      value: 6,
                      message: 'A senha deve ter pelo menos 6 caracteres'
                    }
                  })}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 animate-shake">{errors.password.message}</p>
              )}
            </div>

            <div className="group">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <input
                  id="confirmPassword"
                  type="password"
                  {...register('confirmPassword', {
                    required: 'Confirmação de senha é obrigatória',
                    validate: (value) => value === password || 'As senhas não coincidem'
                  })}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Repita a senha"
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600 animate-shake">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tipo de Conta
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="relative flex cursor-pointer">
                  <input
                    type="radio"
                    value="candidate"
                    {...register('role')}
                    className="sr-only peer"
                  />
                  <div className="w-full p-4 border-2 border-gray-300 rounded-lg peer-checked:border-indigo-600 peer-checked:bg-indigo-50 transition-all hover:border-indigo-400">
                    <div className="flex flex-col items-center text-center space-y-2">
                      <svg className="w-8 h-8 text-gray-600 peer-checked:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <div>
                        <div className="font-semibold text-sm">Candidato</div>
                        <div className="text-xs text-gray-500">Buscar vagas</div>
                      </div>
                    </div>
                  </div>
                </label>

                <label className="relative flex cursor-pointer">
                  <input
                    type="radio"
                    value="admin"
                    {...register('role')}
                    className="sr-only peer"
                  />
                  <div className="w-full p-4 border-2 border-gray-300 rounded-lg peer-checked:border-indigo-600 peer-checked:bg-indigo-50 transition-all hover:border-indigo-400">
                    <div className="flex flex-col items-center text-center space-y-2">
                      <svg className="w-8 h-8 text-gray-600 peer-checked:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <div className="font-semibold text-sm">Recrutador</div>
                        <div className="text-xs text-gray-500">Criar vagas</div>
                      </div>
                    </div>
                  </div>
                </label>
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
                  <span>Criando conta...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>Criar Conta</span>
                  <svg className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
