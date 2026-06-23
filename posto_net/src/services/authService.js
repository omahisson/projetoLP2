import api from './api';

function salvarSessao({ token, matricula, cargo }) {
    localStorage.setItem('token', token);
    localStorage.setItem('matricula', matricula);
    localStorage.setItem('cargo', cargo || '');
}

export async function entrar(matricula, senha) {
    const { data } = await api.post('/auth', { matricula, senha });
    salvarSessao(data);
    return data;
}

export async function cadastrarAdministrador(dados) {
    const { data } = await api.post('/auth/cadastro', dados);
    salvarSessao(data);
    return data;
}

export async function verificarMatricula(matricula) {
    const { data } = await api.get('/auth/matricula-disponivel', { params: { matricula } });
    return data.disponivel === true;
}

export function sair() {
    ['token', 'jwt', 'accessToken', 'matricula', 'cargo', 'postoSelecionado', 'postoSelecionadoId'].forEach((chave) => {
        localStorage.removeItem(chave);
    });
}
