import React, { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../config/axios';

function ModalVendas({
    vendas = [],
    onClose,
    onVendaCancelada
}) {
    const [vendasCanceladas, setVendasCanceladas] = useState(new Set(
        vendas.filter(v => v.cancelada).map(v => v.id)
    ));

    const formatarPreco = (valor) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    };

    const formatarData = (dataStr) => {
        if (!dataStr) return 'N/A';
        const data = new Date(dataStr);
        if (isNaN(data.getTime())) return 'N/A';
        return `${String(data.getDate()).padStart(2, '0')}/${String(data.getMonth() + 1).padStart(2, '0')}/${data.getFullYear()}, ${String(data.getHours()).padStart(2, '0')}:${String(data.getMinutes()).padStart(2, '0')}`;
    };

    const obterTipoItem = (item) => {
        if (item.unidade === 'L' || item.unidade === 'litro' || item.titulo?.toLowerCase().includes('gasolina') || item.titulo?.toLowerCase().includes('etanol') || item.titulo?.toLowerCase().includes('diesel')) {
            return 'Combustível';
        }
        if (item.unidade === 'serviço' || item.titulo?.toLowerCase().includes('lavagem') || item.titulo?.toLowerCase().includes('serviço')) {
            return 'Serviço';
        }
        return 'Produto';
    };

    const handleCancelarVenda = (vendaId) => {
        const novoSet = new Set(vendasCanceladas);
        novoSet.add(vendaId);
        setVendasCanceladas(novoSet);
    };

    const isVendaCancelada = (vendaId) => {
        const venda = vendas.find(v => v.id === vendaId);
        return venda?.cancelada === true || vendasCanceladas.has(vendaId);
    };

    const totalGeral = vendas
        .filter(venda => !isVendaCancelada(venda.id))
        .reduce((sum, venda) => sum + (venda.total || 0), 0);

    const vendasAtivas = vendas.filter(venda => !isVendaCancelada(venda.id));

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px'
            }}
            onClick={onClose}
        >
            <div
                style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    padding: '24px',
                    width: '100%',
                    maxWidth: '800px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    position: 'relative',
                    maxHeight: '90vh',
                    overflowY: 'auto'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '4px',
                        opacity: 0.7,
                        transition: 'opacity 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = 0.7}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M18 6 6 18"></path>
                        <path d="m6 6 12 12"></path>
                    </svg>
                </button>

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    marginBottom: '16px'
                }}>
                    <h2 style={{
                        fontSize: '18px',
                        fontFamily: 'system-ui',
                        fontWeight: 600,
                        lineHeight: '24px',
                        color: '#0f172a',
                        margin: 0,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"></path>
                            <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path>
                            <path d="M12 17.5v-11"></path>
                        </svg>
                        Vendas Finalizadas
                    </h2>
                    <p style={{
                        fontSize: '14px',
                        fontFamily: 'system-ui',
                        color: 'rgb(113, 113, 130)',
                        margin: 0
                    }}>
                        Histórico de vendas do turno atual
                    </p>
                </div>

                {vendas.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '48px',
                        color: 'rgb(113, 113, 130)'
                    }}>
                        <p style={{
                            fontSize: '14px',
                            fontFamily: 'system-ui',
                            margin: 0
                        }}>
                            Nenhuma venda registrada ainda
                        </p>
                    </div>
                ) : (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px'
                    }}>
                        {vendas.map((venda, index) => {
                            const cancelada = isVendaCancelada(venda.id);
                            
                            return (
                                <div
                                    key={venda.id || index}
                                    style={{
                                        backgroundColor: cancelada ? '#e9ecef' : '#ffffff',
                                        borderRadius: '12px',
                                        border: `2px solid ${cancelada ? '#adb5bd' : 'rgba(0, 0, 0, 0.1)'}`,
                                        padding: '16px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '16px',
                                        opacity: cancelada ? 0.6 : 1,
                                        pointerEvents: cancelada ? 'none' : 'auto',
                                        position: 'relative'
                                    }}
                                >
                                    {cancelada && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '16px',
                                            right: '16px',
                                            padding: '4px 8px',
                                            borderRadius: '6px',
                                            backgroundColor: '#6c757d',
                                            color: '#ffffff',
                                            fontSize: '12px',
                                            fontFamily: 'system-ui',
                                            fontWeight: 500
                                        }}>
                                            Cancelada
                                        </div>
                                    )}
                                    
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        justifyContent: 'space-between',
                                        marginBottom: '16px'
                                    }}>
                                        <div>
                                            <p style={{
                                                fontSize: '14px',
                                                fontFamily: 'system-ui',
                                                color: cancelada ? '#6c757d' : 'rgb(113, 113, 130)',
                                                margin: '0 0 4px 0'
                                            }}>
                                                {formatarData(venda.data)}
                                            </p>
                                            <p style={{
                                                fontSize: '14px',
                                                fontFamily: 'system-ui',
                                                color: cancelada ? '#6c757d' : '#0f172a',
                                                margin: 0
                                            }}>
                                                {venda.itens?.length || 0} item(ns)
                                            </p>
                                        </div>
                                        {!cancelada && (
                                            <button
                                                type="button"
                                                onClick={() => handleCancelarVenda(venda.id)}
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '6px',
                                                    height: '32px',
                                                    padding: '0 12px',
                                                    borderRadius: '6px',
                                                    border: 'none',
                                                    backgroundColor: '#dc2626',
                                                    color: '#ffffff',
                                                    fontSize: '14px',
                                                    fontFamily: 'system-ui',
                                                    fontWeight: 500,
                                                    cursor: 'pointer',
                                                    transition: 'background-color 0.2s'
                                                }}
                                                onMouseEnter={(e) => e.target.style.backgroundColor = '#b91c1c'}
                                                onMouseLeave={(e) => e.target.style.backgroundColor = '#dc2626'}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path d="M10 11v6"></path>
                                                    <path d="M14 11v6"></path>
                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                                                    <path d="M3 6h18"></path>
                                                    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                </svg>
                                                Cancelar venda
                                            </button>
                                        )}
                                    </div>

                                    {venda.itens && venda.itens.length > 0 && (
                                        <>
                                            <div style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '8px',
                                                marginBottom: '12px'
                                            }}>
                                                {venda.itens.map((item, itemIndex) => (
                                                    <div
                                                        key={itemIndex}
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'flex-start',
                                                            justifyContent: 'space-between',
                                                            padding: '8px',
                                                            backgroundColor: cancelada ? '#dee2e6' : '#f8f9fa',
                                                            borderRadius: '6px'
                                                        }}
                                                    >
                                                        <div style={{ flex: 1 }}>
                                                            <div style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '8px',
                                                                marginBottom: '4px'
                                                            }}>
                                                                <p style={{
                                                                    fontSize: '14px',
                                                                    fontFamily: 'system-ui',
                                                                    fontWeight: 500,
                                                                    color: cancelada ? '#6c757d' : '#0f172a',
                                                                    margin: 0
                                                                }}>
                                                                    {item.titulo}
                                                                </p>
                                                                <span style={{
                                                                    display: 'inline-flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    padding: '2px 8px',
                                                                    borderRadius: '6px',
                                                                    fontSize: '12px',
                                                                    fontFamily: 'system-ui',
                                                                    fontWeight: 500,
                                                                    backgroundColor: cancelada ? '#ced4da' : '#e9ecef',
                                                                    color: cancelada ? '#495057' : '#495057',
                                                                    border: '1px solid transparent'
                                                                }}>
                                                                    {obterTipoItem(item)}
                                                                </span>
                                                            </div>
                                                            <p style={{
                                                                fontSize: '14px',
                                                                fontFamily: 'system-ui',
                                                                color: cancelada ? '#868e96' : 'rgb(113, 113, 130)',
                                                                margin: '4px 0 0 0'
                                                            }}>
                                                                {item.quantidade?.toFixed(2) || 0}{item.unidade || ''} × {formatarPreco(item.precoUnitario || 0)}
                                                            </p>
                                                        </div>
                                                        <div style={{
                                                            textAlign: 'right'
                                                        }}>
                                                            <p style={{
                                                                fontSize: '14px',
                                                                fontFamily: 'system-ui',
                                                                fontWeight: 500,
                                                                color: cancelada ? '#6c757d' : '#0f172a',
                                                                margin: 0
                                                            }}>
                                                                {formatarPreco(item.valorTotal || 0)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div style={{
                                                borderTop: '1px solid rgba(0, 0, 0, 0.1)',
                                                paddingTop: '12px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between'
                                            }}>
                                                <span style={{
                                                    fontSize: '14px',
                                                    fontFamily: 'system-ui',
                                                    color: cancelada ? '#6c757d' : '#0f172a'
                                                }}>
                                                    Total da Venda:
                                                </span>
                                                <span style={{
                                                    fontSize: '20px',
                                                    fontFamily: 'system-ui',
                                                    fontWeight: 600,
                                                    color: cancelada ? '#6c757d' : '#0f172a',
                                                    textDecoration: cancelada ? 'line-through' : 'none'
                                                }}>
                                                    {formatarPreco(venda.total || 0)}
                                                </span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            );
                        })}

                        <div style={{
                            borderTop: '1px solid rgba(0, 0, 0, 0.1)',
                            paddingTop: '16px'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: '4px'
                            }}>
                                <span style={{
                                    fontSize: '14px',
                                    fontFamily: 'system-ui',
                                    fontWeight: 500,
                                    color: '#0f172a'
                                }}>
                                    Total Geral:
                                </span>
                                <span style={{
                                    fontSize: '20px',
                                    fontFamily: 'system-ui',
                                    fontWeight: 600,
                                    color: '#0f172a'
                                }}>
                                    {formatarPreco(totalGeral)}
                                </span>
                            </div>
                            <p style={{
                                fontSize: '14px',
                                fontFamily: 'system-ui',
                                color: 'rgb(113, 113, 130)',
                                margin: '4px 0 0 0'
                            }}>
                                {vendasAtivas.length} venda(s) realizada(s)
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ModalVendas;