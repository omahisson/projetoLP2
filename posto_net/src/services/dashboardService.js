import api from './api';

export async function buscarDashboard(idPosto = localStorage.getItem('postoSelecionadoId')) {
    const params = idPosto ? { idPosto } : undefined;
    const { data } = await api.get('/dashboard', { params });
    return data || {};
}
