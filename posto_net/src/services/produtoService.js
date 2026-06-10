import api from './api';

function toLabels(categoria) {
    if (!categoria) return [];
    if (Array.isArray(categoria)) return categoria;
    return String(categoria).split(',').map((label) => label.trim()).filter(Boolean);
}

function toCategoria(labels) {
    if (Array.isArray(labels)) return labels.join(', ');
    return labels || '';
}

function toApiProduto(produto) {
    return {
        id: produto.id || null,
        idPosto: produto.idPosto || produto.id_posto || localStorage.getItem('postoSelecionadoId'),
        nome: produto.nome || '',
        preco: Number(produto.preco || 0),
        estoque: Number(produto.estoque || 0),
        codigoBarras: produto.codigoBarras || produto.sku || '',
        dataValidade: produto.dataValidade || null,
        categoria: toCategoria(produto.labels),
        marca: produto.marca || '',
        descricao: produto.descricao || '',
        unidade: produto.unidade || 'unidade',
        ativo: produto.ativo ?? true
    };
}

function fromApiProduto(produto) {
    const labels = produto.labels || toLabels(produto.categoria);

    return {
        ...produto,
        id_posto: produto.idPosto,
        sku: produto.codigoBarras || '',
        labels,
        value: produto.id,
        text: produto.nome
    };
}

export async function listarProdutos(idPosto = localStorage.getItem('postoSelecionadoId')) {
    const params = idPosto ? { idPosto } : undefined;
    const { data } = await api.get('/produto', { params });
    return Array.isArray(data) ? data.map(fromApiProduto) : [];
}

export async function buscarProduto(id) {
    const { data } = await api.get(`/produto/${id}`);
    return fromApiProduto(data);
}

export async function criarProduto(produto) {
    const { data } = await api.post('/produto', toApiProduto(produto));
    return fromApiProduto(data);
}

export async function atualizarProduto(id, produto) {
    const { data } = await api.put(`/produto/${id}`, toApiProduto({ ...produto, id }));
    return fromApiProduto(data);
}

export async function excluirProduto(id) {
    await api.delete(`/produto/${id}`);
}
