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

    React.useEffect(() => {
        axios.get(baseURLAdministradores)
            .then(function (response) {
                console.log('Administradores:', response.data);
                setDadosAdministradores(Array.isArray(response.data) ? response.data : []);
            })
            .catch(function (error) {
                console.error('Erro ao buscar administradores:', error);
            });

        axios.get(baseURLGerentes)
            .then(function (response) {
                console.log('Gerentes:', response.data);
                setDadosGerentes(Array.isArray(response.data) ? response.data : []);
            })
            .catch(function (error) {
                console.error('Erro ao buscar gerentes:', error);
            });

        axios.get(baseURLFuncionarios)
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
                                <table className='table table-hover'>
                                    <tbody>
                                        {dadosAdministradores.length === 0 ? (
                                            <tr>
                                                <td colSpan="2">Nenhum administrador encontrado</td>
                                            </tr>
                                        ) : (
                                            dadosAdministradores.map((dado) => (
                                                <tr key={dado.id}>
                                                    <td>
                                                        <div>
                                                            <div style={{ fontWeight: 500, marginBottom: '4px' }}>{dado.nome}</div>
                                                            <div style={{ fontSize: '14px', color: '#666' }}>{dado.email}</div>
                                                        </div>
                                                    </td>
                                                    <td className='text-end'>
                                                        <div className='d-flex justify-content-end gap-2 flex-wrap'>
                                                            {dado.labels && dado.labels.map((label, index) => (
                                                                <span key={index} className='label-badge'>{label}</span>
                                                            ))}
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
                                <table className='table table-hover'>
                                    <tbody>
                                        {dadosGerentes.length === 0 ? (
                                            <tr>
                                                <td colSpan="2">Nenhum gerente encontrado</td>
                                            </tr>
                                        ) : (
                                            dadosGerentes.map((dado) => (
                                                <tr key={dado.id}>
                                                    <td>
                                                        <div>
                                                            <div style={{ fontWeight: 500, marginBottom: '4px' }}>{dado.nome}</div>
                                                            <div style={{ fontSize: '14px', color: '#666' }}>{dado.email}</div>
                                                            {dado.telefone && <div style={{ fontSize: '14px', color: '#666' }}>{dado.telefone}</div>}
                                                        </div>
                                                    </td>
                                                    <td className='text-end td-gerentes-labels'>
                                                        <div className='d-flex justify-content-end flex-column labels-gerentes'>
                                                            {dado.labels && dado.labels.map((label, index) => (
                                                                <span key={index} className='label-badge-gerente'>{label}</span>
                                                            ))}
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
                                <table className='table table-hover'>
                                    <tbody>
                                        {dadosFuncionarios.length === 0 ? (
                                            <tr>
                                                <td colSpan="2">Nenhum funcionário encontrado</td>
                                            </tr>
                                        ) : (
                                            dadosFuncionarios.map((dado) => (
                                                <tr key={dado.id}>
                                                    <td>
                                                        <div>
                                                            <div style={{ fontWeight: 500, marginBottom: '4px' }}>{dado.nome}</div>
                                                            {dado.cpf ? (
                                                                <div style={{ fontSize: '14px', color: '#666' }}>CPF: {formatarCPF(dado.cpf)}</div>
                                                            ) : (
                                                                <div style={{ fontSize: '14px', color: '#999' }}>CPF não informado</div>
                                                            )}
                                                            {dado.postoDeTrabalho && (
                                                                <div style={{ fontSize: '14px', color: '#666' }}>{dado.postoDeTrabalho}</div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className='text-end td-gerentes-labels'>
                                                        <div className='d-flex justify-content-end flex-column labels-gerentes'>
                                                            {dado.labels && dado.labels.map((label, index) => (
                                                                <span key={index} className='label-badge-gerente'>{label}</span>
                                                            ))}
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
                <span className='textoDashboard'>Dashboard - Posto Ipiranga Vila</span>
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