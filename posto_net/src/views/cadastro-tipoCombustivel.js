import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Card from '../components/card';
import iconeColuna from '../icones/coluna.svg';

import axios from 'axios';
import { BASE_URL } from '../config/axios';
import '../styles/form-cadastro.css';

function CadastroTipoCombustivel({ toggleMenu }) {
    const { idParam } = useParams();
    const navigate = useNavigate();
    const baseURL = `${BASE_URL}/TiposCombustivel`;

    const [id, setId] = useState('');
    const [nome, setNome] = useState('');
    const [preco, setPreco] = useState('');
    const [unidade, setUnidade] = useState('');
    const [fornecedor, setFornecedor] = useState('');
    const [estoque, setEstoque] = useState('');
    const [dataValidade, setDataValidade] = useState('');
    const [carregando, setCarregando] = useState(false);

    const getEstoquePlaceholder = () => {
        if (unidade === 'Litro' || unidade === 'L') {
            return 'Ex: 15000 (em litros)';
        } else if (unidade === 'm³' || unidade === 'm3') {
            return 'Ex: 15000 (em m³)';
        }
        return 'Ex: 15000 (sem unidade)';
    };

    useEffect(() => {
        if (!idParam) {
            setId('');
            setNome('');
            setPreco('');
            setUnidade('');
            setFornecedor('');
            setEstoque('');
            setDataValidade('');
            return;
        }

        setCarregando(true);
        axios
            .get(`${baseURL}/${idParam}`)
            .then(({ data }) => {
                setId(data.id);
                setNome(data.nome || '');
                setPreco(data.preco || '');
                setUnidade(data.unidade || '');
                setFornecedor(data.fornecedor || '');
                setEstoque(data.estoque || '');
                setDataValidade(data.validade || '');
            })
            .catch((error) => alert(error.response?.data || 'Erro ao buscar tipo de combustível'))
            .finally(() => setCarregando(false));
    }, [idParam]);

    async function salvar(e) {
        e.preventDefault();

        const payload = {
            nome,
            preco,
            unidade,
            fornecedor,
            estoque: estoque ? estoque : '0',
            validade: dataValidade,
            status: 'Ativo'
        };

        if (idParam) {
            payload.id = id;
        }

        try {
            if (idParam) {
                await axios.put(`${baseURL}/${idParam}`, payload);
                alert('Tipo de combustível alterado com sucesso');
            } else {
                await axios.post(baseURL, payload);
                alert('Tipo de combustível cadastrado com sucesso');
            }

            navigate('/combustiveis');
        } catch (error) {
            alert(error.response?.data || 'Erro ao salvar tipo de combustível');
        }
    }

    if (carregando) {
        return null;
    }

    return (
        <div className="form-page-container">
            <div className="form-header">
                <div className="container-icone-coluna" onClick={toggleMenu}>
                    <img src={iconeColuna} alt="Coluna" width="16" height="16" />
                </div>
                <span className="textoDashboard">Dashboard - Posto Ipiranga Vila</span>
            </div>

            <div className="form-title-section">
                <div
                    className="form-back-button"
                    onClick={() => navigate('/combustiveis')}
                    title="Voltar para listagem de combustíveis"
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
                <div className="form-title-container">
                    <h2 className="form-title">
                        {idParam ? 'Editar Tipo de Combustível' : 'Cadastrar Tipo de Combustível'}
                    </h2>
                    <p className="form-subtitle">
                        {idParam ? 'Atualize os dados do combustível' : 'Preencha os dados do novo combustível'}
                    </p>
                </div>
            </div>

            <div className="form-card-container">
                <Card title="Dados do Combustível">
                    <form className="form-structured-form" onSubmit={salvar}>
                        <div className="form-field-group">
                            <label htmlFor="nome" className="form-label">Nome do Combustível</label>
                            <div className="form-input-wrapper">
                                <input
                                    type="text"
                                    id="nome"
                                    name="nome"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    placeholder="Ex: Gasolina Comum, Diesel S-10, Etanol"
                                    required
                                    className="card-pdv-input form-input"
                                />
                            </div>
                        </div>

                        <div className="form-grid-row">
                            <div className="form-field-group">
                                <label htmlFor="preco" className="form-label">Preço por Unidade</label>
                                <div className="form-input-wrapper">
                                    <input
                                        type="text"
                                        id="preco"
                                        name="preco"
                                        value={preco}
                                        onChange={(e) => setPreco(e.target.value)}
                                        placeholder="Ex: R$ 5,45"
                                        required
                                        className="card-pdv-input form-input"
                                    />
                                </div>
                            </div>
                            <div className="form-field-group">
                                <label htmlFor="unidade" className="form-label">Unidade de Medida</label>
                                <div className="form-input-wrapper" style={{ cursor: 'pointer' }}>
                                    <select
                                        id="unidade"
                                        name="unidade"
                                        value={unidade}
                                        onChange={(e) => setUnidade(e.target.value)}
                                        required
                                        className="card-pdv-input form-input"
                                        style={{
                                            appearance: 'none',
                                            backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'m6 9 6 6 6-6\'%3E%3C/path%3E%3C/svg%3E")',
                                            backgroundRepeat: 'no-repeat',
                                            backgroundPosition: 'right 8px center',
                                            backgroundSize: '16px',
                                            paddingRight: '32px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <option value="">Selecione uma unidade</option>
                                        <option value="Litro">Litro</option>
                                        <option value="m³">m³</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="form-field-group">
                            <label htmlFor="fornecedor" className="form-label">Fornecedor</label>
                            <div className="form-input-wrapper">
                                <input
                                    type="text"
                                    id="fornecedor"
                                    name="fornecedor"
                                    value={fornecedor}
                                    onChange={(e) => setFornecedor(e.target.value)}
                                    placeholder="Ex: Petrobras, Shell, Raízen"
                                    required
                                    className="card-pdv-input form-input"
                                />
                            </div>
                        </div>

                        <div className="form-grid-row">
                            <div className="form-field-group">
                                <label htmlFor="estoque" className="form-label">Estoque Inicial</label>
                                <div className="form-input-wrapper">
                                    <input
                                        type="text"
                                        id="estoque"
                                        name="estoque"
                                        value={estoque}
                                        onChange={(e) => setEstoque(e.target.value)}
                                        placeholder={getEstoquePlaceholder()}
                                        className="card-pdv-input form-input"
                                    />
                                </div>
                            </div>
                            <div className="form-field-group">
                                <label htmlFor="dataValidade" className="form-label">Data de Validade</label>
                                <div className="form-input-wrapper">
                                    <input
                                        type="date"
                                        id="dataValidade"
                                        name="dataValidade"
                                        value={dataValidade}
                                        onChange={(e) => setDataValidade(e.target.value)}
                                        required
                                        className="card-pdv-input form-input"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-info-card">
                            <h4>Informações Importantes</h4>
                            <ul>
                                <li>O combustível será criado com status "Ativo" por padrão</li>
                                <li>O preço pode ser atualizado posteriormente</li>
                                <li>Certifique-se de que o nome do combustível está correto</li>
                                <li>O estoque será atualizado automaticamente com os abastecimentos</li>
                                <li>A data de validade é importante para controle de qualidade</li>
                            </ul>
                        </div>

                        <div className="form-button-group">
                            <button type="submit" className="form-button-primary">
                                {idParam ? 'Salvar Alterações' : 'Cadastrar Combustível'}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/combustiveis')}
                                className="form-button-secondary"
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

export default CadastroTipoCombustivel;