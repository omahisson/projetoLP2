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

    const baseURL = `${BASE_URL}/bombas`;

    const [nome, setNome] = useState('');
    const [status, setStatus] = useState('Ativa');
    const [combustiveis, setCombustiveis] = useState('');
    const [descricao, setDescricao] = useState('');
    const [carregando, setCarregando] = useState(!!idParam);

    useEffect(() => {
        if (!idParam) return;
        axios.get(`${baseURL}/${idParam}`)
            .then(({ data }) => {
                setNome(data.nome || '');
                setStatus(data.status || 'Ativa');
                setCombustiveis(data.combustiveis ? data.combustiveis.join(', ') : '');
                setDescricao(data.descricao || '');
            })
            .finally(() => setCarregando(false));
    }, [idParam]);

    async function salvar(e) {
        e.preventDefault();
        const payload = {
            nome,
            status,
            combustiveis: combustiveis
                .split(',')
                .map(item => item.trim())
                .filter(Boolean),
            descricao,
        };

        if (idParam) {
            await axios.put(`${baseURL}/${idParam}`, payload);
        } else {
            await axios.post(baseURL, payload);
        }
        navigate('/combustiveis');
    }

    if (carregando) return null;

    return (
        <div className="form-page-container">
            <div className="form-header">
                <div className='container-icone-coluna' onClick={toggleMenu}>
                    <img src={iconeColuna} alt="Coluna" width="16" height="16" />
                </div>
                <span className='textoDashboard'>Dashboard - {localStorage.getItem('postoSelecionado') || 'Posto Ipiranga Vila'}</span>
                </div>

            <div className="form-title-section">
                <div className="form-back-button"
                    onClick={() => navigate('/empregados')}
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
                    <h2 className="form-title">{idParam ? 'Editar Bomba de Combustível' : 'Cadastrar Bomba de Combustível'}</h2>
                    <p className="form-subtitle">
                        {idParam ? 'Atualize os dados da bomba' : 'Preencha os dados da nova bomba'}
                    </p>
                </div>
            </div>

            <div className="form-card-container">
                <Card title='Dados da Bomba'>
                </Card>
            </div>
        </div>
    );
}

export default CadastroBombas;