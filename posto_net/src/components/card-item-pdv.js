import React from 'react';

function CardItemPDV({
    titulo,
    label,
    valor,
    unidade,
    quantidade,
    situacao,
    tipoExibicao = 'estoque',
    selecionado = false,
    onClick
}) {
    return (
        <div 
            onClick={onClick}
            style={{
                border: selecionado ? '1px solid #000000' : '1px solid rgba(0, 0, 0, 0.1)',
                borderRadius: '8px',
                backgroundColor: selecionado ? 'rgb(243, 243, 245)' : '#ffffff',
                padding: '12px',
                marginBottom: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s'
            }}
        >
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px'
            }}>
                <h3 style={{
                    margin: 0,
                    fontSize: '16px',
                    fontFamily: 'system-ui',
                    fontWeight: 400,
                    lineHeight: '24px',
                    color: '#0f172a'
                }}>
                    {titulo}
                </h3>
                {label && (
                    <span style={{
                        display: 'inline-block',
                        padding: '2px 8px',
                        backgroundColor: 'rgb(243, 243, 245)',
                        color: '#333',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '500',
                        textTransform: 'capitalize',
                        whiteSpace: 'nowrap',
                        fontFamily: 'system-ui'
                    }}>
                        {label}
                    </span>
                )}
            </div>

            <div style={{
                marginBottom: '8px'
            }}>
                <span style={{
                    fontSize: '14px',
                    fontFamily: 'system-ui',
                    fontWeight: 400,
                    color: 'rgb(113, 113, 130)'
                }}>
                    {valor}
                </span>
                {unidade && (
                    <span style={{
                        fontSize: '14px',
                        fontFamily: 'system-ui',
                        color: 'rgb(113, 113, 130)',
                        marginLeft: '4px'
                    }}>
                        / {unidade}
                    </span>
                )}
            </div>

            <div>
                {tipoExibicao === 'estoque' && quantidade !== undefined ? (
                    <span style={{
                        fontSize: '14px',
                        fontFamily: 'system-ui',
                        color: '#0f172a'
                    }}>
                        Estoque: {quantidade}
                        {unidade && `/${unidade}`}
                    </span>
                ) : tipoExibicao === 'status' && situacao ? (
                    <span style={{
                        fontSize: '14px',
                        fontFamily: 'system-ui',
                        color: '#0f172a'
                    }}>
                        Status: {situacao}
                    </span>
                ) : null}
            </div>
        </div>
    );
}

export default CardItemPDV;