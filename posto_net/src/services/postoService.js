import api from './api';

function onlyDigits(value) {
    return String(value || '').replace(/\D/g, '');
}

function today() {
    return new Date().toISOString().slice(0, 10);
}

function toApiPosto(posto) {
    const nomeFantasia = posto.nomeFantasia || posto.nome || '';

    return {
        id: posto.id || null,
        nome: nomeFantasia,
        razaoSocial: posto.razaoSocial || '',
        cnpj: onlyDigits(posto.cnpj),
        nomeFantasia,
        inscricaoEstadual: posto.inscricaoEstadual || '',
        logradouro: posto.logradouro || posto.rua || '',
        numero: posto.numero || '',
        bairro: posto.bairro || '',
        cidade: posto.cidade || '',
        estado: String(posto.estado || '').toUpperCase(),
        cep: onlyDigits(posto.cep),
        telefone: onlyDigits(posto.telefone),
        email: posto.email || '',
        dataCadastro: posto.dataCadastro || today(),
        dataAbertura: posto.dataAbertura || today(),
        ativo: posto.ativo ?? true
    };
}

function fromApiPosto(posto) {
    return {
        ...posto,
        rua: posto.logradouro || '',
        nomeFantasia: posto.nomeFantasia || posto.nome || ''
    };
}

export async function listarPostos() {
    const { data } = await api.get('/posto');
    return Array.isArray(data) ? data.map(fromApiPosto) : [];
}

export async function buscarPosto(id) {
    const { data } = await api.get(`/posto/${id}`);
    return fromApiPosto(data);
}

export async function criarPosto(posto) {
    const { data } = await api.post('/posto', toApiPosto(posto));
    return fromApiPosto(data);
}

export async function atualizarPosto(id, posto) {
    const { data } = await api.put(`/posto/${id}`, toApiPosto({ ...posto, id }));
    return fromApiPosto(data);
}

export async function excluirPosto(id) {
    await api.delete(`/posto/${id}`);
}
