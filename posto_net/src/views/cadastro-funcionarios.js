import React, { useState, useEffect } from 'react'; //redireciona rotas e guarda variaveis
import { useNavigate, useParams } from 'react-router-dom'; //navega entre rotas e pega parametros na url

import Card from '../components/card';
import iconeColuna from '../icones/coluna.svg';

import axios from 'axios';
import { BASE_URL } from '../config/axios';

function CadastroFuncionario({ toggleMenu }) {
    const { idParam } = useParams(); //pega o parametro da url

    const navigate = useNavigate();

    const baseURL = `${BASE_URL}/funcionarios`;

    //criou um campo para cada campo que ta na tela
    const [id, setId] = useState('');
    const [nome, setNome] = useState('');
    const [sobrenome, setSobrenome] = useState('');
    const [cpf, setCpf] = useState('');
    const [cargo, setCargo] = useState('');
    const [postoDeTrabalho, setPostoDeTrabalho] = useState('');
    const [postos, setPostos] = useState([]);

    const [dados, setDados] = React.useState([]); //volta pro dado original

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

    function inicializar() {
        if (idParam == null) { //se nulo pq estou incluindo
            setId('');
            setNome('');
            setSobrenome('');
            setCpf('');
            setCargo('');
            setPostoDeTrabalho('');
        } else {
            setId(dados.id);
            setNome(dados.nome ? dados.nome.split(' ')[0] : '');
            setSobrenome(dados.nome ? dados.nome.split(' ').slice(1).join(' ') : '');
            setCpf(dados.cpf || '');
            setCargo(dados.labels && dados.labels.length > 0 ? dados.labels[0] : '');
            setPostoDeTrabalho(dados.postoDeTrabalho || '');
        }
    }

    async function salvar() {
        const postoId = localStorage.getItem('postoSelecionadoId');
        const nomeCompleto = `${nome} ${sobrenome}`.trim();
        const labels = cargo ? [cargo] : [];

        let data = { 
            id, 
            id_posto: postoId,
            nome: nomeCompleto,
            cpf,
            postoDeTrabalho,
            labels,
            value: id || Date.now(),
            text: nomeCompleto
        };
        data = JSON.stringify(data);
        if (idParam == null) {
            await axios
                .post(baseURL, data, {
                    headers: { 'Content-Type': 'application/json' },
                })
                .then(function (response) {
                    alert(`Funcionário ${nomeCompleto} cadastrado com sucesso!`);
                    navigate(`/empregados`);
                })
                .catch(function (error) {
                    alert('Erro ao cadastrar funcionário: ' + (error.response?.data || error.message));
                });
        } else {
            await axios
                .put(`${baseURL}/${idParam}`, data, {
                    headers: { 'Content-Type': 'application/json' },
                })
                .then(function (response) {
                    alert(`Funcionário ${nomeCompleto} alterado com sucesso!`);
                    navigate(`/empregados`);
                })
                .catch(function (error) {
                    alert('Erro ao alterar funcionário: ' + (error.response?.data || error.message));
                });
        }
    }

    async function buscar() {
        if (idParam != null) {
            try {
                const response = await axios.get(`${baseURL}/${idParam}`); //get para buscar o dado
                setDados(response.data);
                setId(response.data.id);
                const nomeParts = response.data.nome ? response.data.nome.split(' ') : [];
                setNome(nomeParts[0] || '');
                setSobrenome(nomeParts.slice(1).join(' ') || '');
                setCpf(response.data.cpf || '');
                setCargo(response.data.labels && response.data.labels.length > 0 ? response.data.labels[0] : '');
                setPostoDeTrabalho(response.data.postoDeTrabalho || '');
            } catch (error) {
                console.error('Erro ao buscar funcionário:', error);
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
        selectWrapper: {
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'rgb(243, 243, 245)',
            borderRadius: '8px',
            padding: '0 12px',
            minHeight: '40px',
            cursor: 'pointer',
        },
        select: {
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
            cursor: 'pointer',
            appearance: 'none',
            backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'m6 9 6 6 6-6\'%3E%3C/path%3E%3C/svg%3E")',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 8px center',
            backgroundSize: '16px',
            paddingRight: '32px',
        },
        gridRow: {
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

    const cargos = [
        'Frentista',
        'Caixa',
        'Gerente de Turno',
        'Auxiliar de Limpeza',
        'Mecânico',
        'Vendedor',
        'Supervisor'
    ];

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
                    <h2 style={formStyles.title}>Cadastrar Funcionário</h2>
                    <p style={formStyles.subtitle}>Preencha os dados do novo funcionário</p>
                </div>
            </div>

            <div style={formStyles.cardContainer}>
                <Card title='Dados do Funcionário'>
                    <div style={{ fontSize: '14px', color: 'rgb(113, 113, 130)', marginTop: '10px', marginBottom: '24px', fontFamily: 'system-ui' }}>
                        Funcionários executam operações diárias nos postos
                    </div>
                    <form onSubmit={(e) => { e.preventDefault(); salvar(); }}>
                        <div style={formStyles.form}>
                            <div style={formStyles.gridRow}>
                                <div style={formStyles.fieldGroup}>
                                    <label htmlFor="nome" style={formStyles.label}>
                                        Nome
                                    </label>
                                    <div style={formStyles.inputWrapper}>
                                        <input
                                            type="text"
                                            id="nome"
                                            name="nome"
                                            value={nome}
                                            onChange={(e) => setNome(e.target.value)} //quando o campo mudar, renderizo a tela novamente
                                            placeholder="Nome do funcionário"
                                            required
                                            style={formStyles.input}
                                            className="card-pdv-input"
                                        />
                                    </div>
                                </div>
                                <div style={formStyles.fieldGroup}>
                                    <label htmlFor="sobrenome" style={formStyles.label}>
                                        Sobrenome
                                    </label>
                                    <div style={formStyles.inputWrapper}>
                                        <input
                                            type="text"
                                            id="sobrenome"
                                            name="sobrenome"
                                            value={sobrenome}
                                            onChange={(e) => setSobrenome(e.target.value)}
                                            placeholder="Sobrenome do funcionário"
                                            required
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
                                        required
                                        style={formStyles.input}
                                        className="card-pdv-input"
                                    />
                                </div>
                            </div>

                            <div style={formStyles.fieldGroup}>
                                <label htmlFor="cargo" style={formStyles.label}>
                                    Cargo
                                </label>
                                <div style={formStyles.selectWrapper}>
                                    <select
                                        id="cargo"
                                        name="cargo"
                                        value={cargo}
                                        onChange={(e) => setCargo(e.target.value)}
                                        required
                                        style={formStyles.select}
                                    >
                                        <option value="">Selecione o cargo</option>
                                        {cargos.map((cargoOption) => (
                                            <option key={cargoOption} value={cargoOption}>
                                                {cargoOption}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div style={formStyles.fieldGroup}>
                                <label htmlFor="postoDeTrabalho" style={formStyles.label}>
                                    Posto de Trabalho
                                </label>
                                <div style={formStyles.selectWrapper}>
                                    <select
                                        id="postoDeTrabalho"
                                        name="postoDeTrabalho"
                                        value={postoDeTrabalho}
                                        onChange={(e) => setPostoDeTrabalho(e.target.value)}
                                        required
                                        style={formStyles.select}
                                    >
                                        <option value="">Selecione o posto</option>
                                        {postos.map((posto) => (
                                            <option key={posto.id} value={posto.nomeFantasia}>
                                                {posto.nomeFantasia}
                                            </option>
                                        ))}
                                    </select>
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
                                {idParam ? 'Alterar Funcionário' : 'Cadastrar Funcionário'}
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

export default CadastroFuncionario;