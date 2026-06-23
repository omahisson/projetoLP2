import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Card from '../components/card';
import iconeColuna from '../icones/coluna.svg';

import { listarPostos } from '../services/postoService';
import { buscarFuncionario, criarFuncionario, atualizarFuncionario } from '../services/funcionarioService';
import CampoMatricula from '../components/campo-matricula';

function CadastroGerente({ toggleMenu }) {
    const { idParam } = useParams();

    const navigate = useNavigate();

    const [id, setId] = useState('');
    const [nome, setNome] = useState('');
    const [matricula, setMatricula] = useState('');
    const [matriculaDisponivel, setMatriculaDisponivel] = useState(null);
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [cpf, setCpf] = useState('');
    const [senha, setSenha] = useState('');
    const [erroFormulario, setErroFormulario] = useState('');
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

    async function salvar() {
        setErroFormulario('');
        if (idParam == null && matriculaDisponivel !== true) {
            setErroFormulario('Informe uma matrícula disponível antes de salvar.');
            return;
        }
        const postoId = localStorage.getItem('postoSelecionadoId');
        const data = {
            id, 
            matricula,
            idPosto: postosSelecionados[0] || postoId,
            nome, 
            email, 
            telefone, 
            cpf,
            senha,
            setor: 'Gerencia',
            cargoApi: 'GERENTE',
            salario: 1,
            bonusMeta: 1,
            postosVinculados: postosSelecionados,
            labels: postosSelecionados
        };
        try {
            if (idParam == null) {
                await criarFuncionario(data, 'gerentes');
                alert(`Gerente ${nome} cadastrado com sucesso!`);
            } else {
                await atualizarFuncionario(idParam, data, 'gerentes');
                alert(`Gerente ${nome} alterado com sucesso!`);
            }
            navigate('/empregados');
        } catch (error) {
            const resposta = error.response?.data;
            setErroFormulario(
                typeof resposta === 'string'
                    ? resposta
                    : resposta?.mensagem || resposta?.message || 'Não foi possível salvar o gerente.'
            );
        }
    }

    const buscar = useCallback(async () => {
        if (idParam != null) {
            try {
                const response = await buscarFuncionario(idParam);
                setId(response.id);
                setNome(response.nome || '');
                setMatricula(response.maticula || '');
                setEmail(response.email || '');
                setTelefone(response.telefone || '');
                setCpf(response.cpf || '');
                setSenha(response.senha || '');
                const postosVinculados = response.postosVinculados?.length
                    ? response.postosVinculados
                    : response.idPosto ? [response.idPosto] : [];
                setPostosSelecionados(postosVinculados);
            } catch (error) {
                console.error('Erro ao buscar gerente:', error);
            }
        }
    }, [idParam]);

    useEffect(() => {
        if (idParam) {
            buscar();
        } else {
            setId('');
            setNome('');
            setMatricula('');
            setEmail('');
            setTelefone('');
            setCpf('');
            setSenha('');
            setPostosSelecionados([]);
        }
    }, [idParam, buscar]);

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
                            {erroFormulario && (
                                <p role="alert" style={{ margin: 0, padding: '10px 12px', borderRadius: '8px', backgroundColor: '#fef2f2', color: '#b91c1c', fontSize: '14px', fontFamily: 'system-ui' }}>
                                    {erroFormulario}
                                </p>
                            )}
                            <CampoMatricula value={matricula} onChange={setMatricula} onDisponibilidade={setMatriculaDisponivel} labelStyle={formStyles.label} wrapperStyle={formStyles.inputWrapper} style={formStyles.input} />
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
                                        onChange={(e) => setNome(e.target.value)}
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
                                <label htmlFor="cpf" style={formStyles.label}>CPF</label>
                                <div style={formStyles.inputWrapper}>
                                    <input
                                        type="text"
                                        id="cpf"
                                        name="cpf"
                                        value={cpf}
                                        onChange={(e) => setCpf(e.target.value)}
                                        placeholder="000.000.000-00"
                                        required
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
                                        required={idParam == null}
                                        style={formStyles.input}
                                        className="card-pdv-input"
                                    />
                                </div>
                            </div>

                            <div style={formStyles.fieldGroup}>
                                <label style={formStyles.label}>Postos Vinculados</label>
                                <p style={formStyles.description}>Selecione os postos que este gerente supervisionará</p>
                                <div style={formStyles.postoCheckboxGrid}>
                                    {postos.map((p) => {
                                        const marcado = postosSelecionados.includes(p.id);
                                        return (
                                            <div 
                                                key={p.id} 
                                                style={formStyles.postoCheckboxContainer}
                                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                onClick={() => {
                                                    const novo = marcado
                                                        ? postosSelecionados.filter(n => n !== p.id)
                                                        : [...postosSelecionados, p.id];
                                                    setPostosSelecionados(novo);
                                                }}
                                            >
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
                                                    onClick={(e) => e.stopPropagation()}
                                                    style={formStyles.checkbox}
                                                />
                                                <label htmlFor={`posto_${p.id}`} style={formStyles.postoCheckboxLabel}>
                                                    {p.nomeFantasia || p.nome}
                                                </label>
                                            </div>
                                        );
                                    })}
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
