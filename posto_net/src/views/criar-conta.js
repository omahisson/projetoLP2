import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../components/card';
import { cadastrarAdministrador } from '../services/authService';
import '../styles/form-cadastro.css';
import '../styles/autenticacao.css';

const inicial = { nome: '', matricula: '', senha: '', senhaRepeticao: '', cpf: '', dataNascimento: '', rg: '', telefone: '', email: '', logradouro: '', numero: '', bairro: '', cidade: '', estado: '', cep: '' };

function mensagemErro(error, padrao) {
    const resposta = error.response?.data;
    if (typeof resposta === 'string') return resposta;
    return resposta?.mensagem || resposta?.message || padrao;
}

function CriarConta() {
    const navigate = useNavigate();
    const [dados, setDados] = useState(inicial);
    const [erro, setErro] = useState('');
    const [enviando, setEnviando] = useState(false);
    const alterar = (campo) => (event) => setDados({ ...dados, [campo]: event.target.value });

    async function enviar(event) {
        event.preventDefault();
        setErro('');
        if (dados.senha !== dados.senhaRepeticao) {
            setErro('As senhas precisam ser iguais.');
            return;
        }
        setEnviando(true);
        try {
            await cadastrarAdministrador({ ...dados, estado: dados.estado.toUpperCase() });
            navigate('/postos');
        } catch (error) {
            setErro(mensagemErro(error, 'Não foi possível criar sua conta.'));
        } finally {
            setEnviando(false);
        }
    }

    const campo = (id, label, type = 'text', extra = {}) => (
        <div className="form-field-group">
            <label className="form-label" htmlFor={id}>{label}</label>
            <div className="form-input-wrapper">
                <input className="form-input" id={id} type={type} value={dados[id]} onChange={alterar(id)} required {...extra} />
            </div>
        </div>
    );

    return (
        <main className="auth-page auth-page--registration">
            <div className="auth-card auth-card--wide">
                <Card title="Criar nova conta" titleAlign="center">
                    <form className="form-structured-form" onSubmit={enviar}>
                        <br></br>
                        {erro && <p className="auth-error" role="alert">{erro}</p>}
                        <div className="form-grid-row">{campo('nome', 'Nome completo')}{campo('matricula', 'Matrícula')}</div>
                        <div className="form-grid-row">{campo('cpf', 'CPF')}{campo('rg', 'RG')}</div>
                        <div className="form-grid-row">{campo('dataNascimento', 'Data de nascimento', 'date')}{campo('telefone', 'Telefone', 'tel')}</div>
                        <div className="form-grid-row">{campo('email', 'E-mail', 'email')}{campo('cep', 'CEP')}</div>
                        <div className="form-grid-row">{campo('logradouro', 'Rua / Avenida')}{campo('numero', 'Número')}</div>
                        <div className="form-grid-row">{campo('bairro', 'Bairro')}{campo('cidade', 'Cidade')}</div>
                        <div className="form-grid-row">{campo('estado', 'Estado', 'text', { maxLength: 2, placeholder: 'MG' })}</div>
                        <div className="form-grid-row">{campo('senha', 'Senha', 'password', { minLength: 8, autoComplete: 'new-password' })}{campo('senhaRepeticao', 'Confirmar senha', 'password', { minLength: 8, autoComplete: 'new-password' })}</div>
                        <button className="form-button-primary" type="submit" disabled={enviando}>{enviando ? 'Criando conta...' : 'Criar conta'}</button>
                        <p className="auth-footer">Já tem uma conta? <Link to="/login">Entrar</Link></p>
                    </form>
                </Card>
            </div>
        </main>
    );
}

export default CriarConta;
