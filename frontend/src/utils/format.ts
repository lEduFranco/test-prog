export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatDate = (date: string): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date));
};

export const formatDateTime = (date: string): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

export const getJobTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    remote: 'Remoto',
    onsite: 'Presencial',
    hybrid: 'Híbrido',
  };
  return labels[type] || type;
};

export const getJobStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    open: 'Aberta',
    closed: 'Fechada',
    archived: 'Arquivada',
  };
  return labels[status] || status;
};

export const getApplicationStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    pending: 'Pendente',
    reviewing: 'Em Análise',
    approved: 'Aprovado',
    rejected: 'Rejeitado',
  };
  return labels[status] || status;
};

export const getApplicationStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    reviewing: 'bg-blue-100 text-blue-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};
