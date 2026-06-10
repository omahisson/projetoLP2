import api from './api';

function parseNumber(value) {
    if (value === null || value === undefined || value === '') return 0;
    if (typeof value === 'number') return value;
    return Number(String(value).replace('R$', '').replace(/\./g, '').replace(',', '.').trim()) || 0;
}

function toApiCombustivel(combustivel) {
    const nome = combustivel.nome || combustivel.tipoCombustivel || '';

    return {
        id: combustivel.id || null,
        idPosto: combustivel.idPosto || combustivel.id_posto || localStorage.getItem('postoSelecionadoId'),
        nome,
        tipoCombustivel: combustivel.tipoCombustivel || nome,
        preco: parseNumber(combustivel.preco),
        unidade: combustivel.unidade || 'Litro',
        fornecedor: combustivel.fornecedor || '',
        estoque: parseNumber(combustivel.estoque),
        dataValidade: combustivel.dataValidade || combustivel.validade || null,
        ultimoAbastecimento: combustivel.ultimoAbastecimento || '',
        codigoBarras: combustivel.codigoBarras || nome,
        marca: combustivel.marca || combustivel.fornecedor || '',
        categoria: combustivel.categoria || 'Combustivel',
        descricao: combustivel.descricao || nome,
        ativo: combustivel.ativo ?? combustivel.status !== 'Inativo'
    };
}

function fromApiCombustivel(combustivel) {
    return {
        ...combustivel,
        id_posto: combustivel.idPosto,
        validade: combustivel.dataValidade || '',
        status: combustivel.ativo === false ? 'Inativo' : 'Ativo',
        value: combustivel.id,
        text: combustivel.nome
    };
}

export async function listarCombustiveis(idPosto = localStorage.getItem('postoSelecionadoId')) {
    const params = idPosto ? { idPosto } : undefined;
    const { data } = await api.get('/combustivel', { params });
    return Array.isArray(data) ? data.map(fromApiCombustivel) : [];
}

export async function buscarCombustivel(id) {
    const { data } = await api.get(`/combustivel/${id}`);
    return fromApiCombustivel(data);
}

export async function criarCombustivel(combustivel) {
    const { data } = await api.post('/combustivel', toApiCombustivel(combustivel));
    return fromApiCombustivel(data);
}

export async function atualizarCombustivel(id, combustivel) {
    const { data } = await api.put(`/combustivel/${id}`, toApiCombustivel({ ...combustivel, id }));
    return fromApiCombustivel(data);
}

export async function excluirCombustivel(id) {
    await api.delete(`/combustivel/${id}`);
}
