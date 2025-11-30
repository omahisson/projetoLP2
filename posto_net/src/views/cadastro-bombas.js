import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Card from '../components/card';
import iconeColuna from '../icones/coluna.svg';

import axios from 'axios';
import { BASE_URL } from '../config/axios';
import '../styles/form-cadastro.css';

function CadastroBombas({ toggleMenu }) {
    const { idParam } = useParams();
    const navigate = useNavigate();
    const baseURL = `${BASE_URL}/DadosBomba`;

    const [id, setId] = useState('');
    const [nomeBomba, setNomeBomba] = useState('');
    const [combustiveisSelecionados, setCombustiveisSelecionados] = useState([]);
    const [carregando, setCarregando] = useState(false);
    const [tiposCombustivel, setTiposCombustivel] = useState([]);

    useEffect(() => {
        if (!idParam) {
            setId('');
            setNomeBomba('');
            setCombustiveisSelecionados([]);
            return;
        }

        setCarregando(true);
        axios
            .get(`${baseURL}/${idParam}`)
            .then(({ data }) => {
                setId(data.id);
                setNomeBomba(data.nome || '');
                setCombustiveisSelecionados(Array.isArray(data.combustiveis) ? data.combustiveis : []);
            })
            .catch((error) => alert(error.response?.data || 'Erro ao buscar bomba'))
            .finally(() => setCarregando(false));
    }, [idParam]);

    useEffect(() => {
        async function carregarTiposCombustivel() {
            try {
                const response = await axios.get(`${BASE_URL}/TiposCombustivel`);
                const tipos = Array.isArray(response.data)
                    ? response.data.map(item => item.nome)
                    : [];
                setTiposCombustivel(tipos);
            } catch (error) {
                console.error('Erro ao carregar tipos de combustível:', error);
                setTiposCombustivel([]);
            }
        }
        carregarTiposCombustivel();
    }, []);

    function alternarCombustivel(tipo) {
        setCombustiveisSelecionados((prev) =>
            prev.includes(tipo) ? prev.filter((item) => item !== tipo) : [...prev, tipo]
        );
    }

    async function salvar(e) {
        e.preventDefault();

        if (!combustiveisSelecionados.length) {
            alert('Selecione pelo menos um tipo de combustível');
            return;
        }

        const payload = {
            nome: nomeBomba,
            combustiveis: combustiveisSelecionados,
            status: 'Ativa'
        };

        if (idParam) {
            payload.id = id;
        }

        try {
            if (idParam) {
                await axios.put(`${baseURL}/${idParam}`, payload);
                alert('Bomba alterada com sucesso');
            } else {
                await axios.post(baseURL, payload);
                alert('Bomba cadastrada com sucesso');
            }

            navigate('/combustiveis');
        } catch (error) {
            alert(error.response?.data || 'Erro ao salvar bomba');
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
                    title="Voltar para listagem de bombas"
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
                        {idParam ? 'Editar Bomba de Combustível' : 'Cadastrar Bomba de Combustível'}
                    </h2>
                    <p className="form-subtitle">
                        {idParam ? 'Atualize os dados da bomba' : 'Preencha os dados da nova bomba'}
                    </p>
                </div>
            </div>

            <div className="form-card-container">
                <Card title="Dados da Bomba">
                    <form className="form-structured-form" onSubmit={salvar}>
                        <div className="form-field-group">
                            <label htmlFor="nomeBomba" className="form-label">Nome da Bomba</label>
                            <div className="form-input-wrapper">
                                <input
                                    type="text"
                                    id="nomeBomba"
                                    name="nomeBomba"
                                    value={nomeBomba}
                                    onChange={(e) => setNomeBomba(e.target.value)}
                                    placeholder="Ex: Bomba 01, Bomba A, etc."
                                    required
                                    className="card-pdv-input form-input"
                                />
                            </div>
                        </div>

                        <div className="form-field-group">
                            <label className="form-label">Tipos de Combustível</label>
                            <p className="form-subtitle">
                                Selecione os tipos de combustível que esta bomba irá dispensar
                            </p>
                            <div className="form-fuel-grid">
                                {tiposCombustivel.map((tipo) => {
                                    const marcado = combustiveisSelecionados.includes(tipo);
                                    return (
                                        <button
                                            key={tipo}
                                            type="button"
                                            className={`form-fuel-card${marcado ? ' form-fuel-card--checked' : ''}`}
                                            onClick={() => alternarCombustivel(tipo)}
                                        >
                                            {tipo}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="form-info-card">
                            <h4>Informações Importantes</h4>
                            <ul>
                                <li>A bomba será criada com status "Ativa" por padrão</li>
                                <li>Você pode alterar os combustíveis posteriormente</li>
                                <li>Selecione pelo menos um tipo de combustível</li>
                            </ul>
                        </div>

                        <div className="form-button-group">
                            <button type="submit" className="form-button-primary">
                                {idParam ? 'Salvar Alterações' : 'Cadastrar Bomba'}
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

export default CadastroBombas;

