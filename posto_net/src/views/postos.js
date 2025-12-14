import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../config/axios';

function Postos() {
    const navigate = useNavigate();
    const [postos, setPostos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modoExclusao, setModoExclusao] = useState(false);

    useEffect(() => {
        const fetchPostos = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/postos`);
                setPostos(response.data || []);
            } catch (error) {
                console.error('Erro ao buscar postos:', error);
                setPostos([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPostos();
    }, []);

    const getNomePosto = (posto) => {
        return posto.nomeFantasia || posto.nome || 'Posto sem nome';
    };

    const handlePostoClick = (posto) => {
        if (modoExclusao) {
            const nomePosto = getNomePosto(posto);
            if (window.confirm(`Você deseja realmente excluir este posto?`)) {
                handleExcluirPosto(posto.id, nomePosto);
            }
        } else {
            const nomePosto = getNomePosto(posto);
            localStorage.setItem('postoSelecionado', nomePosto);
            localStorage.setItem('postoSelecionadoId', posto.id);
            navigate('/home');
        }
    };

    const handleExcluirPosto = async (id, nomePosto) => {
        try {
            await axios.delete(`${BASE_URL}/postos/${id}`);
            alert(`Posto ${nomePosto} excluído com sucesso!`);
            setPostos(postos.filter(posto => posto.id !== id));
            setModoExclusao(false);
        } catch (error) {
            alert('Erro ao excluir posto: ' + (error.response?.data || error.message));
        }
    };

    const handleCadastrarPosto = () => {
        navigate('/cadastro-posto');
    };

    const handleToggleModoExclusao = () => {
        setModoExclusao(!modoExclusao);
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '1024px'
            }}>
                <div style={{
                    marginBottom: '32px',
                    textAlign: 'center'
                }}>
                    <p style={{
                        color: '#6b7280',
                        fontSize: '16px',
                        fontFamily: 'system-ui',
                        margin: 0
                    }}>
                        {modoExclusao ? 'Clique em um posto para excluí-lo' : 'Escolha o posto que deseja acessar'}
                    </p>
                </div>

                {loading ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '40px',
                        color: '#6b7280',
                        fontSize: '14px',
                        fontFamily: 'system-ui'
                    }}>
                        Carregando postos...
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '16px',
                        marginBottom: '32px',
                        justifyContent: 'center',
                        maxWidth: '450px',
                        margin: '0 auto 32px'
                    }}>

                        {postos.map((posto) => (
                            <div
                                key={posto.id}
                                onClick={() => handlePostoClick(posto)}
                                style={{
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    opacity: modoExclusao ? 0.8 : 1
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'scale(1.05)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'scale(1)';
                                }}
                            >
                                <div style={{
                                    backgroundColor: modoExclusao ? '#fee2e2' : '#ffffff',
                                    border: modoExclusao ? '2px solid #dc2626' : '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    padding: '16px',
                                    textAlign: 'center',
                                    transition: 'box-shadow 0.2s'
                                }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    <div style={{
                                        width: '64px',
                                        height: '64px',
                                        margin: '0 auto 12px',
                                        backgroundColor: '#f3f4f6',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        overflow: 'hidden'
                                    }}>
                                        <img
                                            src="https://images.unsplash.com/photo-1693585197677-1bfca300d8a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYXMlMjBzdGF0aW9uJTIwZnVlbCUyMHB1bXB8ZW58MXx8fHwxNzU4NDY3MTU0fDA&ixlib=rb-4.1.0&q=80&w=400"
                                            alt={getNomePosto(posto)}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover'
                                            }}
                                        />
                                    </div>
                                    <h3 style={{
                                        fontSize: '14px',
                                        fontFamily: 'system-ui',
                                        fontWeight: 500,
                                        color: '#111827',
                                        margin: 0
                                    }}>
                                        {getNomePosto(posto)}
                                    </h3>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div style={{ 
                    textAlign: 'center',
                    display: 'flex',
                    gap: '12px',
                    justifyContent: 'center'
                }}>
                    <button
                        onClick={handleCadastrarPosto}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            whiteSpace: 'nowrap',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontFamily: 'system-ui',
                            fontWeight: 500,
                            transition: 'all 0.2s',
                            border: '1px solid #e5e7eb',
                            backgroundColor: '#ffffff',
                            color: '#111827',
                            padding: '8px 16px',
                            cursor: 'pointer',
                            outline: 'none'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#f9fafb';
                            e.target.style.color = '#111827';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#ffffff';
                            e.target.style.color = '#111827';
                        }}
                    >
                        Cadastrar novo posto
                    </button>
                    <button
                        onClick={handleToggleModoExclusao}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            whiteSpace: 'nowrap',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontFamily: 'system-ui',
                            fontWeight: 500,
                            transition: 'all 0.2s',
                            border: '1px solid #dc2626',
                            backgroundColor: modoExclusao ? '#dc2626' : '#ffffff',
                            color: modoExclusao ? '#ffffff' : '#dc2626',
                            padding: '8px 16px',
                            cursor: 'pointer',
                            outline: 'none'
                        }}
                        onMouseEnter={(e) => {
                            if (!modoExclusao) {
                                e.target.style.backgroundColor = '#fee2e2';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!modoExclusao) {
                                e.target.style.backgroundColor = '#ffffff';
                            }
                        }}
                    >
                        {modoExclusao ? 'Cancelar exclusão' : 'Excluir'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Postos;