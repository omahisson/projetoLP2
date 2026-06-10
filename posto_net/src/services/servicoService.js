import api from './api';

function parseNumber(value) {
    if (value === null || value === undefined || value === '') return 0;
    if (typeof value === 'number') return value;
    return Number(String(value).replace('R$', '').replace(/\./g, '').replace(',', '.').trim()) || 0;
}

function toApiServico(servico) {
    const labels = Array.isArray(servico.labels) ? servico.labels : String(servico.labels || '').split(',').map(item => item.trim()).filter(Boolean);
    const descricao = servico.descricao || servico.descricaoTecnica || servico.nome || '';

    return {
        id: servico.id || null,
        idPosto: servico.idPosto || servico.id_posto || localStorage.getItem('postoSelecionadoId'),
        nome: servico.nome || '',
        preco: parseNumber(servico.preco),
        descricao,
        unidade: servico.unidade || 'SERVICO',
        ativo: servico.ativo ?? servico.disponivel !== false,
        duracaoEstimadaMinutos: String(servico.duracaoEstimadaMinutos || servico.duracao || '0'),
        requerAgendamento: servico.requerAgendamento ?? false,
        descricaoTecnica: servico.descricaoTecnica || labels.join(', ') || descricao
    };
}

function fromApiServico(servico) {
    const labels = servico.descricaoTecnica ? String(servico.descricaoTecnica).split(',').map(item => item.trim()).filter(Boolean) : [];

    return {
        ...servico,
        id_posto: servico.idPosto,
        duracao: servico.duracaoEstimadaMinutos || '',
        labels,
        disponivel: servico.ativo !== false,
        value: servico.id,
        text: servico.nome
    };
}

export async function listarServicos(idPosto = localStorage.getItem('postoSelecionadoId')) {
    const params = idPosto ? { idPosto } : undefined;
    const { data } = await api.get('/servico', { params });
    return Array.isArray(data) ? data.map(fromApiServico) : [];
}

export async function buscarServico(id) {
    const { data } = await api.get(`/servico/${id}`);
    return fromApiServico(data);
}

export async function criarServico(servico) {
    const { data } = await api.post('/servico', toApiServico(servico));
    return fromApiServico(data);
}

export async function atualizarServico(id, servico) {
    const { data } = await api.put(`/servico/${id}`, toApiServico({ ...servico, id }));
    return fromApiServico(data);
}

export async function excluirServico(id) {
    await api.delete(`/servico/${id}`);
}
