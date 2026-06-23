import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../components/card';
import { entrar } from '../services/authService';
import '../styles/form-cadastro.css';
import '../styles/autenticacao.css';

function mensagemErro(error, padrao) {
    const resposta = error.response?.data;
    if (typeof resposta === 'string') return resposta;
    return resposta?.mensagem || resposta?.message || padrao;
}

function Login() {
    const navigate = useNavigate();
    const [matricula, setMatricula] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const [enviando, setEnviando] = useState(false);

    async function enviar(event) {
        event.preventDefault();
        setErro('');
        setEnviando(true);
        try {
            await entrar(matricula, senha);
            navigate('/postos');
        } catch (error) {
            setErro(mensagemErro(error, 'Não foi possível entrar. Confira sua matrícula e senha.'));
        } finally {
            setEnviando(false);
        }
    }

    return (
        <main className="auth-page">
            <div className="auth-card">
                <Card title="PostoNet" titleAlign="center">
                    <form className="form-structured-form" onSubmit={enviar}>
                        <p className="auth-intro">Acesse sua conta.</p>
                        {erro && <p className="auth-error" role="alert">{erro}</p>}
                        <div className="form-field-group">
                            <label className="form-label" htmlFor="matricula">Matrícula</label>
                            <div className="form-input-wrapper">
                                <input className="form-input" id="matricula" value={matricula} onChange={(e) => setMatricula(e.target.value)} placeholder="Digite sua matrícula" autoComplete="username" required />
                            </div>
                        </div>
                        <div className="form-field-group">
                            <label className="form-label" htmlFor="senha">Senha</label>
                            <div className="form-input-wrapper">
                                <input className="form-input" id="senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Digite sua senha" autoComplete="current-password" required />
                            </div>
                        </div>
                        <button className="form-button-primary" type="submit" disabled={enviando}>{enviando ? 'Entrando...' : 'Entrar'}</button>
                        <p className="auth-footer">Ainda não tem uma conta? <Link to="/criar-conta">Crie sua conta</Link></p>
                    </form>
                </Card>
            </div>
        </main>
    );
}

export default Login;
