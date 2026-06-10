import api from './api';

function toApiBomba(bomba) {
    const nome = bomba.nome || bomba.codigo || '';

    return {
        id: bomba.id || null,
        codigo: nome,
        numeroSerie: bomba.numeroSerie || nome,
        idPosto: bomba.idPosto || bomba.id_posto || localStorage.getItem('postoSelecionadoId'),
        ativo: bomba.ativo ?? bomba.status !== 'Inativa',
        combustiveis: Array.isArray(bomba.combustiveis) ? bomba.combustiveis : []
    };
}

function fromApiBomba(bomba) {
    return {
        ...bomba,
        id_posto: bomba.idPosto,
        nome: bomba.codigo || '',
        status: bomba.ativo === false ? 'Inativa' : 'Ativa',
        combustiveis: Array.isArray(bomba.combustiveis) ? bomba.combustiveis : []
    };
}

export async function listarBombas(idPosto = localStorage.getItem('postoSelecionadoId')) {
    const params = idPosto ? { idPosto } : undefined;
    const { data } = await api.get('/bomba', { params });
    return Array.isArray(data) ? data.map(fromApiBomba) : [];
}

export async function buscarBomba(id) {
    const { data } = await api.get(`/bomba/${id}`);
    return fromApiBomba(data);
}

export async function criarBomba(bomba) {
    const { data } = await api.post('/bomba', toApiBomba(bomba));
    return fromApiBomba(data);
}

export async function atualizarBomba(id, bomba) {
    const { data } = await api.put(`/bomba/${id}`, toApiBomba({ ...bomba, id }));
    return fromApiBomba(data);
}

export async function excluirBomba(id) {
    await api.delete(`/bomba/${id}`);
}
