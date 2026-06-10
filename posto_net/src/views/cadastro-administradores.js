import React, { useState, useEffect } from 'react'; //redireciona rotas e guarda variaveis
import { useNavigate, useParams } from 'react-router-dom'; //navega entre rotas e pega parametros na url

import Card from '../components/card';
import iconeColuna from '../icones/coluna.svg';

import { listarPostos } from '../services/postoService';
import { buscarFuncionario, criarFuncionario, atualizarFuncionario } from '../services/funcionarioService';

function CadastroAdministrador({ toggleMenu }) {
    const { idParam } = useParams(); //pega o parametro da url

    const navigate = useNavigate();

    const [postos, setPostos] = useState([]);
    const [postosSelecionados, setPostosSelecionados] = useState([]);

    useEffect(() => {
        async function carregarPostos() {
            try {
                const data = await listarPostos();
                setPostos(data || []);
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

    const [dados, setDados] = React.useState(null); //volta pro dado original
    const [carregando, setCarregando] = React.useState(!!idParam); // Adiciona estado de loading

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
            setDados({}); // Inicializa com objeto vazio para permitir renderização
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

    async function buscar() {
        if (idParam != null) {
            setCarregando(true);
            try {
                const dadosResp = await buscarFuncionario(idParam);

                if (!dadosResp) {
                    alert('Administrador não encontrado');
                    navigate('/empregados');
                    return;
                }

                setDados(dadosResp);
                setId(dadosResp.id);
                setNome(dadosResp.nome || '');
                setCpf(dadosResp.cpf || '');
                setEmail(dadosResp.email || '');
                setCelular(dadosResp.telefone || dadosResp.celular || '');
                setSenha(dadosResp.senha || '');
                setGerenciarTodosPostos(false);
                setGerenciarGerentes(false);
                setGerenciarFuncionarios(false);
                setGerenciarProdutos(false);
                const permitidos = dadosResp.idPosto ? [dadosResp.idPosto] : [];
                setPostosSelecionados(permitidos);
            } catch (error) {
                console.error('Erro ao buscar administrador:', error);
                alert('Erro ao buscar administrador: ' + (error.response?.data || error.message));
                navigate('/empregados');
            } finally {
                setCarregando(false);
            }
        }
    }

    async function salvar() {
        const postoId = localStorage.getItem('postoSelecionadoId');
        const postosPermitidos = gerenciarTodosPostos ? [] : postosSelecionados;

        const labels = [];
        
        if (gerenciarTodosPostos) {
            labels.push('Postos');
        } else if (postosPermitidos.length > 0) {
            postosPermitidos.forEach(idPosto => {
                const posto = postos.find(item => String(item.id) === String(idPosto));
                labels.push(posto?.nomeFantasia || posto?.nome || idPosto);
            });
        }
        
        if (gerenciarGerentes) {
            labels.push('gerentes');
        }
        if (gerenciarFuncionarios) {
            labels.push('funcionarios');
        }
        if (gerenciarProdutos) {
            labels.push('produtos');
        }

        const data = {
            id,
            idPosto: postosPermitidos[0] || postoId,
            nome,
            cpf,
            email,
            celular,
            telefone: celular,
            senha,
            setor: 'Administracao',
            cargoApi: 'ADMINISTRADOR',
            gerenciarTodosPostos,
            gerenciarGerentes,
            gerenciarFuncionarios,
            gerenciarProdutos,
            postosPermitidos,
            labels 
        };
        if (idParam == null) {
            await criarFuncionario(data, 'administradores')
                .then(function (response) {
                    alert(`Administrador ${nome} cadastrado com sucesso!`);
                    navigate(`/empregados`);
                })
                .catch(function (error) {
                    alert('Erro ao cadastrar administrador: ' + (error.response?.data || error.message));
                });
        } else {
            await atualizarFuncionario(idParam, data, 'administradores')
                .then(function (response) {
                    alert(`Administrador ${nome} alterado com sucesso!`);
                    navigate(`/empregados`);
                })
                .catch(function (error) {
                    alert('Erro ao alterar administrador: ' + (error.response?.data || error.message));
                });
        }
    }

    useEffect(() => {
        if (idParam) {
            buscar();
        } else {
            inicializar();
        }
    }, [idParam]);

    if (carregando) return null; // Só bloqueia renderização se estiver carregando

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
                <span className='textoDashboard'>Dashboard - {localStorage.getItem('postoSelecionado') || 'Posto Ipiranga Vila'}</span>
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
                                            const marcado = postosSelecionados.includes(p.id);
                                            return (
                                                <div key={p.id} style={formStyles.checkboxContainer}>
                                                    <input
                                                        type="checkbox"
                                                        id={`posto_${p.id}`}
                                                        checked={marcado}
                                                        onChange={(e) => {
                                                            const novo = e.target.checked
                                                                ? [...postosSelecionados, p.id]
                                                                : postosSelecionados.filter(n => n !== p.id);
                                                            setPostosSelecionados(novo);
                                                        }}
                                                        style={formStyles.checkbox}
                                                    />
                                                    <label htmlFor={`posto_${p.id}`} style={formStyles.checkboxLabel}>
                                                        {p.nomeFantasia || p.nome}
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
