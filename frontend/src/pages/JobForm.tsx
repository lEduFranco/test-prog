import React, { useEffect } from 'react';
import { useNavigate, useParams, useLoaderData } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Navbar } from '@/components/common/Navbar';
import { jobService } from '@/services/job.service';
import { Job, JobType, JobStatus } from '@/types/job';

interface JobFormData {
  title: string;
  description: string;
  salary?: string;
  location: string;
  type: JobType;
  status?: JobStatus;
}

export const JobForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { job } = useLoaderData() as { job: Job | null };
  const navigate = useNavigate();
  const isEdit = !!id;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<JobFormData>({
    defaultValues: {
      type: 'remote',
      status: 'open'
    }
  });

  useEffect(() => {
    if (job) {
      reset({
        title: job.title,
        description: job.description,
        salary: job.salary ? job.salary.toString() : '',
        location: job.location,
        type: job.type,
        status: job.status
      });
    }
  }, [job, reset]);

  const onSubmit = async (data: JobFormData) => {
    const payload = {
      title: data.title,
      description: data.description,
      salary: data.salary ? parseFloat(data.salary) : undefined,
      location: data.location,
      type: data.type,
      ...(isEdit && { status: data.status }),
    };

    const promise = isEdit && id 
      ? jobService.update(id, payload)
      : jobService.create(payload);

    toast.promise(
      promise,
      {
        loading: isEdit ? 'Atualizando vaga...' : 'Criando vaga...',
        success: isEdit ? 'Vaga atualizada com sucesso!' : 'Vaga criada com sucesso!',
        error: (err) => err.response?.data?.error || 'Falha ao salvar vaga',
      }
    );

    try {
      await promise;
      setTimeout(() => navigate('/admin/dashboard'), 500);
    } catch (err: any) {
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/30">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {isEdit ? 'Editar Vaga' : 'Nova Vaga'}
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-lg rounded-xl p-8 border border-gray-100">
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Título *
              </label>
              <input
                id="title"
                type="text"
                {...register('title', {
                  required: 'Título é obrigatório'
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="Ex: Desenvolvedor Full Stack"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Descrição *
              </label>
              <textarea
                id="description"
                {...register('description', {
                  required: 'Descrição é obrigatória'
                })}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="Descreva a vaga, responsabilidades e requisitos..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Localização *
                </label>
                <input
                  id="location"
                  type="text"
                  {...register('location', {
                    required: 'Localização é obrigatória'
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Ex: São Paulo, SP"
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">
                  Salário (opcional)
                </label>
                <input
                  id="salary"
                  type="number"
                  step="0.01"
                  {...register('salary')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Ex: 5000.00"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo *
                </label>
                <select
                  id="type"
                  {...register('type', {
                    required: 'Tipo é obrigatório'
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                >
                  <option value="remote">Remoto</option>
                  <option value="onsite">Presencial</option>
                  <option value="hybrid">Híbrido</option>
                </select>
                {errors.type && (
                  <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
                )}
              </div>

              {isEdit && (
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status *
                  </label>
                  <select
                    id="status"
                    {...register('status')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  >
                    <option value="open">Aberta</option>
                    <option value="closed">Fechada</option>
                    <option value="archived">Arquivada</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 flex space-x-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center space-x-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Salvando...</span>
                </span>
              ) : (
                isEdit ? 'Atualizar Vaga' : 'Criar Vaga'
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/dashboard')}
              className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
