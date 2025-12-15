import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiTrendingUp, FiTrendingDown, FiMinus, FiArrowLeft } from 'react-icons/fi';
import axios from 'axios';
import { BASE_URL } from '../config/axios';
import iconeColuna from '../icones/coluna.svg';

function ListagemHistorico({ toggleMenu }) {
    const { idParam } = useParams();
    const navigate = useNavigate();
    
    const [combustivel, setCombustivel] = useState(null);
    const [historico, setHistorico] = useState([]);
    const [loading, setLoading] = useState(true);
    const [resumo, setResumo] = useState({
        total: 0,
        aumentos: 0,
        reducoes: 0,
        mantido: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            if (!idParam) {
                navigate('/combustiveis');
                return;
            }

            try {
                const postoId = localStorage.getItem('postoSelecionadoId');
                
                const responseCombustivel = await axios.get(`${BASE_URL}/TiposCombustivel/${idParam}`);
                const dadosCombustivel = responseCombustivel.data;
                setCombustivel(dadosCombustivel);

                const responseHistorico = await axios.get(`${BASE_URL}/HistoricoCombustivel?tipoCombustivelId=${idParam}${postoId ? `&id_posto=${postoId}` : ''}`);
                const historicoData = Array.isArray(responseHistorico.data) ? responseHistorico.data : [];
                
                const historicoOrdenado = historicoData
                    .filter(item => {
                        const dataItem = new Date(item.dataAlteracao || item.dataVigencia);
                        return !isNaN(dataItem.getTime());
                    })
                    .sort((a, b) => {
                        const dataA = new Date(a.dataAlteracao || a.dataVigencia);
                        const dataB = new Date(b.dataAlteracao || b.dataVigencia);
                        return dataB - dataA; 
                    });

                setHistorico(historicoOrdenado);

                const stats = calcularResumo(historicoOrdenado);
                setResumo(stats);
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
                alert('Erro ao carregar histórico');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [idParam, navigate]);

    const calcularResumo = (historicoData) => {
        let aumentos = 0;
        let reducoes = 0;
        let mantido = 0;

        historicoData.forEach(item => {
            let precoAnterior = item.precoAnterior;
            let novoPreco = item.novoPreco || item.preco;

            if (typeof precoAnterior === 'string') {
                precoAnterior = parseFloat(precoAnterior.replace(/[^\d,.-]/g, '').replace(',', '.')) || 0;
            }
            if (typeof novoPreco === 'string') {
                novoPreco = parseFloat(novoPreco.replace(/[^\d,.-]/g, '').replace(',', '.')) || 0;
            }

            if (novoPreco > precoAnterior) {
                aumentos++;
            } else if (novoPreco < precoAnterior) {
                reducoes++;
            } else {
                mantido++;
            }
        });

        return {
            total: historicoData.length,
            aumentos,
            reducoes,
            mantido
        };
    };

    const formatarPreco = (valor) => {
        if (!valor) return 'R$ 0,00';
        if (typeof valor === 'string' && valor.includes('R$')) return valor;
        const num = typeof valor === 'string' 
            ? parseFloat(valor.replace(/[^\d,.-]/g, '').replace(',', '.')) 
            : valor;
        if (isNaN(num)) return 'R$ 0,00';
        return `R$ ${num.toFixed(2).replace('.', ',')}`;
    };

    const formatarData = (dataStr) => {
        if (!dataStr) return '';
        const data = new Date(dataStr);
        if (isNaN(data.getTime())) return '';
        return `${String(data.getDate()).padStart(2, '0')}/${String(data.getMonth() + 1).padStart(2, '0')}/${data.getFullYear()}`;
    };

    const obterTipoAlteracao = (precoAnterior, novoPreco) => {
        let anterior = precoAnterior;
        let novo = novoPreco;

        if (typeof anterior === 'string') {
            anterior = parseFloat(anterior.replace(/[^\d,.-]/g, '').replace(',', '.')) || 0;
        }
        if (typeof novo === 'string') {
            novo = parseFloat(novo.replace(/[^\d,.-]/g, '').replace(',', '.')) || 0;
        }

        if (novo > anterior) return { tipo: 'aumento', cor: '#dc2626', icon: <FiTrendingUp size={16} /> };
        if (novo < anterior) return { tipo: 'reducao', cor: '#10b981', icon: <FiTrendingDown size={16} /> };
        return { tipo: 'mantido', cor: '#6b7280', icon: <FiMinus size={16} /> };
    };

    if (loading) {
        return (
            <div style={styles.container}>
                <div style={styles.loading}>Carregando histórico...</div>
            </div>
        );
    }

    if (!combustivel) {
        return (
            <div style={styles.container}>
                <div style={styles.error}>Combustível não encontrado</div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div className='container-icone-coluna' onClick={toggleMenu}>
                    <img src={iconeColuna} alt="Coluna" width="16" height="16" />
                </div>
                <span className='textoDashboard'>Dashboard - {localStorage.getItem('postoSelecionado') || 'Posto Ipiranga Vila'}</span>
            </div>

            <div style={styles.content}>
                <div style={styles.headerSection}>
                    <button 
                        style={styles.backButton}
                        onClick={() => navigate('/combustiveis')}
                        title="Voltar para listagem de combustíveis"
                    >
                        <FiArrowLeft size={16} />
                    </button>
                    <div>
                        <h2 style={styles.title}>Histórico de Preços - {combustivel.nome}</h2>
                        <p style={styles.subtitle}>Visualize todas as alterações de preço deste combustível</p>
                    </div>
                </div>

                <div style={styles.cardsContainer}>
                    <div style={styles.card}>
                        <div style={styles.cardHeader}>
                            <h4 style={styles.cardTitle}>Resumo do Período</h4>
                            <p style={styles.cardDescription}>Estatísticas das alterações nos últimos 30 dias</p>
                        </div>
                        <div style={styles.cardContent}>
                            <div style={styles.resumoGrid}>
                                <div style={styles.resumoItem}>
                                    <div style={styles.resumoValue}>{resumo.total}</div>
                                    <div style={styles.resumoLabel}>Total de Alterações</div>
                                </div>
                                <div style={{ ...styles.resumoItem, ...styles.resumoAumento }}>
                                    <div style={{ ...styles.resumoValue, color: '#dc2626' }}>{resumo.aumentos}</div>
                                    <div style={{ ...styles.resumoLabel, color: '#dc2626' }}>Aumentos</div>
                                </div>
                                <div style={{ ...styles.resumoItem, ...styles.resumoReducao }}>
                                    <div style={{ ...styles.resumoValue, color: '#10b981' }}>{resumo.reducoes}</div>
                                    <div style={{ ...styles.resumoLabel, color: '#10b981' }}>Reduções</div>
                                </div>
                                <div style={{ ...styles.resumoItem, ...styles.resumoMantido }}>
                                    <div style={{ ...styles.resumoValue, color: '#6b7280' }}>{resumo.mantido}</div>
                                    <div style={{ ...styles.resumoLabel, color: '#6b7280' }}>Mantido</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={styles.card}>
                        <div style={styles.cardHeader}>
                            <div style={styles.cardHeaderTop}>
                                <h4 style={styles.cardTitle}>
                                    Histórico de Alterações
                                    {historico.length > 0 && (
                                        <span style={styles.badge}>{historico.length} registros</span>
                                    )}
                                </h4>
                            </div>
                            <p style={styles.cardDescription}>
                                Preço atual: {formatarPreco(combustivel.preco)} • Fornecedor: {combustivel.fornecedor || 'N/A'}
                            </p>
                        </div>
                        <div style={styles.cardContent}>
                            {historico.length === 0 ? (
                                <div style={styles.emptyState}>
                                    <p>Nenhum registro de histórico encontrado</p>
                                </div>
                            ) : (
                                <div style={styles.historicoList}>
                                    {historico.map((item, index) => {
                                        const precoAnterior = formatarPreco(item.precoAnterior);
                                        const novoPreco = formatarPreco(item.novoPreco || item.preco);
                                        const alteracao = obterTipoAlteracao(item.precoAnterior, item.novoPreco || item.preco);
                                        
                                        return (
                                            <div key={item.id || index} style={styles.historicoItem}>
                                                <div style={styles.historicoItemContent}>
                                                    <div style={styles.historicoItemHeader}>
                                                        <div style={styles.precoChange}>
                                                            <span style={{ color: alteracao.cor }}>
                                                                {alteracao.icon}
                                                            </span>
                                                            <span style={styles.precoText}>
                                                                {precoAnterior} → {novoPreco}
                                                            </span>
                                                        </div>
                                                        <span style={{
                                                            ...styles.badge,
                                                            ...(alteracao.tipo === 'aumento' ? styles.badgeAumento :
                                                                alteracao.tipo === 'reducao' ? styles.badgeReducao :
                                                                styles.badgeMantido)
                                                        }}>
                                                            {alteracao.tipo === 'aumento' ? 'Aumento' :
                                                             alteracao.tipo === 'reducao' ? 'Redução' : 'Mantido'}
                                                        </span>
                                                    </div>
                                                    <div style={styles.historicoItemInfo}>
                                                        <div style={styles.infoItem}>
                                                            <span style={styles.infoLabel}>Data:</span> {formatarData(item.dataAlteracao || item.dataVigencia)}
                                                        </div>
                                                        <div style={styles.infoItem}>
                                                            <span style={styles.infoLabel}>Responsável:</span> {item.responsavel || 'N/A'}
                                                        </div>
                                                        <div style={styles.infoItem}>
                                                            <span style={styles.infoLabel}>Motivo:</span> {item.motivo || 'N/A'}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div style={styles.historicoItemNumber}>
                                                    #{index + 1}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        flex: 1,
        minHeight: '100vh',
        margin: '-24px',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        padding: '16px 32px',
        backgroundColor: '#ffffff',
    },
    content: {
        padding: '24px',
    },
    headerSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '24px',
    },
    backButton: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8px',
        borderRadius: '6px',
        border: 'none',
        backgroundColor: 'transparent',
        cursor: 'pointer',
        color: '#343a40',
        transition: 'all 0.2s',
    },
    title: {
        fontSize: '24px',
        fontWeight: '600',
        margin: 0,
        color: '#212529',
    },
    subtitle: {
        fontSize: '14px',
        color: '#6c757d',
        margin: '4px 0 0 0',
        fontFamily: 'system-ui'
    },
    cardsContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
    },
    card: {
        backgroundColor: '#ffffff',
        border: '1px solid #e9ecef',
        borderRadius: '12px',
    },
    cardHeader: {
        padding: '24px 24px 0 24px',
        paddingBottom: '24px',
    },
    cardHeaderTop: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '8px',
    },
    cardTitle: {
        fontSize: '18px',
        fontWeight: '600',
        margin: 0,
        color: '#212529',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    cardDescription: {
        fontSize: '14px',
        color: '#6c757d',
        margin: '6px 0 0 0',
        fontFamily: 'system-ui'
    },
    cardContent: {
        padding: '24px',
    },
    badge: {
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 8px',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: '500',
        border: '1px solid #e9ecef',
        backgroundColor: '#f8f9fa',
        color: '#495057',
    },
    badgeAumento: {
        backgroundColor: '#dc2626',
        color: '#ffffff',
        border: 'none',
    },
    badgeReducao: {
        backgroundColor: '#10b981',
        color: '#ffffff',
        border: 'none',
    },
    badgeMantido: {
        backgroundColor: '#6b7280',
        color: '#ffffff',
        border: 'none',
    },
    historicoList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    historicoItem: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px',
        border: '1px solid #e9ecef',
        borderRadius: '8px',
    },
    historicoItemContent: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    historicoItemHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    precoChange: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    precoText: {
        fontSize: '14px',
        fontWeight: '500',
        color: '#212529',
    },
    historicoItemInfo: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '8px',
        fontSize: '14px',
        color: '#6c757d',
    },
    infoItem: {
        display: 'flex',
        gap: '4px',
    },
    infoLabel: {
        fontWeight: '500',
        color: '#495057',
    },
    historicoItemNumber: {
        fontSize: '14px',
        color: '#6c757d',
        textAlign: 'right',
    },
    resumoGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '16px',
    },
    resumoItem: {
        textAlign: 'center',
        padding: '16px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        
    },
    resumoAumento: {
        backgroundColor: '#fef2f2',
        borderColor: '#fecaca',
    },
    resumoReducao: {
        backgroundColor: '#f0fdf4',
        borderColor: '#bbf7d0',
    },
    resumoMantido: {
        backgroundColor: '#f9fafb',
        borderColor: '#e5e7eb',
    },
    resumoValue: {
        fontSize: '24px',
        fontWeight: '600',
        marginBottom: '4px',
        color: '#212529',
    },
    resumoLabel: {
        fontSize: '14px',
        color: '#6c757d',
    },
    emptyState: {
        textAlign: 'center',
        padding: '48px',
        color: '#6c757d',
    },
    loading: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '48px',
        fontSize: '16px',
        color: '#6c757d',
    },
    error: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '48px',
        fontSize: '16px',
        color: '#dc3545',
    },
};

export default ListagemHistorico;