import React from 'react';

function ModalFecharTurno({
    operadorNome,
    turno,
    horaAbertura,
    totalVendas = 0,
    transacoes = 0,
    totalCartao = 0,
    totalDinheiro = 0,
    valorInicial = 100.00,
    onClose,
    onConfirmar
}) {
    const [valorFinalCaixa, setValorFinalCaixa] = React.useState('');

    const formatarPreco = (valor) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    };

    const formatarTurno = (turno) => {
        if (!turno) return '';
        const turnos = {
            'matutino': 'matutino',
            'vespertino': 'vespertino',
            'noturno': 'noturno'
        };
        return turnos[turno] || turno;
    };

    const valorEsperado = valorInicial + totalDinheiro;

    const valorFinalNum = parseFloat(valorFinalCaixa) || 0;
    const diferenca = valorEsperado - valorFinalNum;
    const faltaDinheiro = diferenca > 0;

    const handleConfirmar = () => {
        if (onConfirmar) {
            onConfirmar({
                valorFinalCaixa: valorFinalNum,
                valorEsperado: valorEsperado,
                diferenca: diferenca
            });
        }
    };

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
                    maxWidth: '448px',
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
                        margin: 0
                    }}>
                        Fechamento de Turno
                    </h2>
                    <p style={{
                        fontSize: '14px',
                        fontFamily: 'system-ui',
                        color: 'rgb(113, 113, 130)',
                        margin: 0
                    }}>
                        Confira os dados do turno e informe o valor final em caixa
                    </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '12px',
                        border: '1px solid rgba(0, 0, 0, 0.1)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '24px'
                    }}>
                        <div style={{
                            padding: '16px 24px',
                            paddingTop: '16px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                                    style={{ color: 'rgb(113, 113, 130)', flexShrink: 0 }}
                                >
                                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                                <span style={{
                                    fontSize: '14px',
                                    fontFamily: 'system-ui',
                                    color: '#0f172a'
                                }}>
                                    Operador: {operadorNome || 'Não informado'}
                                </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                                    style={{ color: 'rgb(113, 113, 130)', flexShrink: 0 }}
                                >
                                    <path d="M12 6v6l4 2"></path>
                                    <circle cx="12" cy="12" r="10"></circle>
                                </svg>
                                <span style={{
                                    fontSize: '14px',
                                    fontFamily: 'system-ui',
                                    color: '#0f172a'
                                }}>
                                    Turno: {formatarTurno(turno)} • Início: {horaAbertura || 'Não informado'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '12px',
                        border: '1px solid rgba(0, 0, 0, 0.1)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '24px'
                    }}>
                        <div style={{
                            padding: '16px 24px',
                            paddingTop: '16px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px'
                        }}>
                            <h4 style={{
                                fontSize: '16px',
                                fontFamily: 'system-ui',
                                fontWeight: 500,
                                color: '#0f172a',
                                margin: 0,
                                marginBottom: '8px'
                            }}>
                                Resumo de Vendas
                            </h4>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '16px',
                                fontSize: '14px',
                                fontFamily: 'system-ui'
                            }}>
                                <div>
                                    <span style={{
                                        color: 'rgb(113, 113, 130)',
                                        display: 'block',
                                        marginBottom: '4px'
                                    }}>
                                        Total de Vendas:
                                    </span>
                                    <p style={{
                                        fontFamily: 'system-ui',
                                        fontWeight: 500,
                                        color: '#0f172a',
                                        margin: 0
                                    }}>
                                        {formatarPreco(totalVendas)}
                                    </p>
                                </div>
                                <div>
                                    <span style={{
                                        color: 'rgb(113, 113, 130)',
                                        display: 'block',
                                        marginBottom: '4px'
                                    }}>
                                        Transações:
                                    </span>
                                    <p style={{
                                        fontFamily: 'system-ui',
                                        fontWeight: 500,
                                        color: '#0f172a',
                                        margin: 0
                                    }}>
                                        {transacoes}
                                    </p>
                                </div>
                                <div>
                                    <span style={{
                                        color: 'rgb(113, 113, 130)',
                                        display: 'block',
                                        marginBottom: '4px'
                                    }}>
                                        Cartão:
                                    </span>
                                    <p style={{
                                        fontFamily: 'system-ui',
                                        fontWeight: 500,
                                        color: '#0f172a',
                                        margin: 0
                                    }}>
                                        {formatarPreco(totalCartao)}
                                    </p>
                                </div>
                                <div>
                                    <span style={{
                                        color: 'rgb(113, 113, 130)',
                                        display: 'block',
                                        marginBottom: '4px'
                                    }}>
                                        Dinheiro:
                                    </span>
                                    <p style={{
                                        fontFamily: 'system-ui',
                                        fontWeight: 500,
                                        color: '#0f172a',
                                        margin: 0
                                    }}>
                                        {formatarPreco(totalDinheiro)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '12px',
                        border: '1px solid rgba(0, 0, 0, 0.1)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '24px'
                    }}>
                        <div style={{
                            padding: '16px 24px',
                            paddingTop: '16px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px'
                        }}>
                            <h4 style={{
                                fontSize: '16px',
                                fontFamily: 'system-ui',
                                fontWeight: 500,
                                color: '#0f172a',
                                margin: 0,
                                marginBottom: '8px'
                            }}>
                                Conferência de Caixa
                            </h4>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px',
                                fontSize: '14px',
                                fontFamily: 'system-ui',
                                marginBottom: '16px'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'rgb(113, 113, 130)' }}>Valor Inicial:</span>
                                    <span style={{ color: '#0f172a' }}>{formatarPreco(valorInicial)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'rgb(113, 113, 130)' }}>Entradas em Dinheiro:</span>
                                    <span style={{ color: '#0f172a' }}>{formatarPreco(totalDinheiro)}</span>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    fontFamily: 'system-ui',
                                    fontWeight: 500,
                                    borderTop: '1px solid rgba(0, 0, 0, 0.1)',
                                    paddingTop: '8px'
                                }}>
                                    <span style={{ color: '#0f172a' }}>Valor Esperado:</span>
                                    <span style={{ color: '#0f172a' }}>{formatarPreco(valorEsperado)}</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label
                                    htmlFor="finalCash"
                                    style={{
                                        fontSize: '14px',
                                        fontFamily: 'system-ui',
                                        fontWeight: 500,
                                        lineHeight: '20px',
                                        color: '#0f172a',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    Valor Final em Caixa
                                </label>
                                <div style={{ position: 'relative' }}>
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
                                        style={{
                                            position: 'absolute',
                                            left: '12px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            color: 'rgb(113, 113, 130)',
                                            pointerEvents: 'none'
                                        }}
                                    >
                                        <line x1="12" x2="12" y1="2" y2="22"></line>
                                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                                    </svg>
                                    <input
                                        type="number"
                                        id="finalCash"
                                        step="0.01"
                                        min="0"
                                        placeholder="0,00"
                                        value={valorFinalCaixa}
                                        onChange={(e) => setValorFinalCaixa(e.target.value)}
                                        style={{
                                            width: '100%',
                                            height: '36px',
                                            borderRadius: '6px',
                                            border: '1px solid rgba(0, 0, 0, 0.1)',
                                            paddingLeft: '40px',
                                            paddingRight: '12px',
                                            fontSize: '14px',
                                            fontFamily: 'system-ui',
                                            backgroundColor: '#ffffff',
                                            color: '#0f172a',
                                            outline: 'none',
                                            transition: 'border-color 0.2s'
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = '#000000'}
                                        onBlur={(e) => e.target.style.borderColor = 'rgba(0, 0, 0, 0.1)'}
                                    />
                                </div>
                                {faltaDinheiro && valorFinalNum > 0 && (
                                    <div style={{
                                        fontSize: '14px',
                                        fontFamily: 'system-ui',
                                        color: '#dc2626'
                                    }}>
                                        Falta: {formatarPreco(diferenca)}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{
                    display: 'flex',
                    flexDirection: 'column-reverse',
                    gap: '8px',
                    marginTop: '24px',
                    paddingTop: '24px',
                    borderTop: '1px solid rgba(0, 0, 0, 0.1)'
                }}>
                    <button
                        type="button"
                        onClick={onClose}
                        style={{
                            width: '100%',
                            height: '36px',
                            borderRadius: '6px',
                            border: '1px solid rgba(0, 0, 0, 0.1)',
                            backgroundColor: '#ffffff',
                            color: '#0f172a',
                            fontSize: '14px',
                            fontFamily: 'system-ui',
                            fontWeight: 500,
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = 'rgb(243, 243, 245)'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#ffffff'}
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirmar}
                        style={{
                            width: '100%',
                            height: '36px',
                            borderRadius: '6px',
                            border: 'none',
                            backgroundColor: '#000000',
                            color: '#ffffff',
                            fontSize: '14px',
                            fontFamily: 'system-ui',
                            fontWeight: 500,
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#333333'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#000000'}
                    >
                        Fechar Turno
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ModalFecharTurno;