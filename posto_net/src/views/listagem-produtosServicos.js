import React from 'react';
import Card from '../components/card';
import { useNavigate } from 'react-router-dom';
import iconeColuna from '../icones/coluna.svg';
import iconeServicos from '../icones/servicos.svg';
import iconeProdutos from '../icones/produtos.svg';
import iconeAdd from '../icones/add.svg';
import axios from 'axios';
import { BASE_URL } from '../config/axios';

const baseURLServicos = `${BASE_URL}/servicos`;
const baseURLProdutos = `${BASE_URL}/produtos`;

function ListagemServicosProdutos({ toggleMenu }) {
    const navigate = useNavigate();
    const [dadosServicos, setDadosServicos] = React.useState([]);
    const [dadosProdutos, setDadosProdutos] = React.useState([]);
    const [tipoSelecionado, setTipoSelecionado] = React.useState('servicos');

    const formatarValor = (valor) => {
        if (!valor) return 'R$ 0,00';
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    };

    function handleEditar(id, tipo) {
        if (tipo === 'servicos') {
            navigate(`/cadastro-servicos/${id}`);
        } else if (tipo === 'produtos') {
            navigate(`/cadastro-produtos/${id}`);
        }
    }

    async function handleExcluir(id, tipo, nome) {
        if (!window.confirm(`Tem certeza que deseja excluir ${nome}?`)) {
            return;
        }

        let url = '';
        if (tipo === 'servicos') {
            url = `${baseURLServicos}/${id}`;
        } else if (tipo === 'produtos') {
            url = `${baseURLProdutos}/${id}`;
        }

        try {
            await axios.delete(url);
            alert(`${nome} excluído com sucesso!`);
            if (tipo === 'servicos') {
                setDadosServicos(dadosServicos.filter(item => item.id !== id));
            } else if (tipo === 'produtos') {
                setDadosProdutos(dadosProdutos.filter(item => item.id !== id));
            }
        } catch (error) {
            alert('Erro ao excluir: ' + (error.response?.data || error.message));
        }
    }

    React.useEffect(() => {
        axios.get(baseURLServicos)
            .then(function (response) {
                console.log('Serviços:', response.data);
                setDadosServicos(Array.isArray(response.data) ? response.data : []);
            })
            .catch(function (error) {
                console.error('Erro ao buscar serviços:', error);
            });

        axios.get(baseURLProdutos)
            .then(function (response) {
                console.log('Produtos:', response.data);
                setDadosProdutos(Array.isArray(response.data) ? response.data : []);
            })
            .catch(function (error) {
                console.error('Erro ao buscar produtos:', error);
            });
    }, []);

    const renderizarCard = () => {
        if (tipoSelecionado === 'servicos') {
            return (
                <Card
                    title='Serviços'
                    iconeTitle={iconeServicos}
                    botaoHeader={
                        <button type='button' className='textoCadastro btn d-flex align-items-center' onClick={() => navigate('/cadastro-servicos')}>
                            <img src={iconeAdd} alt="" width="16" height="16" className='me-2' />
                            Cadastrar Serviço
                        </button>
                    }
                >
                    <div className='row'>
                        <div className='col-md-12'>
                            <div className='bs-component'>
                                <table className='table table-hover' style={{ borderCollapse: 'collapse' }}>
                                    <tbody>
                                        {dadosServicos.length === 0 ? (
                                            <tr>
                                                <td colSpan="3" style={{ border: 'none', padding: '12px' }}>Nenhum serviço encontrado</td>
                                            </tr>
                                        ) : (
                                            dadosServicos.map((servico) => (
                                                <tr key={servico.id} style={{ border: 'none' }}>
                                                    <td style={{ border: 'none', padding: '12px' }}>
                                                        <div>
                                                            <div style={{ fontWeight: 500, marginBottom: '4px' }}>{servico.nome}</div>
                                                            <div style={{ fontSize: '14px', color: '#666' }}>{servico.descricao}</div>
                                                        </div>
                                                    </td>
                                                    <td style={{ border: 'none', padding: '12px' }}>
                                                        <div style={{ fontWeight: 500, color: '#2E7D32' }}>
                                                            {formatarValor(servico.valor)}
                                                        </div>
                                                    </td>
                                                    <td className='text-end' style={{ border: 'none', padding: '12px' }}>
                                                        <div className='d-flex justify-content-end gap-2 flex-wrap align-items-center'>
                                                            {servico.labels && servico.labels.map((label, index) => (
                                                                <span key={index} className='label-badge'>{label}</span>
                                                            ))}
                                                            {servico.duracao && (
                                                                <span className='label-badge'>{servico.duracao} min</span>
                                                            )}
                                                            {servico.disponivel === false && (
                                                                <span className='label-badge' style={{ backgroundColor: '#f44336' }}>Indisponível</span>
                                                            )}
                                                            <div style={{ display: 'flex', gap: '8px', marginLeft: '12px' }}>
                                                                <button
                                                                    type='button'
                                                                    onClick={() => handleEditar(servico.id, 'servicos')}
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
                                                                    onClick={() => handleExcluir(servico.id, 'servicos', servico.nome)}
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
        } else {
            return (
                <Card
                    title='Produtos'
                    iconeTitle={iconeProdutos}
                    botaoHeader={
                        <button type='button' className='textoCadastro btn d-flex align-items-center' onClick={() => navigate('/cadastro-produtos')}>
                            <img src={iconeAdd} alt="" width="16" height="16" className='me-2' />
                            Cadastrar Produto
                        </button>
                    }
                >
                    <div className='row'>
                        <div className='col-md-12'>
                            <div className='bs-component'>
                                <table className='table table-hover' style={{ borderCollapse: 'collapse' }}>
                                    <tbody>
                                        {dadosProdutos.length === 0 ? (
                                            <tr>
                                                <td colSpan="3" style={{ border: 'none', padding: '12px' }}>Nenhum produto encontrado</td>
                                            </tr>
                                        ) : (
                                            dadosProdutos.map((produto) => (
                                                <tr key={produto.id} style={{ border: 'none' }}>
                                                    <td style={{ border: 'none', padding: '12px' }}>
                                                        <div>
                                                            <div style={{ fontWeight: 500, marginBottom: '4px' }}>{produto.nome}</div>
                                                            <div style={{ fontSize: '14px', color: '#666' }}>{produto.descricao}</div>
                                                            {produto.categoria && (
                                                                <div style={{ fontSize: '14px', color: '#666' }}>Categoria: {produto.categoria}</div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td style={{ border: 'none', padding: '12px' }}>
                                                        <div>
                                                            <div style={{ fontWeight: 500, color: '#2E7D32' }}>
                                                                {formatarValor(produto.preco)}
                                                            </div>
                                                            {produto.estoque !== undefined && (
                                                                <div style={{ fontSize: '14px', color: '#666' }}>
                                                                    Estoque: {produto.estoque}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className='text-end' style={{ border: 'none', padding: '12px' }}>
                                                        <div className='d-flex justify-content-end gap-2 flex-wrap align-items-center'>
                                                            <div className='d-flex flex-column labels-gerentes'>
                                                                {produto.labels && produto.labels.map((label, index) => (
                                                                    <span key={index} className='label-badge-gerente'>{label}</span>
                                                                ))}
                                                                {produto.estoque !== undefined && produto.estoque < 10 && (
                                                                    <span className='label-badge-gerente' style={{ backgroundColor: '#ff9800' }}>Estoque Baixo</span>
                                                                )}
                                                                {produto.estoque !== undefined && produto.estoque === 0 && (
                                                                    <span className='label-badge-gerente' style={{ backgroundColor: '#f44336' }}>Fora de Estoque</span>
                                                                )}
                                                            </div>
                                                            <div style={{ display: 'flex', gap: '8px', marginLeft: '12px' }}>
                                                                <button
                                                                    type='button'
                                                                    onClick={() => handleEditar(produto.id, 'produtos')}
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
                                                                    onClick={() => handleExcluir(produto.id, 'produtos', produto.nome)}
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
            <h1 className='textoTitulo'>Gerenciamento de Serviços e Produtos</h1>
            <h1 className='textoSubtitulo'>Gerencie serviços e produtos oferecidos</h1>

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
                        onClick={() => setTipoSelecionado('servicos')}
                        style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            padding: '8px 12px',
                            borderRadius: '16px',
                            border: 'none',
                            backgroundColor: tipoSelecionado === 'servicos' ? '#ffffff' : 'transparent',
                            color: tipoSelecionado === 'servicos' ? '#0f172a' : 'rgb(113, 113, 130)',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            fontFamily: 'system-ui'
                        }}
                    >
                        <img src={iconeServicos} alt="" width="16" height="16" />
                        Serviços
                    </button>
                    <button
                        type='button'
                        onClick={() => setTipoSelecionado('produtos')}
                        style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            padding: '8px 12px',
                            borderRadius: '16px',
                            border: 'none',
                            backgroundColor: tipoSelecionado === 'produtos' ? '#ffffff' : 'transparent',
                            color: tipoSelecionado === 'produtos' ? '#0f172a' : 'rgb(113, 113, 130)',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            fontFamily: 'system-ui'
                        }}
                    >
                        <img src={iconeProdutos} alt="" width="16" height="16" />
                        Produtos
                    </button>
                </div>
            </div>

            {renderizarCard()}
        </div>
    );
}

export default ListagemServicosProdutos;
