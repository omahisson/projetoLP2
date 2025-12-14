import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Card from '../components/card';
import iconeColuna from '../icones/coluna.svg';

import axios from 'axios';
import { BASE_URL } from '../config/axios';
import '../styles/form-cadastro.css';

function CadastroAbastecimento({ toggleMenu }) {
    const { idParam } = useParams();
    const navigate = useNavigate();
    const baseURL = `${BASE_URL}/abastecimentos`;

    const [id, setId] = useState('');
    const [tipoCombustivel, setTipoCombustivel] = useState('');
    const [tiposCombustivelCompletos, setTiposCombustivelCompletos] = useState([]);
    const [fornecedor, setFornecedor] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [unidade, setUnidade] = useState('Litro');
    const [numeroNota, setNumeroNota] = useState('');
    const [dataEntrega, setDataEntrega] = useState('');
    const [dataValidade, setDataValidade] = useState('');
    const [precoUnitario, setPrecoUnitario] = useState('');
    const [valorTotal, setValorTotal] = useState('');
    const [carregando, setCarregando] = useState(false);
    const [tiposCombustivel, setTiposCombustivel] = useState([]);

    useEffect(() => {
        async function carregarTiposCombustivel() {
            const postoId = localStorage.getItem('postoSelecionadoId');
            
            if (!postoId) {
                setTiposCombustivel([]);
                setTiposCombustivelCompletos([]);
                return;
            }

            try {
                const response = await axios.get(`${BASE_URL}/TiposCombustivel?id_posto=${postoId}`);
                const tipos = Array.isArray(response.data) ? response.data : [];
                setTiposCombustivelCompletos(tipos);
                setTiposCombustivel(tipos.map(item => ({
                    value: item.nome,
                    text: item.nome
                })));
            } catch (error) {
                console.error('Erro ao carregar tipos de combustível:', error);
                setTiposCombustivel([]);
                setTiposCombustivelCompletos([]);
            }
        }
        carregarTiposCombustivel();
    }, []);

    useEffect(() => {
        if (quantidade && precoUnitario) {
            const qtd = parseFloat(quantidade.replace(/[^\d,.-]/g, '').replace(',', '.')) || 0;
            const preco = parseFloat(precoUnitario.replace(/[^\d,.-]/g, '').replace(',', '.')) || 0;
            const total = (qtd * preco).toFixed(2).replace('.', ',');
            setValorTotal(`R$ ${total}`);
        } else {
            setValorTotal('');
        }
    }, [quantidade, precoUnitario]);

    useEffect(() => {
        if (!idParam) {
            setId('');
            setTipoCombustivel('');
            setFornecedor('');
            setQuantidade('');
            setUnidade('Litro');
            setNumeroNota('');
            setDataEntrega('');
            setDataValidade('');
            setPrecoUnitario('');
            setValorTotal('');
            return;
        }

        setCarregando(true);
        axios
            .get(`${baseURL}/${idParam}`)
            .then(({ data }) => {
                setId(data.id);
                setTipoCombustivel(data.tipoCombustivel || '');
                setFornecedor(data.fornecedor || '');
                setQuantidade(data.quantidade || '');
                setUnidade(data.unidade || 'Litro');
                setNumeroNota(data.numeroNota || '');
                setDataEntrega(data.dataEntrega || '');
                setDataValidade(data.dataValidade || '');
                setPrecoUnitario(data.precoUnitario || '');
            })
            .catch((error) => alert(error.response?.data || 'Erro ao buscar abastecimento'))
            .finally(() => setCarregando(false));
    }, [idParam]);

    useEffect(() => {
        if (tipoCombustivel && tiposCombustivelCompletos.length > 0) {
            const tipoSelecionado = tiposCombustivelCompletos.find(t => t.nome === tipoCombustivel);
            if (tipoSelecionado) {
                let unidadeEncontrada = '';

                if (tipoSelecionado.unidade) {
                    unidadeEncontrada = tipoSelecionado.unidade;
                } else if (tipoSelecionado.estoque) {
                    const estoqueStr = String(tipoSelecionado.estoque);
                    if (estoqueStr.includes('m³')) {
                        unidadeEncontrada = 'm³';
                    } else if (estoqueStr.includes('L') || estoqueStr.includes('l')) {
                        unidadeEncontrada = 'Litro';
                    }
                }

                if (unidadeEncontrada) {
                    setUnidade(unidadeEncontrada);
                }
            } else {
                setUnidade('');
            }
        } else if (!tipoCombustivel) {
            setUnidade('');
        }
    }, [tipoCombustivel, tiposCombustivelCompletos]);

    async function salvar(e) {
        e.preventDefault();
        const postoId = localStorage.getItem('postoSelecionadoId');

        const payload = {
            id_posto: postoId,
            tipoCombustivel,
            fornecedor,
            quantidade: parseFloat(quantidade) || 0,
            unidade,
            numeroNota,
            dataEntrega,
            dataValidade,
            precoUnitario,
            valorTotal
        };

        if (idParam) {
            payload.id = id;
        }

        try {
            if (idParam) {
                await axios.put(`${baseURL}/${idParam}`, payload);
                alert('Abastecimento alterado com sucesso');
            } else {
                await axios.post(baseURL, payload);
                alert('Abastecimento registrado com sucesso');
            }

            navigate('/combustiveis');
        } catch (error) {
            alert(error.response?.data || 'Erro ao salvar abastecimento');
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
                <span className="textoDashboard">Dashboard - {localStorage.getItem('postoSelecionado') || 'Posto Ipiranga Vila'}</span>
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
                        {idParam ? 'Editar Abastecimento' : 'Cadastrar Abastecimento'}
                    </h2>
                    <p className="form-subtitle">
                        {idParam ? 'Edite a entrada de combustível no posto' : 'Registre a entrada de combustível no posto'}
                    </p>
                </div>
            </div>

            <div className="form-card-container">
                <Card title="Dados do Abastecimento">
                    <form className="form-structured-form" onSubmit={salvar}>
                        <div className="form-grid-row">
                            <div className="form-field-group">
                                <label htmlFor="tipoCombustivel" className="form-label">Tipo de Combustível</label>
                                <div className="form-input-wrapper" style={{ cursor: 'pointer' }}>
                                    <select
                                        id="tipoCombustivel"
                                        name="tipoCombustivel"
                                        value={tipoCombustivel}
                                        onChange={(e) => setTipoCombustivel(e.target.value)}
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
                                        <option value="">Selecione o combustível</option>
                                        {tiposCombustivel.map(tipo => (
                                            <option key={tipo.value} value={tipo.value}>
                                                {tipo.text}
                                            </option>
                                        ))}
                                    </select>
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
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
                            <div className="form-field-group">
                                <label htmlFor="quantidade" className="form-label">Quantidade</label>
                                <div className="form-input-wrapper">
                                    <input
                                        type="number"
                                        id="quantidade"
                                        name="quantidade"
                                        value={quantidade}
                                        onChange={(e) => setQuantidade(e.target.value)}
                                        placeholder="Ex: 15000"
                                        step="0.01"
                                        required
                                        className="card-pdv-input form-input"
                                    />
                                </div>
                            </div>
                            <div className="form-field-group">
                                <label htmlFor="unidade" className="form-label">Unidade</label>
                                <div className="form-input-wrapper" style={{ backgroundColor: 'rgb(243, 243, 245)' }}>
                                    <input
                                        type="text"
                                        id="unidade"
                                        name="unidade"
                                        value={unidade}
                                        readOnly
                                        className="card-pdv-input form-input"
                                        style={{ backgroundColor: 'transparent', cursor: 'not-allowed' }}
                                    />
                                </div>
                            </div>
                            <div className="form-field-group">
                                <label htmlFor="numeroNota" className="form-label">Número da Nota</label>
                                <div className="form-input-wrapper">
                                    <input
                                        type="text"
                                        id="numeroNota"
                                        name="numeroNota"
                                        value={numeroNota}
                                        onChange={(e) => setNumeroNota(e.target.value)}
                                        placeholder="Ex: NF123456"
                                        required
                                        className="card-pdv-input form-input"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-grid-row">
                            <div className="form-field-group">
                                <label htmlFor="dataEntrega" className="form-label">Data de Entrega</label>
                                <div className="form-input-wrapper">
                                    <input
                                        type="date"
                                        id="dataEntrega"
                                        name="dataEntrega"
                                        value={dataEntrega}
                                        onChange={(e) => setDataEntrega(e.target.value)}
                                        required
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

                        <div className="form-grid-row">
                            <div className="form-field-group">
                                <label htmlFor="precoUnitario" className="form-label">Preço Unitário</label>
                                <div className="form-input-wrapper">
                                    <input
                                        type="text"
                                        id="precoUnitario"
                                        name="precoUnitario"
                                        value={precoUnitario}
                                        onChange={(e) => setPrecoUnitario(e.target.value)}
                                        placeholder="R$ 0,00"
                                        required
                                        className="card-pdv-input form-input"
                                    />
                                </div>
                            </div>
                            <div className="form-field-group">
                                <label htmlFor="valorTotal" className="form-label">Valor Total</label>
                                <div className="form-input-wrapper" style={{ backgroundColor: 'rgb(243, 243, 245)' }}>
                                    <input
                                        type="text"
                                        id="valorTotal"
                                        name="valorTotal"
                                        value={valorTotal}
                                        readOnly
                                        placeholder="R$ 0,00"
                                        className="card-pdv-input form-input"
                                        style={{ backgroundColor: 'transparent' }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-info-card">
                            <h4>Informações Importantes</h4>
                            <ul>
                                <li>O estoque será atualizado automaticamente após o cadastro</li>
                                <li>Certifique-se de que a data de validade está correta</li>
                                <li>O valor total é calculado automaticamente</li>
                                <li>Mantenha a nota fiscal para auditoria</li>
                            </ul>
                        </div>

                        <div className="form-button-group">
                            <button type="submit" className="form-button-primary">
                                {idParam ? 'Salvar Alterações' : 'Registrar Abastecimento'}
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

export default CadastroAbastecimento;