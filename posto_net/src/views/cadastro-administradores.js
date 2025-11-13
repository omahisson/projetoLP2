import React, { useState, useEffect } from 'react'; //redireciona rotas e guarda variaveis
import { useNavigate, useParams } from 'react-router-dom'; //navega entre rotas e pega parametros na url

import Card from '../components/card';
import iconeColuna from '../icones/coluna.svg';

import { mensagemSucesso, mensagemErro } from '../components/toastr';

import axios from 'axios';
import { BASE_URL } from '../config/axios';

function CadastroAdministrador({ toggleMenu }) {
    const { idParam } = useParams(); //pega o parametro da url

    const navigate = useNavigate();

    const baseURL = `${BASE_URL}/administradores`;

    const [postos, setPostos] = useState([]);
    const [postosSelecionados, setPostosSelecionados] = useState([]);

    useEffect(() => {
        async function carregarPostos() {
            try {
                const resp = await axios.get(`${BASE_URL}/postos`);
                setPostos(resp.data || []);
            } catch (e) {
                console.error('Erro ao carregar postos:', e);
                setPostos([]);
            }
        }
        carregarPostos();
    }, []);

    //criou um campo para cada campo que ta na tela
    const [id, setId] = useState('');
    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [email, setEmail] = useState('');
    const [celular, setCelular] = useState('');
    const [senha, setSenha] = useState('');
    const [gerenciarTodosPostos, setGerenciarTodosPostos] = useState(false);
    const [gerenciarGerentes, setGerenciarGerentes] = useState(false);
    const [gerenciarFuncionarios, setGerenciarFuncionarios] = useState(false);
    const [gerenciarProdutos, setGerenciarProdutos] = useState(false);

    const [dados, setDados] = React.useState([]); //volta pro dado original

    function inicializar() {
        if (idParam == null) { //se nulo pq estou incluindo
            setId('');
            setNome('');
            setCpf('');
            setEmail('');
            setCelular('');
            setSenha('');
            setGerenciarTodosPostos(false);
            setGerenciarGerentes(false);
            setGerenciarFuncionarios(false);
            setGerenciarProdutos(false);
            setPostosSelecionados([]);
        } else {
            setId(dados.id);
            setNome(dados.nome);
            setCpf(dados.cpf);
            setEmail(dados.email);
            setCelular(dados.celular);
            setSenha(dados.senha || '');
            setGerenciarTodosPostos(dados.gerenciarTodosPostos || false);
            setGerenciarGerentes(dados.gerenciarGerentes || false);
            setGerenciarFuncionarios(dados.gerenciarFuncionarios || false);
            setGerenciarProdutos(dados.gerenciarProdutos || false);
        }
    }

    async function salvar() {
        const postosPermitidos = gerenciarTodosPostos ? [] : postosSelecionados;

        let data = {
            id,
            nome,
            cpf,
            email,
            celular,
            senha,
            gerenciarTodosPostos,
            gerenciarGerentes,
            gerenciarFuncionarios,
            gerenciarProdutos,
            postosPermitidos
        };
        data = JSON.stringify(data); //formata para mandar pro backend
        if (idParam == null) { //se nulo pq estou incluindo e uso post
            await axios
                .post(baseURL, data, {
                    headers: { 'Content-Type': 'application/json' },
                })
                .then(function (response) { //se 200, manda mensagem de sucesso e redireciona para a lista de administradores
                    alert(`Administrador ${nome} cadastrado com sucesso!`);
                    navigate(`/empregados`);
                })
                .catch(function (error) { //se 400, manda mensagem de erro
                    alert('Erro ao cadastrar administrador: ' + (error.response?.data || error.message));
                });
        } else { //se nao esta nulo pq estou editando e uso put
            await axios
                .put(`${baseURL}/${idParam}`, data, {
                    headers: { 'Content-Type': 'application/json' },
                })
                .then(function (response) {
                    alert(`Administrador ${nome} alterado com sucesso!`);
                    navigate(`/empregados`);
                })
                .catch(function (error) {
                    alert('Erro ao alterar administrador: ' + (error.response?.data || error.message));
                });
        }
    }

    async function buscar() {
        if (idParam != null) {
            try {
                const response = await axios.get(`${baseURL}/${idParam}`);
                const dadosResp = response.data;

                setDados(dadosResp);
                setId(dadosResp.id);
                setNome(dadosResp.nome || '');
                setCpf(dadosResp.cpf || '');
                setEmail(dadosResp.email || '');
                setCelular(dadosResp.celular || '');
                setSenha(dadosResp.senha || '');
                setGerenciarTodosPostos(!!dadosResp.gerenciarTodosPostos);
                setGerenciarGerentes(!!dadosResp.gerenciarGerentes);
                setGerenciarFuncionarios(!!dadosResp.gerenciarFuncionarios);
                setGerenciarProdutos(!!dadosResp.gerenciarProdutos);
                const permitidos = Array.isArray(dadosResp.postosPermitidos) ? dadosResp.postosPermitidos : [];
                setPostosSelecionados(permitidos);
            } catch (error) {
                console.error('Erro ao buscar administrador:', error);
            }
        }
    }

    useEffect(() => {
        if (idParam) {
            buscar();
        } else {
            inicializar();
        }
    }, [idParam]);

    if (!dados) return null; //se nao tem dado, retorna null e n renderiza a tela ate receber os dados

    const formStyles = {
        container: {
            padding: '24px',
        },
        headerSection: {
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '24px',
        },
        titleSection: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '24px',
        },
        backButton: {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
        },
        titleContainer: {
            display: 'flex',
            flexDirection: 'column',
        },
        title: {
            fontSize: '20px',
            fontWeight: '500',
            margin: 0,
            fontFamily: 'system-ui',
        },
        subtitle: {
            fontSize: '14px',
            color: 'rgb(113, 113, 130)',
            margin: 0,
            marginTop: '4px',
            fontFamily: 'system-ui',
        },
        cardContainer: {
            maxWidth: '672px',
        },
        form: {
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
        },
        fieldGroup: {
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
        },
        label: {
            fontSize: '14px',
            fontWeight: '500',
            fontFamily: 'system-ui',
            color: '#212529',
        },
        inputWrapper: {
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'rgb(243, 243, 245)',
            borderRadius: '8px',
            padding: '0 12px',
            minHeight: '40px',
        },
        input: {
            flex: 1,
            border: 'none',
            background: 'transparent',
            padding: '8px 0',
            fontFamily: 'system-ui',
            fontSize: '14px',
            fontWeight: '400',
            lineHeight: '20px',
            letterSpacing: 'normal',
            color: '#0f172a',
            outline: 'none',
        },
        inputPlaceholder: {
            color: 'rgb(113, 113, 130)',
        },
        gridRow: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
        },
        checkboxContainer: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
        },
        checkbox: {
            width: '16px',
            height: '16px',
            cursor: 'pointer',
            accentColor: '#000000',
        },
        checkboxLabel: {
            fontSize: '14px',
            fontFamily: 'system-ui',
            fontWeight: '500',
            cursor: 'pointer',
            margin: 0,
        },
        checkboxGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
        },
        buttonGroup: {
            display: 'flex',
            flexDirection: 'row',
            gap: '12px',
            marginTop: '24px',
            paddingTop: '24px',
            borderTop: '1px solid #e5e7eb',
        },
        buttonPrimary: {
            flex: 1,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '36px',
            padding: '8px 16px',
            fontSize: '14px',
            fontWeight: '500',
            fontFamily: 'system-ui',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: '#000000',
            color: '#ffffff',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
        },
        buttonSecondary: {
            flex: 1,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '36px',
            padding: '8px 16px',
            fontSize: '14px',
            fontWeight: '500',
            fontFamily: 'system-ui',
            borderRadius: '6px',
            border: '1px solid #d1d5db',
            backgroundColor: '#ffffff',
            color: '#212529',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
        },
    };

    return (
        <div style={formStyles.container}>
            <div style={formStyles.headerSection}>
                <div className='container-icone-coluna' onClick={toggleMenu}>
                    <img src={iconeColuna} alt="Coluna" width="16" height="16" />
                </div>
                <span className='textoDashboard'>Dashboard - Posto Ipiranga Vila</span>
            </div>

            <div style={formStyles.titleSection}>
                <div
                    onClick={() => navigate('/empregados')}
                    style={{
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '32px',
                        height: '32px',
                        borderRadius: '6px',
                        transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(243, 243, 245)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    title="Voltar para listagem de empregados"
                >
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="m12 19-7-7 7-7"></path>
                        <path d="M19 12H5"></path>
                    </svg>
                </div>
                <div style={formStyles.titleContainer}>
                    <h2 style={formStyles.title}>Cadastrar Administrador</h2>
                    <p style={formStyles.subtitle}>Preencha os dados do novo administrador</p>
                </div>
            </div>

            <div style={formStyles.cardContainer}>
                <Card title='Dados do Administrador'>
                    <form onSubmit={(e) => { e.preventDefault(); salvar(); }}>
                        <div style={formStyles.form}>
                            <div style={formStyles.fieldGroup}>
                                <label htmlFor="nome" style={formStyles.label}>
                                    Nome Completo
                                </label>
                                <div style={formStyles.inputWrapper}>
                                    <input
                                        type="text"
                                        id="nome"
                                        name="nome"
                                        value={nome}
                                        onChange={(e) => setNome(e.target.value)} //quando o campo mudar, renderizo a tela novamente
                                        placeholder="Nome completo do administrador"
                                        required
                                        style={formStyles.input}
                                        className="card-pdv-input"
                                    />
                                </div>
                            </div>

                            <div style={formStyles.gridRow}>
                                <div style={formStyles.fieldGroup}>
                                    <label htmlFor="email" style={formStyles.label}>
                                        E-mail
                                    </label>
                                    <div style={formStyles.inputWrapper}>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="admin@postonet.com"
                                            required
                                            style={formStyles.input}
                                            className="card-pdv-input"
                                        />
                                    </div>
                                </div>
                                <div style={formStyles.fieldGroup}>
                                    <label htmlFor="celular" style={formStyles.label}>
                                        Telefone
                                    </label>
                                    <div style={formStyles.inputWrapper}>
                                        <input
                                            type="tel"
                                            id="celular"
                                            name="celular"
                                            value={celular}
                                            onChange={(e) => setCelular(e.target.value)}
                                            placeholder="(00) 00000-0000"
                                            style={formStyles.input}
                                            className="card-pdv-input"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div style={formStyles.fieldGroup}>
                                <label htmlFor="cpf" style={formStyles.label}>
                                    CPF
                                </label>
                                <div style={formStyles.inputWrapper}>
                                    <input
                                        type="text"
                                        id="cpf"
                                        name="cpf"
                                        value={cpf}
                                        onChange={(e) => setCpf(e.target.value)}
                                        placeholder="000.000.000-00"
                                        maxLength="14"
                                        style={formStyles.input}
                                        className="card-pdv-input"
                                    />
                                </div>
                            </div>

                            <div style={formStyles.fieldGroup}>
                                <label htmlFor="senha" style={formStyles.label}>
                                    Senha
                                </label>
                                <div style={formStyles.inputWrapper}>
                                    <input
                                        type="password"
                                        id="senha"
                                        name="senha"
                                        value={senha}
                                        onChange={(e) => setSenha(e.target.value)}
                                        placeholder="Digite a senha"
                                        required={idParam == null} //obrigatorio apenas no cadastro
                                        style={formStyles.input}
                                        className="card-pdv-input"
                                    />
                                </div>
                            </div>

                            <div style={formStyles.fieldGroup}>
                                <label style={formStyles.label}>Permissões de Gerenciamento</label>
                                <div style={formStyles.checkboxGrid}>
                                    <div style={formStyles.checkboxContainer}>
                                        <input
                                            type="checkbox"
                                            id="gerenciarTodosPostos"
                                            checked={gerenciarTodosPostos}
                                            onChange={(e) => {
                                                setGerenciarTodosPostos(e.target.checked);
                                                if (e.target.checked) {
                                                    setPostosSelecionados([]);
                                                }
                                            }}
                                            style={formStyles.checkbox}
                                        />
                                        <label htmlFor="gerenciarTodosPostos" style={formStyles.checkboxLabel}>
                                            Gerenciar todos os postos
                                        </label>
                                    </div>
                                    <div style={formStyles.checkboxContainer}>
                                        <input
                                            type="checkbox"
                                            id="gerenciarGerentes"
                                            checked={gerenciarGerentes}
                                            onChange={(e) => setGerenciarGerentes(e.target.checked)}
                                            style={formStyles.checkbox}
                                        />
                                        <label htmlFor="gerenciarGerentes" style={formStyles.checkboxLabel}>
                                            Gerenciar Gerentes
                                        </label>
                                    </div>
                                    <div style={formStyles.checkboxContainer}>
                                        <input
                                            type="checkbox"
                                            id="gerenciarFuncionarios"
                                            checked={gerenciarFuncionarios}
                                            onChange={(e) => setGerenciarFuncionarios(e.target.checked)}
                                            style={formStyles.checkbox}
                                        />
                                        <label htmlFor="gerenciarFuncionarios" style={formStyles.checkboxLabel}>
                                            Gerenciar Funcionários
                                        </label>
                                    </div>
                                    <div style={formStyles.checkboxContainer}>
                                        <input
                                            type="checkbox"
                                            id="gerenciarProdutos"
                                            checked={gerenciarProdutos}
                                            onChange={(e) => setGerenciarProdutos(e.target.checked)}
                                            style={formStyles.checkbox}
                                        />
                                        <label htmlFor="gerenciarProdutos" style={formStyles.checkboxLabel}>
                                            Gerenciar Produtos
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {!gerenciarTodosPostos && (
                                <div style={formStyles.fieldGroup}>
                                    <label style={formStyles.label}>Postos Permitidos</label>
                                    <div style={formStyles.checkboxGrid}>
                                        {postos.map((p) => {
                                            const marcado = postosSelecionados.includes(p.nome);
                                            return (
                                                <div key={p.id} style={formStyles.checkboxContainer}>
                                                    <input
                                                        type="checkbox"
                                                        id={`posto_${p.id}`}
                                                        checked={marcado}
                                                        onChange={(e) => {
                                                            const novo = e.target.checked
                                                                ? [...postosSelecionados, p.nome]
                                                                : postosSelecionados.filter(n => n !== p.nome);
                                                            setPostosSelecionados(novo);
                                                        }}
                                                        style={formStyles.checkbox}
                                                    />
                                                    <label htmlFor={`posto_${p.id}`} style={formStyles.checkboxLabel}>
                                                        {p.nome}
                                                    </label>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div style={formStyles.buttonGroup}>
                            <button
                                type="submit"
                                style={formStyles.buttonPrimary}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#333333'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = '#000000'}
                            >
                                {idParam ? 'Alterar Administrador' : 'Cadastrar Administrador'}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/empregados')}
                                style={formStyles.buttonSecondary}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = '#ffffff'}
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
}

export default CadastroAdministrador;