import api from './api';

function cargoParaApi(tipo) {
    if (tipo === 'administradores') return 'ADMINISTRADOR';
    if (tipo === 'gerentes') return 'GERENTE';
    return 'COLABORADOR';
}

function normalizarCargo(valor) {
    if (!valor) return null;
    const v = String(valor).toUpperCase().trim();
    if (v === 'ADMINISTRADOR') return 'ADMINISTRADOR';
    if (v === 'GERENTE') return 'GERENTE';
    if (v === 'COLABORADOR') return 'COLABORADOR';
    return 'COLABORADOR';
}

function cargoParaTipo(cargo) {
    if (cargo === 'ADMINISTRADOR') return 'administradores';
    if (cargo === 'GERENTE') return 'gerentes';
    return 'funcionarios';
}

function somenteDigitos(value) {
    return String(value || '').replace(/\D/g, '');
}

function textoObrigatorio(value, fallback) {
    return String(value || fallback || '').trim();
}

function texto(value) {
    return String(value || '').trim();
}

function toApiFuncionario(funcionario, tipo = 'funcionarios') {
    const cargo = funcionario.cargoApi
        ? normalizarCargo(funcionario.cargoApi)
        : (normalizarCargo(funcionario.cargo) || cargoParaApi(tipo));

    const postoId = funcionario.idPosto || funcionario.id_posto || funcionario.postoDeTrabalho || localStorage.getItem('postoSelecionadoId');
    const nome = textoObrigatorio(funcionario.nome, 'Funcionario');
    const telefone = textoObrigatorio(funcionario.telefone || funcionario.celular, '(32) 99999-9999');
    const cpf = somenteDigitos(funcionario.cpf);
    const matricula = textoObrigatorio(funcionario.maticula || funcionario.matricula, `MAT${funcionario.id || Date.now()}`);
    const senha = texto(funcionario.senha);
    const setor = textoObrigatorio(funcionario.setor || funcionario.labels?.[0], cargo === 'GERENTE' ? 'Gerencia' : cargo === 'ADMINISTRADOR' ? 'Administracao' : 'Operacao');

    return {
        id: funcionario.id || null,
        idPosto: postoId,
        nome,
        cpf,
        dataNascimento: funcionario.dataNascimento || '1990-01-01',
        rg: textoObrigatorio(funcionario.rg, cpf.slice(0, 9) || '123456789'),
        telefone,
        email: textoObrigatorio(funcionario.email, `${somenteDigitos(cpf) || Date.now()}@postonet.local`),
        logradouro: textoObrigatorio(funcionario.logradouro, 'Rua Principal'),
        numero: textoObrigatorio(funcionario.numero, '1'),
        bairro: textoObrigatorio(funcionario.bairro, 'Centro'),
        cidade: textoObrigatorio(funcionario.cidade, 'Juiz de Fora'),
        estado: textoObrigatorio(funcionario.estado, 'MG'),
        cep: textoObrigatorio(funcionario.cep, '36000000'),
        maticula: matricula,
        salario: funcionario.salario === '' || funcionario.salario === null || funcionario.salario === undefined
            ? (cargo === 'ADMINISTRADOR' ? 1 : null)
            : Number(funcionario.salario),
        dataAdmissao: funcionario.dataAdmissao || new Date().toISOString().slice(0, 10),
        senha,
        setor,
        bonusMeta: cargo === 'GERENTE' ? (Number(funcionario.bonusMeta) > 0 ? Number(funcionario.bonusMeta) : 1) : funcionario.bonusMeta,
        cargo,
        ativo: funcionario.ativo ?? true
    };
}

function labelsPorFuncionario(funcionario) {
    const labels = [];
    if (funcionario.cargo === 'ADMINISTRADOR') labels.push('Administrador');
    if (funcionario.cargo === 'GERENTE') labels.push('Gerente');
    if (funcionario.cargo === 'COLABORADOR') labels.push(funcionario.setor || 'Funcionario');
    return labels;
}

function fromApiFuncionario(funcionario) {
    return {
        ...funcionario,
        id_posto: funcionario.idPosto,
        idPosto: funcionario.idPosto,
        tipo: cargoParaTipo(funcionario.cargo),
        labels: labelsPorFuncionario(funcionario),
        postoDeTrabalho: funcionario.idPosto ? String(funcionario.idPosto) : '',
        celular: funcionario.telefone || '',
        text: funcionario.nome,
        value: funcionario.id
    };
}

export async function listarFuncionarios(idPosto = localStorage.getItem('postoSelecionadoId')) {
    const { data } = await api.get('/funcionario');
    const funcionarios = Array.isArray(data) ? data.map(fromApiFuncionario) : [];
    return idPosto ? funcionarios.filter(item => String(item.idPosto) === String(idPosto)) : funcionarios;
}

export async function listarFuncionariosPorTipo(tipo, idPosto = localStorage.getItem('postoSelecionadoId')) {
    const cargo = cargoParaApi(tipo);
    const funcionarios = await listarFuncionarios(tipo === 'administradores' ? null : idPosto);
    return funcionarios.filter(item => {
        if (item.cargo !== cargo) return false;
        if (tipo !== 'administradores' || !idPosto) return true;
        return !item.idPosto || String(item.idPosto) === String(idPosto);
    });
}

export async function buscarFuncionario(id) {
    const { data } = await api.get(`/funcionario/${id}`);
    return fromApiFuncionario(data);
}

export async function criarFuncionario(funcionario, tipo = 'funcionarios') {
    const { data } = await api.post('/funcionario', toApiFuncionario(funcionario, tipo));
    return fromApiFuncionario(data);
}

export async function atualizarFuncionario(id, funcionario, tipo = 'funcionarios') {
    const { data } = await api.put(`/funcionario/${id}`, toApiFuncionario({ ...funcionario, id }, tipo));
    return fromApiFuncionario(data);
}

export async function excluirFuncionario(id) {
    await api.delete(`/funcionario/${id}`);
}
