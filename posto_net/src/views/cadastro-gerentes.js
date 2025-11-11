import React, { useState, useEffect } from 'react'; //redireciona rotas e guarda variaveis
import { useNavigate, useParams } from 'react-router-dom'; //navega entre rotas e pega parametros na url

import Card from '../components/card';
import iconeColuna from '../icones/coluna.svg';

import axios from 'axios';
import { BASE_URL } from '../config/axios';

function CadastroGerente({ toggleMenu }) {
    const { idParam } = useParams(); //pega o parametro da url

    const navigate = useNavigate();

    const baseURL = `${BASE_URL}/gerentes`;

    //criou um campo para cada campo que ta na tela
    const [id, setId] = useState('');
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [senha, setSenha] = useState('');
    const [postoShellCentro, setPostoShellCentro] = useState(false);
    const [postoIpirangaVila, setPostoIpirangaVila] = useState(false);
    const [postoBRRodovia, setPostoBRRodovia] = useState(false);
    const [postoTexacoNorte, setPostoTexacoNorte] = useState(false);

    const [dados, setDados] = React.useState([]); //volta pro dado original

    function inicializar() {
        if (idParam == null) { //se nulo pq estou incluindo
            setId('');
            setNome('');
            setEmail('');
            setTelefone('');
            setSenha('');
            setPostoShellCentro(false);
            setPostoIpirangaVila(false);
            setPostoBRRodovia(false);
            setPostoTexacoNorte(false);
        } else {
            setId(dados.id);
            setNome(dados.nome);
            setEmail(dados.email);
            setTelefone(dados.telefone || '');
            setSenha(dados.senha || '');
            setPostoShellCentro(dados.labels?.includes('Posto Shell Centro') || false);
            setPostoIpirangaVila(dados.labels?.includes('Posto Ipiranga Vila') || false);
            setPostoBRRodovia(dados.labels?.includes('Posto BR Rodovia') || false);
            setPostoTexacoNorte(dados.labels?.includes('Posto Texaco Norte') || false);
        }
    }

    async function salvar() {
        const postosVinculados = [];
        if (postoShellCentro) postosVinculados.push('Posto Shell Centro');
        if (postoIpirangaVila) postosVinculados.push('Posto Ipiranga Vila');
        if (postoBRRodovia) postosVinculados.push('Posto BR Rodovia');
        if (postoTexacoNorte) postosVinculados.push('Posto Texaco Norte');

        let data = { 
            id, 
            nome, 
            email, 
            telefone, 
            senha,
            labels: postosVinculados
        };
        data = JSON.stringify(data); //formata para mandar pro backend
        if (idParam == null) { //se nulo pq estou incluindo e uso post
            await axios
                .post(baseURL, data, {
                    headers: { 'Content-Type': 'application/json' },
                })
                .then(function (response) { //se 200, redireciona para a lista de gerentes
                    alert(`Gerente ${nome} cadastrado com sucesso!`);
                    navigate(`/empregados`);
                })
                .catch(function (error) { //se 400, mostra erro
                    alert('Erro ao cadastrar gerente: ' + (error.response?.data || error.message));
                });
        } else { //se nao esta nulo pq estou editando e uso put
            await axios
                .put(`${baseURL}/${idParam}`, data, {
                    headers: { 'Content-Type': 'application/json' },
                })
                .then(function (response) {
                    alert(`Gerente ${nome} alterado com sucesso!`);
                    navigate(`/empregados`);
                })
                .catch(function (error) {
                    alert('Erro ao alterar gerente: ' + (error.response?.data || error.message));
                });
        }
    }

    async function buscar() {
        if (idParam != null) {
            try {
                const response = await axios.get(`${baseURL}/${idParam}`); //get para buscar o dado
                setDados(response.data);
                setId(response.data.id);
                setNome(response.data.nome || '');
                setEmail(response.data.email || '');
                setTelefone(response.data.telefone || '');
                setSenha(response.data.senha || '');
                setPostoShellCentro(response.data.labels?.includes('Posto Shell Centro') || false);
                setPostoIpirangaVila(response.data.labels?.includes('Posto Ipiranga Vila') || false);
                setPostoBRRodovia(response.data.labels?.includes('Posto BR Rodovia') || false);
                setPostoTexacoNorte(response.data.labels?.includes('Posto Texaco Norte') || false);
            } catch (error) {
                console.error('Erro ao buscar gerente:', error);
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

    //if (!dados) return null; //se nao tem dado, retorna null e n renderiza a tela ate receber os dados

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
        description: {
            fontSize: '14px',
            color: 'rgb(113, 113, 130)',
            fontFamily: 'system-ui',
            marginTop: '4px',
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
        gridRow: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
        },
        postoCheckboxContainer: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
        },
        postoCheckboxContainerHover: {
            backgroundColor: '#f9fafb',
        },
        checkbox: {
            width: '16px',
            height: '16px',
            cursor: 'pointer',
            accentColor: '#000000',
        },
        postoCheckboxLabel: {
            fontSize: '14px',
            fontFamily: 'system-ui',
            fontWeight: '500',
            cursor: 'pointer',
            margin: 0,
            flex: 1,
        },
        postoCheckboxGrid: {
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
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
                    <h2 style={formStyles.title}>Cadastrar Gerente</h2>
                    <p style={formStyles.subtitle}>Preencha os dados do novo gerente</p>
                </div>
            </div>

            <div style={formStyles.cardContainer}>
                <Card title='Dados do Gerente'>
                    <div style={{ fontSize: '14px', color: 'rgb(113, 113, 130)', marginTop: '10px', marginBottom: '24px', fontFamily: 'system-ui' }}>
                        Gerentes supervisionam operações de postos específicos
                    </div>
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
                                        placeholder="Nome completo do gerente"
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
                                            placeholder="gerente@posto.com"
                                            required
                                            style={formStyles.input}
                                            className="card-pdv-input"
                                        />
                                    </div>
                                </div>
                                <div style={formStyles.fieldGroup}>
                                    <label htmlFor="telefone" style={formStyles.label}>
                                        Telefone
                                    </label>
                                    <div style={formStyles.inputWrapper}>
                                        <input
                                            type="tel"
                                            id="telefone"
                                            name="telefone"
                                            value={telefone}
                                            onChange={(e) => setTelefone(e.target.value)}
                                            placeholder="(00) 00000-0000"
                                            required
                                            style={formStyles.input}
                                            className="card-pdv-input"
                                        />
                                    </div>
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
                                <label style={formStyles.label}>Postos Vinculados</label>
                                <p style={formStyles.description}>Selecione os postos que este gerente supervisionará</p>
                                <div style={formStyles.postoCheckboxGrid}>
                                    <div 
                                        style={formStyles.postoCheckboxContainer}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                        onClick={() => setPostoShellCentro(!postoShellCentro)}
                                    >
                                        <input
                                            type="checkbox"
                                            id="postoShellCentro"
                                            checked={postoShellCentro}
                                            onChange={(e) => setPostoShellCentro(e.target.checked)}
                                            onClick={(e) => e.stopPropagation()}
                                            style={formStyles.checkbox}
                                        />
                                        <label htmlFor="postoShellCentro" style={formStyles.postoCheckboxLabel}>
                                            Posto Shell Centro
                                        </label>
                                    </div>
                                    <div 
                                        style={formStyles.postoCheckboxContainer}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                        onClick={() => setPostoIpirangaVila(!postoIpirangaVila)}
                                    >
                                        <input
                                            type="checkbox"
                                            id="postoIpirangaVila"
                                            checked={postoIpirangaVila}
                                            onChange={(e) => setPostoIpirangaVila(e.target.checked)}
                                            onClick={(e) => e.stopPropagation()}
                                            style={formStyles.checkbox}
                                        />
                                        <label htmlFor="postoIpirangaVila" style={formStyles.postoCheckboxLabel}>
                                            Posto Ipiranga Vila
                                        </label>
                                    </div>
                                    <div 
                                        style={formStyles.postoCheckboxContainer}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                        onClick={() => setPostoBRRodovia(!postoBRRodovia)}
                                    >
                                        <input
                                            type="checkbox"
                                            id="postoBRRodovia"
                                            checked={postoBRRodovia}
                                            onChange={(e) => setPostoBRRodovia(e.target.checked)}
                                            onClick={(e) => e.stopPropagation()}
                                            style={formStyles.checkbox}
                                        />
                                        <label htmlFor="postoBRRodovia" style={formStyles.postoCheckboxLabel}>
                                            Posto BR Rodovia
                                        </label>
                                    </div>
                                    <div 
                                        style={formStyles.postoCheckboxContainer}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                        onClick={() => setPostoTexacoNorte(!postoTexacoNorte)}
                                    >
                                        <input
                                            type="checkbox"
                                            id="postoTexacoNorte"
                                            checked={postoTexacoNorte}
                                            onChange={(e) => setPostoTexacoNorte(e.target.checked)}
                                            onClick={(e) => e.stopPropagation()}
                                            style={formStyles.checkbox}
                                        />
                                        <label htmlFor="postoTexacoNorte" style={formStyles.postoCheckboxLabel}>
                                            Posto Texaco Norte
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={formStyles.buttonGroup}>
                            <button
                                type="submit"
                                style={formStyles.buttonPrimary}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#333333'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = '#000000'}
                            >
                                {idParam ? 'Alterar Gerente' : 'Cadastrar Gerente'}
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

export default CadastroGerente;