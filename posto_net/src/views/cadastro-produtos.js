import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Card from '../components/card';
import iconeColuna from '../icones/coluna.svg';
import axios from 'axios';
import { BASE_URL } from '../config/axios';

function CadastroProdutos({ toggleMenu }) {
    const { idParam } = useParams();
    const navigate = useNavigate();
    const baseURL = `${BASE_URL}/produtos`;

    const [id, setId] = useState('');
    const [nome, setNome] = useState('');
    const [preco, setPreco] = useState('');
    const [estoque, setEstoque] = useState('');
    const [sku, setSku] = useState('');
    const [dataValidade, setDataValidade] = useState('');
    const [labels, setLabels] = useState('');

    function inicializar() {
        setId('');
        setNome('');
        setPreco('');
        setEstoque('');
        setSku('');
        setDataValidade('');
        setLabels('');
    }

    async function salvar() {
        const labelsArray = labels ? labels.split(',').map(label => label.trim()).filter(label => label !== '') : [];

        let data = {
            id,
            nome,
            preco: parseFloat(preco),
            estoque: parseInt(estoque),
            sku,
            dataValidade,
            labels: labelsArray,
            value: id || Date.now(),
            text: nome
        };

        data = JSON.stringify(data);

        try {
            if (idParam == null) {
                await axios.post(baseURL, data);
                alert(`Produto ${nome} cadastrado com sucesso!`);
            } else {
                await axios.put(`${baseURL}/${idParam}`, data);
                alert(`Produto ${nome} alterado com sucesso!`);
            }
            navigate('/produtos');
        } catch (error) {
            alert('Erro ao salvar produto: ' + error.message);
        }
    }

    async function buscar() {
        if (idParam != null) {
            try {
                const response = await axios.get(`${baseURL}/${idParam}`);
                setId(response.data.id);
                setNome(response.data.nome || '');
                setPreco(response.data.preco || '');
                setEstoque(response.data.estoque || '');
                setSku(response.data.sku || '');
                setDataValidade(response.data.dataValidade || '');
                setLabels(response.data.labels ? response.data.labels.join(', ') : '');
            } catch (error) {
                console.error('Erro ao buscar produto:', error);
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
                    onClick={() => navigate('/produtos')}
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
                    title="Voltar para listagem de produtos"
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
                    <h2 style={formStyles.title}>Cadastrar Produto</h2>
                    <p style={formStyles.subtitle}>Preencha os dados do novo produto</p>
                </div>
            </div>

            <div style={formStyles.cardContainer}>
                <Card title='Dados do Produto'>
                    <div style={{ fontSize: '14px', color: 'rgb(113, 113, 130)', marginTop: '10px', marginBottom: '24px', fontFamily: 'system-ui' }}>
                        Produtos disponíveis para venda no posto
                    </div>
                    <form onSubmit={(e) => { e.preventDefault(); salvar(); }}>
                        <div style={formStyles.form}>
                            <div style={formStyles.fieldGroup}>
                                <label htmlFor="nome" style={formStyles.label}>
                                    Nome do Produto
                                </label>
                                <div style={formStyles.inputWrapper}>
                                    <input
                                        type="text"
                                        id="nome"
                                        name="nome"
                                        value={nome}
                                        onChange={(e) => setNome(e.target.value)}
                                        placeholder="Nome do produto"
                                        required
                                        style={formStyles.input}
                                        className="card-pdv-input"
                                    />
                                </div>
                            </div>

                            <div style={formStyles.gridRow}>
                                <div style={formStyles.fieldGroup}>
                                    <label htmlFor="preco" style={formStyles.label}>
                                        Preço (R$)
                                    </label>
                                    <div style={formStyles.inputWrapper}>
                                        <input
                                            type="number"
                                            id="preco"
                                            name="preco"
                                            value={preco}
                                            onChange={(e) => setPreco(e.target.value)}
                                            placeholder="0.00"
                                            step="0.01"
                                            min="0"
                                            required
                                            style={formStyles.input}
                                            className="card-pdv-input"
                                        />
                                    </div>
                                </div>
                                <div style={formStyles.fieldGroup}>
                                    <label htmlFor="estoque" style={formStyles.label}>
                                        Estoque
                                    </label>
                                    <div style={formStyles.inputWrapper}>
                                        <input
                                            type="number"
                                            id="estoque"
                                            name="estoque"
                                            value={estoque}
                                            onChange={(e) => setEstoque(e.target.value)}
                                            placeholder="Quantidade em estoque"
                                            min="0"
                                            required
                                            style={formStyles.input}
                                            className="card-pdv-input"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div style={formStyles.gridRow}>
                                <div style={formStyles.fieldGroup}>
                                    <label htmlFor="sku" style={formStyles.label}>
                                        SKU
                                    </label>
                                    <div style={formStyles.inputWrapper}>
                                        <input
                                            type="text"
                                            id="sku"
                                            name="sku"
                                            value={sku}
                                            onChange={(e) => setSku(e.target.value)}
                                            placeholder="Código SKU"
                                            required
                                            style={formStyles.input}
                                            className="card-pdv-input"
                                        />
                                    </div>
                                </div>
                                <div style={formStyles.fieldGroup}>
                                    <label htmlFor="dataValidade" style={formStyles.label}>
                                        Data de Validade
                                    </label>
                                    <div style={formStyles.inputWrapper}>
                                        <input
                                            type="date"
                                            id="dataValidade"
                                            name="dataValidade"
                                            value={dataValidade}
                                            onChange={(e) => setDataValidade(e.target.value)}
                                            style={formStyles.input}
                                            className="card-pdv-input"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div style={formStyles.fieldGroup}>
                                <label htmlFor="labels" style={formStyles.label}>
                                    Labels (Tags)
                                </label>
                                <div style={formStyles.description}>
                                    Separe as tags por vírgula
                                </div>
                                <div style={formStyles.inputWrapper}>
                                    <input
                                        type="text"
                                        id="labels"
                                        name="labels"
                                        value={labels}
                                        onChange={(e) => setLabels(e.target.value)}
                                        placeholder="combustível, lubrificante, limpeza"
                                        style={formStyles.input}
                                        className="card-pdv-input"
                                    />
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
                                {idParam ? 'Alterar Produto' : 'Cadastrar Produto'}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/produtos')}
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

export default CadastroProdutos;