import React, { useState } from 'react';
import { JobFilters as JobFiltersType, JobType } from '@/types/job';

interface JobFiltersProps {
  onFilter: (filters: JobFiltersType) => void;
}

export const JobFilters: React.FC<JobFiltersProps> = ({ onFilter }) => {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState<JobType | ''>('');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');

  const parseSalary = (value: string): number | undefined => {
    if (!value) return undefined;
    const cleanValue = value.replace(/\./g, '').replace(/,/g, '.');
    const parsed = parseFloat(cleanValue);
    return isNaN(parsed) ? undefined : parsed;
  };

  const formatSalary = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    if (!numbers) return '';
    const numberValue = parseInt(numbers);
    return numberValue.toLocaleString('pt-BR');
  };

  const handleSalaryChange = (value: string, setter: (value: string) => void) => {
    const numbers = value.replace(/\D/g, '');
    setter(numbers ? formatSalary(numbers) : '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const filters: JobFiltersType = {
      search: search || undefined,
      location: location || undefined,
      type: type || undefined,
      salary_min: parseSalary(salaryMin),
      salary_max: parseSalary(salaryMax),
      status: 'open',
    };

    onFilter(filters);
  };

  const handleReset = () => {
    setSearch('');
    setLocation('');
    setType('');
    setSalaryMin('');
    setSalaryMax('');
    onFilter({ status: 'open' });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-xl p-6 mb-6 border border-gray-100">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Filtrar Vagas</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Buscar
          </label>
          <input
            id="search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Título ou descrição"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Localização
          </label>
          <input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Cidade, estado..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Tipo
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value as JobType | '')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          >
            <option value="">Todos</option>
            <option value="remote">Remoto</option>
            <option value="onsite">Presencial</option>
            <option value="hybrid">Híbrido</option>
          </select>
        </div>

        <div>
          <label htmlFor="salaryMin" className="block text-sm font-medium text-gray-700 mb-1">
            Salário Mínimo
          </label>
          <input
            id="salaryMin"
            type="text"
            inputMode="numeric"
            value={salaryMin}
            onChange={(e) => handleSalaryChange(e.target.value, setSalaryMin)}
            placeholder="Ex: 5.000"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label htmlFor="salaryMax" className="block text-sm font-medium text-gray-700 mb-1">
            Salário Máximo
          </label>
          <input
            id="salaryMax"
            type="text"
            inputMode="numeric"
            value={salaryMax}
            onChange={(e) => handleSalaryChange(e.target.value, setSalaryMax)}
            placeholder="Ex: 15.000"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="flex items-end space-x-2">
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all transform hover:scale-[1.02] shadow-md font-medium"
          >
            Filtrar
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all font-medium"
          >
            Limpar
          </button>
        </div>
      </div>
    </form>
  );
};
