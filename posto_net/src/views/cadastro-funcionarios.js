import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Card from '../components/card';
import iconeColuna from '../icones/coluna.svg';

import { listarPostos } from '../services/postoService';
import { buscarFuncionario, criarFuncionario, atualizarFuncionario } from '../services/funcionarioService';
import CampoMatricula from '../components/campo-matricula';

function CadastroFuncionario({ toggleMenu }) {
    const { idParam } = useParams();

    const navigate = useNavigate();

    const [id, setId] = useState('');
    const [nome, setNome] = useState('');
    const [matricula, setMatricula] = useState('');
    const [matriculaDisponivel, setMatriculaDisponivel] = useState(null);
    const [sobrenome, setSobrenome] = useState('');
    const [cpf, setCpf] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [senha, setSenha] = useState('');
    const [erroFormulario, setErroFormulario] = useState('');
    const [cargo, setCargo] = useState('');
    const [postoDeTrabalho, setPostoDeTrabalho] = useState('');
    const [postos, setPostos] = useState([]);

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
        const nomeCompleto = `${nome} ${sobrenome}`.trim();
        const labels = cargo ? [cargo] : [];

        const data = {
            id, 
            matricula,
            idPosto: postoDeTrabalho || postoId,
            nome: nomeCompleto,
            cpf,
            email,
            telefone,
            senha,
            salario: 1,
            setor: cargo,
            cargoApi: 'COLABORADOR',
            labels
        };
        try {
            if (idParam == null) {
                await criarFuncionario(data, 'funcionarios');
                alert(`Funcionário ${nomeCompleto} cadastrado com sucesso!`);
            } else {
                await atualizarFuncionario(idParam, data, 'funcionarios');
                alert(`Funcionário ${nomeCompleto} alterado com sucesso!`);
            }
            navigate('/empregados');
        } catch (error) {
            const resposta = error.response?.data;
            setErroFormulario(
                typeof resposta === 'string'
                    ? resposta
                    : resposta?.mensagem || resposta?.message || 'Não foi possível salvar o funcionário.'
            );
        }
        /* eslint-disable no-unreachable */
        return;

        if (idParam == null) {
            await criarFuncionario(data, 'funcionarios')
                .then(function (response) {
                    alert(`Funcionário ${nomeCompleto} cadastrado com sucesso!`);
                    navigate(`/empregados`);
                })
                .catch(function (error) {
                    alert('Erro ao cadastrar funcionário: ' + (error.response?.data || error.message));
                });
        } else {
            await atualizarFuncionario(idParam, data, 'funcionarios')
                .then(function (response) {
                    alert(`Funcionário ${nomeCompleto} alterado com sucesso!`);
                    navigate(`/empregados`);
                })
                .catch(function (error) {
                    alert('Erro ao alterar funcionário: ' + (error.response?.data || error.message));
                });
        }
    }

    /* eslint-enable no-unreachable */

    const buscar = useCallback(async () => {
        if (idParam != null) {
            try {
                const response = await buscarFuncionario(idParam);
                setId(response.id);
                setMatricula(response.maticula || '');
                const nomeParts = response.nome ? response.nome.split(' ') : [];
                setNome(nomeParts[0] || '');
                setSobrenome(nomeParts.slice(1).join(' ') || '');
                setCpf(response.cpf || '');
                setEmail(response.email || '');
                setTelefone(response.telefone || '');
                setSenha('');
                setCargo(response.setor || (response.labels && response.labels.length > 0 ? response.labels[0] : ''));
                setPostoDeTrabalho(response.idPosto || '');
            } catch (error) {
                console.error('Erro ao buscar funcionário:', error);
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
            setSobrenome('');
            setCpf('');
            setEmail('');
            setTelefone('');
            setSenha('');
            setCargo('');
            setPostoDeTrabalho('');
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
        'Supervisor',
        'Outro'
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
                            {erroFormulario && (
                                <p role="alert" style={{ margin: 0, padding: '10px 12px', borderRadius: '8px', backgroundColor: '#fef2f2', color: '#b91c1c', fontSize: '14px', fontFamily: 'system-ui' }}>
                                    {erroFormulario}
                                </p>
                            )}
                            <CampoMatricula value={matricula} onChange={setMatricula} onDisponibilidade={setMatriculaDisponivel} labelStyle={formStyles.label} wrapperStyle={formStyles.inputWrapper} style={formStyles.input} />
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
                                            onChange={(e) => setNome(e.target.value)}
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

                            <div style={formStyles.gridRow}>
                                <div style={formStyles.fieldGroup}>
                                    <label htmlFor="email" style={formStyles.label}>E-mail</label>
                                    <div style={formStyles.inputWrapper}>
                                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="funcionario@posto.com" required style={formStyles.input} className="card-pdv-input" />
                                    </div>
                                </div>
                                <div style={formStyles.fieldGroup}>
                                    <label htmlFor="telefone" style={formStyles.label}>Telefone</label>
                                    <div style={formStyles.inputWrapper}>
                                        <input type="tel" id="telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="(00) 00000-0000" required style={formStyles.input} className="card-pdv-input" />
                                    </div>
                                </div>
                            </div>

                            <div style={formStyles.fieldGroup}>
                                <label htmlFor="senha" style={formStyles.label}>Senha</label>
                                <div style={formStyles.inputWrapper}>
                                    <input type="password" id="senha" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Mínimo de 8 caracteres" minLength="8" required={idParam == null} style={formStyles.input} className="card-pdv-input" />
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
                                    Setor / Função
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
                                        <option value="">Selecione o setor</option>
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
                                            <option key={posto.id} value={posto.id}>
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
