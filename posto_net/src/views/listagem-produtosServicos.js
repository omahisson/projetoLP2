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

    const formatarValor = (valor) => {
        if (!valor) return 'R$ 0,00';
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    };

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
                            <table className='table table-hover'>
                                <tbody>
                                    {dadosServicos.length === 0 ? (
                                        <tr>
                                            <td colSpan="3">Nenhum serviço encontrado</td>
                                        </tr>
                                    ) : (
                                        dadosServicos.map((servico) => (
                                            <tr key={servico.id}>
                                                <td>
                                                    <div>
                                                        <div style={{ fontWeight: 500, marginBottom: '4px' }}>{servico.nome}</div>
                                                        <div style={{ fontSize: '14px', color: '#666' }}>{servico.descricao}</div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div style={{ fontWeight: 500, color: '#2E7D32' }}>
                                                        {formatarValor(servico.valor)}
                                                    </div>
                                                </td>
                                                <td className='text-end'>
                                                    <div className='d-flex justify-content-end gap-2 flex-wrap'>
                                                        {servico.labels && servico.labels.map((label, index) => (
                                                            <span key={index} className='label-badge'>{label}</span>
                                                        ))}
                                                        {servico.duracao && (
                                                            <span className='label-badge'>{servico.duracao} min</span>
                                                        )}
                                                        {servico.disponivel === false && (
                                                            <span className='label-badge' style={{ backgroundColor: '#f44336' }}>Indisponível</span>
                                                        )}
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
                            <table className='table table-hover'>
                                <tbody>
                                    {dadosProdutos.length === 0 ? (
                                        <tr>
                                            <td colSpan="3">Nenhum produto encontrado</td>
                                        </tr>
                                    ) : (
                                        dadosProdutos.map((produto) => (
                                            <tr key={produto.id}>
                                                <td>
                                                    <div>
                                                        <div style={{ fontWeight: 500, marginBottom: '4px' }}>{produto.nome}</div>
                                                        <div style={{ fontSize: '14px', color: '#666' }}>{produto.descricao}</div>
                                                        {produto.categoria && (
                                                            <div style={{ fontSize: '14px', color: '#666' }}>Categoria: {produto.categoria}</div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td>
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
                                                <td className='text-end'>
                                                    <div className='d-flex justify-content-end flex-column labels-gerentes'>
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
        </div>
    );
}

export default ListagemServicosProdutos;