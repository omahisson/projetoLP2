import api from './api';

function parseNumber(value) {
    if (value === null || value === undefined || value === '') return 0;
    if (typeof value === 'number') return value;
    return Number(String(value).replace('R$', '').replace(/\./g, '').replace(',', '.').trim()) || 0;
}

function fromApiTurno(turno) {
    return {
        ...turno,
        id_posto: turno.idPosto,
        operadorId: turno.operadorId,
        horaAberturaISO: turno.horaAberturaISO,
        horaFechamentoISO: turno.horaFechamentoISO
    };
}

function fromApiVenda(venda) {
    return {
        ...venda,
        id_posto: venda.idPosto,
        id_turno: venda.idTurno,
        total: parseNumber(venda.total),
        cancelada: venda.cancelada === true,
        itens: Array.isArray(venda.itens) ? venda.itens.map(item => ({
            ...item,
            produtoId: item.itemId,
            quantidade: parseNumber(item.quantidade),
            precoUnitario: parseNumber(item.precoUnitario),
            valorTotal: parseNumber(item.valorTotal)
        })) : []
    };
}

export async function abrirTurno(payload) {
    const { data } = await api.post('/pdv/turnos', {
        idPosto: payload.idPosto || payload.id_posto || localStorage.getItem('postoSelecionadoId'),
        operadorId: payload.operadorId,
        operadorNome: payload.operadorNome,
        turno: payload.turno,
        valorInicialCaixa: parseNumber(payload.valorInicialCaixa)
    });
    return fromApiTurno(data);
}

export async function buscarTurno(id) {
    const { data } = await api.get(`/pdv/turnos/${id}`);
    return fromApiTurno(data);
}

export async function listarVendasTurno(idTurno) {
    const { data } = await api.get(`/pdv/turnos/${idTurno}/vendas`);
    return Array.isArray(data) ? data.map(fromApiVenda) : [];
}

export async function registrarVenda(payload) {
    const { data } = await api.post('/pdv/vendas', {
        idPosto: payload.idPosto || payload.id_posto || localStorage.getItem('postoSelecionadoId'),
        idTurno: payload.idTurno || payload.id_turno,
        itens: payload.itens || [],
        total: parseNumber(payload.total),
        formaPagamento: payload.formaPagamento
    });
    return fromApiVenda(data);
}

export async function cancelarVenda(id, motivoCancelamento = 'Cancelada no PDV') {
    // O backend espera PdvVendaDTO com o campo motivoCancelamento
    const { data } = await api.put(`/pdv/vendas/${id}/cancelar`, { motivoCancelamento });
    return fromApiVenda(data);
}

export async function fecharTurno(id, payload) {
    const { data } = await api.put(`/pdv/turnos/${id}/fechar`, {
        valorFinalCaixa: parseNumber(payload.valorFinalCaixa),
        valorEsperado: parseNumber(payload.valorEsperado),
        diferenca: parseNumber(payload.diferenca)
    });
    return fromApiTurno(data);
}
