import React from 'react';

import Card from '../components/card';

import { useNavigate } from 'react-router-dom';

import iconeColuna from '../icones/coluna.svg';
import iconeADM from '../icones/adm.svg';
import iconeAdd from '../icones/add.svg';
import iconeGerentes from '../icones/gerentes.svg';
import iconeFuncionarios from '../icones/funcionarios.svg';

import axios from 'axios';
import { BASE_URL } from '../config/axios';

const baseURLAdministradores = `${BASE_URL}/administradores`;
const baseURLGerentes = `${BASE_URL}/gerentes`;
const baseURLFuncionarios = `${BASE_URL}/funcionarios`;

function ListagemEmpregados({ toggleMenu }) {
    const navigate = useNavigate();
    const [dadosAdministradores, setDadosAdministradores] = React.useState([]);
    const [dadosGerentes, setDadosGerentes] = React.useState([]);
    const [dadosFuncionarios, setDadosFuncionarios] = React.useState([]);
    const [tipoSelecionado, setTipoSelecionado] = React.useState('administradores');

    const formatarCPF = (cpf) => {
        if (!cpf) return '';
        const cpfLimpo = String(cpf).replace(/\D/g, '');
        if (cpfLimpo.length === 11) {
            return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        }
        return cpfLimpo;
    };

    function handleEditar(id, tipo) {
        if (tipo === 'administradores') {
            navigate(`/cadastro-administradores/${id}`);
        } else if (tipo === 'gerentes') {
            navigate(`/cadastro-gerentes/${id}`);
        } else if (tipo === 'funcionarios') {
            navigate(`/cadastro-funcionarios/${id}`);
        }
    }

    async function handleExcluir(id, tipo, nome) {
        if (!window.confirm(`Tem certeza que deseja excluir ${nome}?`)) {
            return;
        }

        let url = '';
        if (tipo === 'administradores') {
            url = `${baseURLAdministradores}/${id}`;
        } else if (tipo === 'gerentes') {
            url = `${baseURLGerentes}/${id}`;
        } else if (tipo === 'funcionarios') {
            url = `${baseURLFuncionarios}/${id}`;
        }

        try {
            await axios.delete(url);
            alert(`${nome} excluído com sucesso!`);
            if (tipo === 'administradores') {
                setDadosAdministradores(dadosAdministradores.filter(item => item.id !== id));
            } else if (tipo === 'gerentes') {
                setDadosGerentes(dadosGerentes.filter(item => item.id !== id));
            } else if (tipo === 'funcionarios') {
                setDadosFuncionarios(dadosFuncionarios.filter(item => item.id !== id));
            }
        } catch (error) {
            alert('Erro ao excluir: ' + (error.response?.data || error.message));
        }
    }

    React.useEffect(() => {
        const postoId = localStorage.getItem('postoSelecionadoId');
        
        const queryParam = `?id_posto=${postoId}`;
        
        axios.get(`${baseURLAdministradores}${queryParam}`)
            .then(function (response) {
                console.log('Administradores:', response.data);
                setDadosAdministradores(Array.isArray(response.data) ? response.data : []);
            })
            .catch(function (error) {
                console.error('Erro ao buscar administradores:', error);
            });

        axios.get(`${baseURLGerentes}${queryParam}`)
            .then(function (response) {
                console.log('Gerentes:', response.data);
                setDadosGerentes(Array.isArray(response.data) ? response.data : []);
            })
            .catch(function (error) {
                console.error('Erro ao buscar gerentes:', error);
            });

        axios.get(`${baseURLFuncionarios}${queryParam}`)
            .then(function (response) {
                console.log('Funcionários:', response.data);
                setDadosFuncionarios(Array.isArray(response.data) ? response.data : []);
            })
            .catch(function (error) {
                console.error('Erro ao buscar funcionários:', error);
            });
    }, []);

    const renderizarCard = () => {
        if (tipoSelecionado === 'administradores') {
            return (
                <Card
                    title='Administradores'
                    iconeTitle={iconeADM}
                    botaoHeader={
                        <button type='button' className='textoCadastro btn d-flex align-items-center' onClick={() => navigate('/cadastro-administradores')}>
                            <img src={iconeAdd} alt="" width="16" height="16" className='me-2' />
                            Cadastrar Administrador
                        </button>
                    }
                >
                    <div className='row'>
                        <div className='col-md-12'>
                        <div className='bs-component'>
                                <table className='table table-hover' style={{ borderCollapse: 'collapse' }}>
                                    <tbody>
                                        {dadosAdministradores.length === 0 ? (
                                            <tr>
                                                <td colSpan="2" style={{ border: 'none', padding: '12px' }}>Nenhum administrador encontrado</td>
                                            </tr>
                                        ) : (
                                            dadosAdministradores.map((dado) => (
                                                <tr key={dado.id} style={{ border: 'none' }}>
                                                    <td style={{ border: 'none', padding: '12px' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                                                            <span style={{ fontWeight: 500 }}>{dado.nome}</span>
                                                            <span style={{ fontSize: '14px', color: '#666' }}>{dado.email}</span>
                                                        </div>
                                                    </td>
                                                    <td className='text-end' style={{ border: 'none', padding: '12px' }}>
                                                        <div className='d-flex justify-content-end gap-2 flex-wrap align-items-center'>
                                                            {dado.labels && dado.labels.map((label, index) => (
                                                                <span key={index} className='label-badge'>{label}</span>
                                                            ))}
                                                            <div style={{ display: 'flex', gap: '8px', marginLeft: '12px' }}>
                                                                <button
                                                                    type='button'
                                                                    onClick={() => handleEditar(dado.id, 'administradores')}
                                                                    style={{
                                                                        background: 'none',
                                                                        border: 'none',
                                                                        cursor: 'pointer',
                                                                        padding: '4px',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        borderRadius: '4px',
                                                                        transition: 'background-color 0.2s'
                                                                    }}
                                                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(243, 243, 245)'}
                                                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                                    title="Editar"
                                                                >
                                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                                    </svg>
                                                                </button>
                                                                <button
                                                                    type='button'
                                                                    onClick={() => handleExcluir(dado.id, 'administradores', dado.nome)}
                                                                    style={{
                                                                        background: 'none',
                                                                        border: 'none',
                                                                        cursor: 'pointer',
                                                                        padding: '4px',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        borderRadius: '4px',
                                                                        transition: 'background-color 0.2s',
                                                                        color: '#dc2626'
                                                                    }}
                                                                    onMouseEnter={(e) => {
                                                                        e.currentTarget.style.backgroundColor = '#fee2e2';
                                                                        e.currentTarget.style.color = '#b91c1c';
                                                                    }}
                                                                    onMouseLeave={(e) => {
                                                                        e.currentTarget.style.backgroundColor = 'transparent';
                                                                        e.currentTarget.style.color = '#dc2626';
                                                                    }}
                                                                    title="Excluir"
                                                                >
                                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                        <polyline points="3 6 5 6 21 6"></polyline>
                                                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </Card>
            );
        } else if (tipoSelecionado === 'gerentes') {
            return (
                <Card
                    title='Gerentes'
                    iconeTitle={iconeGerentes}
                    botaoHeader={
                        <button type='button' className='textoCadastro btn d-flex align-items-center' onClick={() => navigate('/cadastro-gerentes')}>
                            <img src={iconeAdd} alt="" width="16" height="16" className='me-2' />
                            Cadastrar Gerente
                        </button>
                    }
                >
                    <div className='row'>
                        <div className='col-md-12'>
                        <div className='bs-component'>
                                <table className='table table-hover' style={{ borderCollapse: 'collapse' }}>
                                    <tbody>
                                    {dadosGerentes.length === 0 ? (
                                            <tr>
                                                <td colSpan="1" style={{ border: 'none', padding: '12px' }}>Nenhum gerente encontrado</td>
                                            </tr>
                                        ) : (
                                            dadosGerentes.map((dado) => (
                                                <tr key={dado.id} style={{ border: 'none' }}>
                                                    <td style={{ border: 'none', padding: '12px' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                                                            <span style={{ fontWeight: 500 }}>{dado.nome}</span>
                                                            <span style={{ fontSize: '14px', color: '#666' }}>{dado.email}</span>
                                                            {dado.telefone && (
                                                                <>
                                                                    <span style={{ fontSize: '14px', color: '#999' }}>•</span>
                                                                    <span style={{ fontSize: '14px', color: '#666' }}>{dado.telefone}</span>
                                                                </>
                                                            )}
                                                            {dado.labels && dado.labels.length > 0 && (
                                                                <>
                                                                    <span style={{ fontSize: '14px', color: '#999' }}>•</span>
                                                                    {dado.labels.map((label, index) => (
                                                                        <span key={index} className='label-badge-gerente'>{label}</span>
                                                                    ))}
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className='text-end' style={{ border: 'none', padding: '12px' }}>
                                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center' }}>
                                                            <button
                                                                type='button'
                                                                onClick={() => handleEditar(dado.id, 'gerentes')}
                                                                style={{
                                                                    background: 'none',
                                                                    border: 'none',
                                                                    cursor: 'pointer',
                                                                    padding: '4px',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    borderRadius: '4px',
                                                                    transition: 'background-color 0.2s'
                                                                }}
                                                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(243, 243, 245)'}
                                                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                                title="Editar"
                                                            >
                                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                                </svg>
                                                            </button>
                                                            <button
                                                                type='button'
                                                                onClick={() => handleExcluir(dado.id, 'gerentes', dado.nome)}
                                                                style={{
                                                                    background: 'none',
                                                                    border: 'none',
                                                                    cursor: 'pointer',
                                                                    padding: '4px',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    borderRadius: '4px',
                                                                    transition: 'background-color 0.2s',
                                                                    color: '#dc2626'
                                                                }}
                                                                onMouseEnter={(e) => {
                                                                    e.currentTarget.style.backgroundColor = '#fee2e2';
                                                                    e.currentTarget.style.color = '#b91c1c';
                                                                }}
                                                                onMouseLeave={(e) => {
                                                                    e.currentTarget.style.backgroundColor = 'transparent';
                                                                    e.currentTarget.style.color = '#dc2626';
                                                                }}
                                                                title="Excluir"
                                                            >
                                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                    <polyline points="3 6 5 6 21 6"></polyline>
                                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </Card>
            );
        } else {
            return (
                <Card
                    title='Funcionários'
                    iconeTitle={iconeFuncionarios}
                    botaoHeader={
                        <button type='button' className='textoCadastro btn d-flex align-items-center' onClick={() => navigate('/cadastro-funcionarios')}>
                            <img src={iconeAdd} alt="" width="16" height="16" className='me-2' />
                            Cadastrar Funcionário
                        </button>
                    }
                >
                    <div className='row'>
                        <div className='col-md-12'>
                        <div className='bs-component'>
                                <table className='table table-hover' style={{ borderCollapse: 'collapse' }}>
                                    <tbody>
                                        {dadosFuncionarios.length === 0 ? (
                                            <tr>
                                                <td colSpan="2" style={{ border: 'none', padding: '12px' }}>Nenhum funcionário encontrado</td>
                                            </tr>
                                        ) : (
                                            dadosFuncionarios.map((dado) => (
                                                <tr key={dado.id} style={{ border: 'none' }}>
                                                    <td style={{ border: 'none', padding: '12px' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                                                            <span style={{ fontWeight: 500 }}>{dado.nome}</span>
                                                            {dado.cpf ? (
                                                                <>
                                                                    <span style={{ fontSize: '14px', color: '#999' }}>•</span>
                                                                    <span style={{ fontSize: '14px', color: '#666' }}>CPF: {formatarCPF(dado.cpf)}</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <span style={{ fontSize: '14px', color: '#999' }}>•</span>
                                                                    <span style={{ fontSize: '14px', color: '#999' }}>CPF não informado</span>
                                                                </>
                                                            )}
                                                            {dado.postoDeTrabalho && (
                                                                <>
                                                                    <span style={{ fontSize: '14px', color: '#999' }}>•</span>
                                                                    <span style={{ fontSize: '14px', color: '#666' }}>{dado.postoDeTrabalho}</span>
                                                                </>
                                                            )}
                                                            {dado.labels && dado.labels.length > 0 && (
                                                                <>
                                                                    <span style={{ fontSize: '14px', color: '#999' }}>•</span>
                                                                    {dado.labels.map((label, index) => (
                                                                        <span key={index} className='label-badge-gerente'>{label}</span>
                                                                    ))}
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className='text-end td-gerentes-labels' style={{ border: 'none', padding: '12px' }}>
                                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center' }}>
                                                            <button
                                                                type='button'
                                                                onClick={() => handleEditar(dado.id, 'funcionarios')}
                                                                style={{
                                                                    background: 'none',
                                                                    border: 'none',
                                                                    cursor: 'pointer',
                                                                    padding: '4px',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    borderRadius: '4px',
                                                                    transition: 'background-color 0.2s'
                                                                }}
                                                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(243, 243, 245)'}
                                                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                                title="Editar"
                                                            >
                                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                                </svg>
                                                            </button>
                                                            <button
                                                                type='button'
                                                                onClick={() => handleExcluir(dado.id, 'funcionarios', dado.nome)}
                                                                style={{
                                                                    background: 'none',
                                                                    border: 'none',
                                                                    cursor: 'pointer',
                                                                    padding: '4px',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    borderRadius: '4px',
                                                                    transition: 'background-color 0.2s',
                                                                    color: '#dc2626'
                                                                }}
                                                                onMouseEnter={(e) => {
                                                                    e.currentTarget.style.backgroundColor = '#fee2e2';
                                                                    e.currentTarget.style.color = '#b91c1c';
                                                                }}
                                                                onMouseLeave={(e) => {
                                                                    e.currentTarget.style.backgroundColor = 'transparent';
                                                                    e.currentTarget.style.color = '#dc2626';
                                                                }}
                                                                title="Excluir"
                                                            >
                                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                    <polyline points="3 6 5 6 21 6"></polyline>
                                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </Card>
            );
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '20px' }}>
                <div className='container-icone-coluna' onClick={toggleMenu}>
                    <img src={iconeColuna} alt="Coluna" width="16" height="16" />
                </div>
                <span className='textoDashboard'>Dashboard - {localStorage.getItem('postoSelecionado') || 'Posto Ipiranga Vila'}</span>
            </div>
            <h1 className='textoTitulo'>Gerenciamento de Empregados</h1>
            <h1 className='textoSubtitulo'>Gerencie administradores, gerentes e funcionários</h1>

            <div style={{ width: '100%', marginTop: '12px', marginBottom: '24px' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: 'rgb(243, 243, 245)',
                    borderRadius: '16px',
                    padding: '3px',
                    gap: '3px'
                }}>
                    <button
                        type='button'
                        onClick={() => setTipoSelecionado('administradores')}
                        style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            padding: '8px 12px',
                            borderRadius: '16px',
                            border: 'none',
                            backgroundColor: tipoSelecionado === 'administradores' ? '#ffffff' : 'transparent',
                            color: tipoSelecionado === 'administradores' ? '#0f172a' : 'rgb(113, 113, 130)',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            fontFamily: 'system-ui'
                        }}
                    >
                        <img src={iconeADM} alt="" width="16" height="16" />
                        Administradores
                    </button>
                    <button
                        type='button'
                        onClick={() => setTipoSelecionado('gerentes')}
                        style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            padding: '8px 12px',
                            borderRadius: '16px',
                            border: 'none',
                            backgroundColor: tipoSelecionado === 'gerentes' ? '#ffffff' : 'transparent',
                            color: tipoSelecionado === 'gerentes' ? '#0f172a' : 'rgb(113, 113, 130)',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            fontFamily: 'system-ui'
                        }}
                    >
                        <img src={iconeGerentes} alt="" width="16" height="16" />
                        Gerentes
                    </button>
                    <button
                        type='button'
                        onClick={() => setTipoSelecionado('funcionarios')}
                        style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            padding: '8px 12px',
                            borderRadius: '16px',
                            border: 'none',
                            backgroundColor: tipoSelecionado === 'funcionarios' ? '#ffffff' : 'transparent',
                            color: tipoSelecionado === 'funcionarios' ? '#0f172a' : 'rgb(113, 113, 130)',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            fontFamily: 'system-ui'
                        }}
                    >
                        <img src={iconeFuncionarios} alt="" width="16" height="16" />
                        Funcionários
                    </button>
                </div>
            </div>

            {renderizarCard()}
        </div>
    );
}

export default ListagemEmpregados;