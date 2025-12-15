import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../config/axios';
import iconeColuna from '../icones/coluna.svg';

function ListagemEstatisticas({ toggleMenu }) {
    const { idParam } = useParams();
    const navigate = useNavigate();
    
    const [combustivel, setCombustivel] = useState(null);
    const [historico, setHistorico] = useState([]);
    const [historicoData, setHistoricoData] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [estatisticas, setEstatisticas] = useState({
        precoAtual: 0,
        mediaMes: 0,
        variacaoMensal: 0,
        alteracoesMes: 0
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
                const historicoDataArray = Array.isArray(responseHistorico.data) ? responseHistorico.data : [];
                setHistoricoData(historicoDataArray); 
                
                const historicoProcessado = processarHistorico(historicoDataArray);
                setHistorico(historicoProcessado);

                const stats = calcularEstatisticas(dadosCombustivel, historicoDataArray);
                setEstatisticas(stats);
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
                alert('Erro ao carregar estatísticas');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [idParam, navigate]);

    const calcularEstatisticas = (combustivelData, historicoData) => {
        let precoAtual = combustivelData.preco;
        if (typeof precoAtual === 'string') {
            precoAtual = parseFloat(precoAtual.replace(/[^\d,.-]/g, '').replace(',', '.')) || 0;
        } else {
            precoAtual = parseFloat(precoAtual) || 0;
        }
        
        if (!historicoData || historicoData.length === 0) {
            return {
                precoAtual,
                mediaMes: precoAtual,
                variacaoMensal: 0,
                alteracoesMes: 0
            };
        }

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

        const ultimoRegistro = historicoOrdenado[0];
        const dataUltimoRegistro = new Date(ultimoRegistro.dataAlteracao || ultimoRegistro.dataVigencia);
        const mesReferencia = dataUltimoRegistro.getMonth();
        const anoReferencia = dataUltimoRegistro.getFullYear();
        
        const historicoMes = historicoOrdenado
            .filter(item => {
                const dataItem = new Date(item.dataAlteracao || item.dataVigencia);
                return dataItem.getMonth() === mesReferencia && 
                       dataItem.getFullYear() === anoReferencia;
            })
            .sort((a, b) => {
                const dataA = new Date(a.dataAlteracao || a.dataVigencia);
                const dataB = new Date(b.dataAlteracao || b.dataVigencia);
                return dataA - dataB;
            });

        const precosMes = historicoMes.map(item => {
            let preco = item.novoPreco || item.preco;
            if (typeof preco === 'string') {
                preco = parseFloat(preco.replace(/[^\d,.-]/g, '').replace(',', '.')) || 0;
            }
            return parseFloat(preco) || 0;
        });
        
        const mediaMes = precosMes.length > 0 
            ? precosMes.reduce((a, b) => a + b, 0) / precosMes.length 
            : precoAtual;

        const primeiroPrecoMes = historicoMes.length > 0 
            ? (() => {
                let preco = historicoMes[0].novoPreco || historicoMes[0].preco;
                if (typeof preco === 'string') {
                    preco = parseFloat(preco.replace(/[^\d,.-]/g, '').replace(',', '.')) || 0;
                }
                return parseFloat(preco) || 0;
            })()
            : precoAtual;
            
        const variacaoMensal = primeiroPrecoMes > 0 
            ? ((precoAtual - primeiroPrecoMes) / primeiroPrecoMes) * 100 
            : 0;

        const alteracoesMes = historicoMes.length;

        return {
            precoAtual,
            mediaMes,
            variacaoMensal,
            alteracoesMes
        };
    };

    const processarHistorico = (historicoData) => {
        const historicoOrdenado = historicoData
            .sort((a, b) => {
                const dataA = new Date(a.dataAlteracao || a.dataVigencia || 0);
                const dataB = new Date(b.dataAlteracao || b.dataVigencia || 0);
                return dataA - dataB;
            })
            .slice(-30)
            .map(item => {
                let preco = item.novoPreco || item.preco;
                if (typeof preco === 'string') {
                    preco = parseFloat(preco.replace(/[^\d,.-]/g, '').replace(',', '.')) || 0;
                }
                return {
                    data: formatarData(item.dataAlteracao || item.dataVigencia),
                    preco: parseFloat(preco) || 0
                };
            });

        return historicoOrdenado;
    };

    const formatarData = (dataStr) => {
        if (!dataStr) return '';
        const data = new Date(dataStr);
        if (isNaN(data.getTime())) return '';
        return `${String(data.getDate()).padStart(2, '0')}/${String(data.getMonth() + 1).padStart(2, '0')}`;
    };

    const formatarPreco = (valor) => {
        if (!valor) return 'R$ 0,00';
        return `R$ ${parseFloat(valor).toFixed(2).replace('.', ',')}`;
    };

    const formatarPercentual = (valor) => {
        const sinal = valor >= 0 ? '+' : '';
        return `${sinal}${valor.toFixed(2).replace('.', ',')}%`;
    };

    const calcularDadosMensais = () => {
        if (historicoData.length === 0) {
            return [];
        }

        const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        const dadosPorMes = {};
        
        historicoData.forEach(item => { 
            const data = new Date(item.dataAlteracao || item.dataVigencia);
            if (isNaN(data.getTime())) return; 
            
            const mes = meses[data.getMonth()];
            const ano = data.getFullYear();
            const chave = `${mes}-${ano}`;
            
            if (!dadosPorMes[chave]) {
                dadosPorMes[chave] = { mes, precos: [], alteracoes: 0 };
            }
            
            let preco = item.novoPreco || item.preco;
            if (typeof preco === 'string') {
                preco = parseFloat(preco.replace(/[^\d,.-]/g, '').replace(',', '.')) || 0;
            }
            dadosPorMes[chave].precos.push(parseFloat(preco) || 0);
            dadosPorMes[chave].alteracoes++;
        });

        return Object.values(dadosPorMes)
            .sort((a, b) => {
                const mesesOrder = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
                return mesesOrder.indexOf(a.mes) - mesesOrder.indexOf(b.mes);
            })
            .map(dados => ({
                mes: dados.mes,
                preco: dados.precos.length > 0 
                    ? dados.precos.reduce((a, b) => a + b, 0) / dados.precos.length 
                    : 0,
                alteracoes: dados.alteracoes
            }))
            .slice(-4);
    };

    const dadosMensais = calcularDadosMensais();
    const dadosGrafico = historico.length > 0 ? historico : [];

    const renderLineChart = () => {
        if (dadosGrafico.length === 0) {
            return (
                <div style={styles.emptyChart}>
                    <p style={styles.emptyChartText}>Nenhum dado de histórico disponível</p>
                    <p style={styles.emptyChartSubtext}>Os dados aparecerão aqui quando houver alterações de preço registradas</p>
                </div>
            );
        }

        const width = 800;
        const height = 320;
        const padding = { top: 20, right: 20, bottom: 40, left: 60 };
        const chartWidth = width - padding.left - padding.right;
        const chartHeight = height - padding.top - padding.bottom;

        const precos = dadosGrafico.map(d => d.preco);
        const minPreco = Math.min(...precos);
        const maxPreco = Math.max(...precos);
        const range = maxPreco - minPreco || 1;

        const points = dadosGrafico.map((item, index) => {
            const x = padding.left + (index / (dadosGrafico.length - 1 || 1)) * chartWidth;
            const y = padding.top + chartHeight - ((item.preco - minPreco) / range) * chartHeight;
            return { x, y, ...item };
        });

        const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

        return (
            <svg width={width} height={height} style={{ overflow: 'visible' }}>
                {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                    const y = padding.top + chartHeight - (ratio * chartHeight);
                    const value = minPreco + (range * ratio);
                    return (
                        <g key={i}>
                            <line
                                x1={padding.left}
                                y1={y}
                                x2={width - padding.right}
                                y2={y}
                                stroke="#ccc"
                                strokeDasharray="3 3"
                            />
                            <text
                                x={padding.left - 10}
                                y={y + 5}
                                fill="#666"
                                fontSize="12"
                                textAnchor="end"
                            >
                                {formatarPreco(value)}
                            </text>
                        </g>
                    );
                })}

                {dadosGrafico.map((item, index) => {
                    const x = padding.left + (index / (dadosGrafico.length - 1 || 1)) * chartWidth;
                    return (
                        <text
                            key={index}
                            x={x}
                            y={height - padding.bottom + 20}
                            fill="#666"
                            fontSize="12"
                            textAnchor="middle"
                        >
                            {item.data || item.mes}
                        </text>
                    );
                })}

                <path
                    d={pathData}
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="2"
                />

                {points.map((point, index) => (
                    <circle
                        key={index}
                        cx={point.x}
                        cy={point.y}
                        r="4"
                        fill="#2563eb"
                    />
                ))}
            </svg>
        );
    };

    const renderBarChart = () => {
        if (dadosMensais.length === 0) {
            return (
                <div style={styles.emptyChart}>
                    <p style={styles.emptyChartText}>Nenhum dado mensal disponível</p>
                    <p style={styles.emptyChartSubtext}>Os dados aparecerão aqui quando houver histórico de preços por mês</p>
                </div>
            );
        }

        const width = 600;
        const height = 256;
        const padding = { top: 20, right: 20, bottom: 40, left: 60 };
        const chartWidth = width - padding.left - padding.right;
        const chartHeight = height - padding.top - padding.bottom;

        const precos = dadosMensais.map(d => d.preco);
        const maxPreco = Math.max(...precos, 1);

        const barWidth = chartWidth / dadosMensais.length * 0.6;
        const barSpacing = chartWidth / dadosMensais.length;

        return (
            <svg width={width} height={height} style={{ overflow: 'visible' }}>
                {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                    const y = padding.top + chartHeight - (ratio * chartHeight);
                    const value = maxPreco * ratio;
                    return (
                        <g key={i}>
                            <line
                                x1={padding.left}
                                y1={y}
                                x2={width - padding.right}
                                y2={y}
                                stroke="#ccc"
                                strokeDasharray="3 3"
                            />
                            <text
                                x={padding.left - 10}
                                y={y + 5}
                                fill="#666"
                                fontSize="12"
                                textAnchor="end"
                            >
                                {formatarPreco(value)}
                            </text>
                        </g>
                    );
                })}

                {dadosMensais.map((item, index) => {
                    const barHeight = (item.preco / maxPreco) * chartHeight;
                    const x = padding.left + (index * barSpacing) + (barSpacing - barWidth) / 2;
                    const y = padding.top + chartHeight - barHeight;

                    return (
                        <g key={index}>
                            <rect
                                x={x}
                                y={y}
                                width={barWidth}
                                height={barHeight}
                                fill="#10b981"
                            />
                            <text
                                x={x + barWidth / 2}
                                y={padding.top + chartHeight + 20}
                                fill="#666"
                                fontSize="12"
                                textAnchor="middle"
                            >
                                {item.mes}
                            </text>
                        </g>
                    );
                })}
            </svg>
        );
    };

    if (loading) {
        return (
            <div style={styles.container}>
                <div style={styles.loading}>Carregando estatísticas...</div>
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
                        <svg
                            width="24"
                            height="24"
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
                    </button>
                    <div>
                        <h2 style={styles.title}>Estatísticas de Preços - {combustivel.nome}</h2>
                        <p style={styles.subtitle}>Análise da evolução e comparação de preços</p>
                    </div>
                </div>

                <div style={styles.metricsGrid}>
                    <div style={styles.metricCard}>
                        <div style={{ ...styles.metricValue, color: '#2563eb' }}>
                            {formatarPreco(estatisticas.precoAtual)}
                        </div>
                        <div style={styles.metricLabel}>Preço Atual</div>
                    </div>
                    <div style={styles.metricCard}>
                        <div style={{ ...styles.metricValue, color: '#10b981' }}>
                            {formatarPreco(estatisticas.mediaMes)}
                        </div>
                        <div style={styles.metricLabel}>Média do Mês</div>
                    </div>
                    <div style={styles.metricCard}>
                        <div style={{ ...styles.metricValue, color: '#8b5cf6' }}>
                            {estatisticas.alteracoesMes}
                        </div>
                        <div style={styles.metricLabel}>Alterações no Mês</div>
                    </div>
                </div>

                <div style={styles.chartCard}>
                    <div style={styles.chartHeader}>
                        <h4 style={styles.chartTitle}>Evolução dos Preços</h4>
                        <p style={styles.chartDescription}>Histórico de preços dos últimos 30 dias</p>
                    </div>
                    <div style={styles.chartContent}>
                        {renderLineChart()}
                    </div>
                </div>

                <div style={styles.chartsGrid}>
                    <div style={styles.chartCard}>
                        <div style={styles.chartHeader}>
                            <h4 style={styles.chartTitle}>Média Mensal</h4>
                            <p style={styles.chartDescription}>Preço médio e quantidade de alterações por mês</p>
                        </div>
                        <div style={styles.chartContent}>
                            {renderBarChart()}
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
        minHeight: '100vh'
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        padding: '0 0 16px 0',
        backgroundColor: '#ffffff'
    },
    content: {
        padding: '0px',
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
    metricsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '24px',
    },
    metricCard: {
        backgroundColor: '#ffffff',
        border: '1px solid #e9ecef',
        borderRadius: '12px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    metricValue: {
        fontSize: '24px',
        fontWeight: '600',
        margin: 0,
    },
    metricLabel: {
        fontSize: '14px',
        color: '#6c757d',
        margin: 0,
    },
    chartCard: {
        backgroundColor: '#ffffff',
        border: '1px solid #e9ecef',
        borderRadius: '12px',
        marginBottom: '24px',
    },
    chartHeader: {
        padding: '24px 24px 0 24px',
        borderBottom: '1px solid #e9ecef',
        paddingBottom: '24px',
    },
    chartTitle: {
        fontSize: '18px',
        fontWeight: '600',
        margin: 0,
        color: '#212529',
    },
    chartDescription: {
        fontSize: '14px',
        color: '#6c757d',
        margin: '6px 0 0 0',
        fontFamily: 'system-ui'
    },
    chartContent: {
        padding: '24px',
        height: '320px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    chartsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '24px',
    },
    emptyChart: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: '#6c757d',
    },
    emptyChartText: {
        fontSize: '16px',
        fontWeight: '500',
        margin: '0 0 8px 0',
        color: '#495057',
    },
    emptyChartSubtext: {
        fontSize: '14px',
        margin: 0,
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

export default ListagemEstatisticas;