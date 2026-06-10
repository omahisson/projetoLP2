import api from './api';

function parseNumber(value) {
    if (value === null || value === undefined || value === '') return 0;
    if (typeof value === 'number') return value;
    return Number(String(value).replace('R$', '').replace(/\./g, '').replace(',', '.').trim()) || 0;
}

function fromApiHistorico(historico) {
    return {
        ...historico,
        id_posto: historico.idPosto,
        tipoCombustivelId: historico.idCombustivel
    };
}

export async function listarHistoricoCombustivel({
    idPosto = localStorage.getItem('postoSelecionadoId'),
    idCombustivel
} = {}) {
    const params = {};
    if (idPosto) params.idPosto = idPosto;
    if (idCombustivel) params.idCombustivel = idCombustivel;
    const { data } = await api.get('/historico-combustivel', { params });
    return Array.isArray(data) ? data.map(fromApiHistorico) : [];
}

export async function alterarPrecoCombustivel(payload) {
    const { data } = await api.post('/historico-combustivel/alterar-preco', {
        idPosto: payload.idPosto || payload.id_posto || localStorage.getItem('postoSelecionadoId'),
        idCombustivel: payload.idCombustivel || payload.tipoCombustivelId,
        tipoCombustivelId: payload.tipoCombustivelId || payload.idCombustivel,
        tipoCombustivel: payload.tipoCombustivel || payload.nome || '',
        nome: payload.nome || payload.tipoCombustivel || '',
        fornecedor: payload.fornecedor || '',
        estoque: payload.estoque === '' || payload.estoque === null || payload.estoque === undefined ? null : parseNumber(payload.estoque),
        novoPreco: parseNumber(payload.novoPreco),
        dataVigencia: payload.dataVigencia || null,
        responsavel: payload.responsavel || '',
        motivo: payload.motivo || ''
    });
    return fromApiHistorico(data);
}
