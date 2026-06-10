import api from './api';

function parseNumber(value) {
    if (value === null || value === undefined || value === '') return 0;
    if (typeof value === 'number') return value;
    return Number(String(value).replace('R$', '').replace(/\./g, '').replace(',', '.').trim()) || 0;
}

function toApiAbastecimento(abastecimento) {
    return {
        id: abastecimento.id || null,
        idPosto: abastecimento.idPosto || abastecimento.id_posto || localStorage.getItem('postoSelecionadoId'),
        idCombustivel: abastecimento.idCombustivel || abastecimento.tipoCombustivelId || null,
        tipoCombustivel: abastecimento.tipoCombustivel || '',
        fornecedor: abastecimento.fornecedor || '',
        quantidade: parseNumber(abastecimento.quantidade),
        unidade: abastecimento.unidade || 'Litro',
        numeroNota: abastecimento.numeroNota || '',
        dataEntrega: abastecimento.dataEntrega || null,
        dataValidade: abastecimento.dataValidade || null,
        precoUnitario: parseNumber(abastecimento.precoUnitario),
        valorTotal: parseNumber(abastecimento.valorTotal)
    };
}

function fromApiAbastecimento(abastecimento) {
    return {
        ...abastecimento,
        id_posto: abastecimento.idPosto,
        tipoCombustivelId: abastecimento.idCombustivel
    };
}

export async function listarAbastecimentos(idPosto = localStorage.getItem('postoSelecionadoId')) {
    const params = idPosto ? { idPosto } : undefined;
    const { data } = await api.get('/abastecimento', { params });
    return Array.isArray(data) ? data.map(fromApiAbastecimento) : [];
}

export async function buscarAbastecimento(id) {
    const { data } = await api.get(`/abastecimento/${id}`);
    return fromApiAbastecimento(data);
}

export async function criarAbastecimento(abastecimento) {
    const { data } = await api.post('/abastecimento', toApiAbastecimento(abastecimento));
    return fromApiAbastecimento(data);
}

export async function atualizarAbastecimento(id, abastecimento) {
    const { data } = await api.put(`/abastecimento/${id}`, toApiAbastecimento({ ...abastecimento, id }));
    return fromApiAbastecimento(data);
}

export async function excluirAbastecimento(id) {
    await api.delete(`/abastecimento/${id}`);
}
