import React from 'react';

function Quantidade({ 
    tipoSelecionado = 'quantidade', 
    onTipoChange,
    quantidade = 1,
    valor = 0,
    onQuantidadeChange,
    onValorChange,
    onAdicionar,
    unidade = 'L',
    mostrarRadioButtons = true,
    precoPorUnidade = 0,
    permiteFracao = false
}) {
    const incremento = permiteFracao ? 0.1 : 1;
    const minQuantidade = permiteFracao ? 0.1 : 1;
    
    const handleDiminuir = () => {
        const novaQuantidade = quantidade - incremento;
        if (novaQuantidade >= minQuantidade) {
            onQuantidadeChange(permiteFracao ? parseFloat(novaQuantidade.toFixed(1)) : Math.max(1, Math.floor(novaQuantidade)));
        }
    };

    const handleAumentar = () => {
        const novaQuantidade = quantidade + incremento;
        onQuantidadeChange(permiteFracao ? parseFloat(novaQuantidade.toFixed(1)) : Math.floor(novaQuantidade));
    };

    const handleQuantidadeInputChange = (e) => {
        const value = parseFloat(e.target.value) || 0;
        const minValue = permiteFracao ? 0.1 : 1;
        onQuantidadeChange(value >= minValue ? (permiteFracao ? value : Math.max(1, Math.floor(value))) : minValue);
    };

    const handleValorInputChange = (e) => {
        const value = parseFloat(e.target.value) || 0;
        onValorChange(value >= 0 ? value : 0);
    };

    const litrosAproximados = React.useMemo(() => {
        if (tipoSelecionado === 'preco' && valor > 0 && precoPorUnidade > 0) {
            return parseFloat((valor / precoPorUnidade).toFixed(2));
        }
        return null;
    }, [tipoSelecionado, valor, precoPorUnidade]);

    const tipoAtual = mostrarRadioButtons ? tipoSelecionado : 'quantidade';

    return (
        <div style={{
            border: '1px solid rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            backgroundColor: 'rgb(243, 243, 245)',
            padding: '16px'
        }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {mostrarRadioButtons && (
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input
                                type="radio"
                                id="by-quantity"
                                name="tipo-venda"
                                checked={tipoSelecionado === 'quantidade'}
                                onChange={() => onTipoChange('quantidade')}
                                style={{ cursor: 'pointer' }}
                            />
                            <label 
                                htmlFor="by-quantity"
                                style={{
                                    fontSize: '14px',
                                    fontFamily: 'system-ui',
                                    fontWeight: 500,
                                    lineHeight: '20px',
                                    cursor: 'pointer',
                                    userSelect: 'none'
                                }}
                            >
                                Por Quantidade
                            </label>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input
                                type="radio"
                                id="by-price"
                                name="tipo-venda"
                                checked={tipoSelecionado === 'preco'}
                                onChange={() => onTipoChange('preco')}
                                style={{ cursor: 'pointer' }}
                            />
                            <label 
                                htmlFor="by-price"
                                style={{
                                    fontSize: '14px',
                                    fontFamily: 'system-ui',
                                    fontWeight: 500,
                                    lineHeight: '20px',
                                    cursor: 'pointer',
                                    userSelect: 'none'
                                }}
                            >
                                Por Preço
                            </label>
                        </div>
                    </div>
                )}

                {tipoAtual === 'quantidade' ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <label 
                            htmlFor="quantidade-input"
                            style={{
                                fontSize: '14px',
                                fontFamily: 'system-ui',
                                fontWeight: 500,
                                lineHeight: '20px',
                                userSelect: 'none'
                            }}
                        >
                            Quantidade ({unidade}):
                        </label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <button
                                type="button"
                                onClick={handleDiminuir}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '32px',
                                    height: '32px',
                                    border: '1px solid rgba(0, 0, 0, 0.1)',
                                    borderRadius: '6px',
                                    backgroundColor: '#ffffff',
                                    color: '#0f172a',
                                    cursor: 'pointer',
                                    fontFamily: 'system-ui',
                                    fontSize: '14px',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgb(243, 243, 245)'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = '#ffffff'}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14"></path>
                                </svg>
                            </button>
                            <input
                                type="number"
                                id="quantidade-input"
                                step={permiteFracao ? "0.1" : "1"}
                                min={minQuantidade}
                                value={quantidade}
                                onChange={handleQuantidadeInputChange}
                                style={{
                                    width: '96px',
                                    height: '36px',
                                    textAlign: 'center',
                                    border: '1px solid rgba(0, 0, 0, 0.1)',
                                    borderRadius: '6px',
                                    backgroundColor: '#ffffff',
                                    fontSize: '14px',
                                    fontFamily: 'system-ui',
                                    padding: '0 12px',
                                    outline: 'none'
                                }}
                            />
                            <button
                                type="button"
                                onClick={handleAumentar}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '32px',
                                    height: '32px',
                                    border: '1px solid rgba(0, 0, 0, 0.1)',
                                    borderRadius: '6px',
                                    backgroundColor: '#ffffff',
                                    color: '#0f172a',
                                    cursor: 'pointer',
                                    fontFamily: 'system-ui',
                                    fontSize: '14px',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgb(243, 243, 245)'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = '#ffffff'}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14"></path>
                                    <path d="M12 5v14"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <label 
                            htmlFor="valor-input"
                            style={{
                                fontSize: '14px',
                                fontFamily: 'system-ui',
                                fontWeight: 500,
                                lineHeight: '20px',
                                userSelect: 'none'
                            }}
                        >
                            Valor (R$):
                        </label>
                        <input
                            type="number"
                            id="valor-input"
                            step="0.01"
                            min="0"
                            placeholder="0,00"
                            value={valor || ''}
                            onChange={handleValorInputChange}
                            style={{
                                width: '128px',
                                height: '36px',
                                border: '1px solid rgba(0, 0, 0, 0.1)',
                                borderRadius: '6px',
                                backgroundColor: '#ffffff',
                                fontSize: '14px',
                                fontFamily: 'system-ui',
                                padding: '0 12px',
                                outline: 'none'
                            }}
                        />
                        {litrosAproximados !== null && (
                            <span style={{
                                fontSize: '14px',
                                fontFamily: 'system-ui',
                                color: 'rgb(113, 113, 130)'
                            }}>
                                ≈ {litrosAproximados}{unidade}
                            </span>
                        )}
                    </div>
                )}

                <button
                    type="button"
                    onClick={onAdicionar}
                    style={{
                        width: '100%',
                        height: '36px',
                        backgroundColor: '#000000',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontFamily: 'system-ui',
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'background-color 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#333333'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#000000'}
                >
                    Adicionar à Venda
                </button>
            </div>
        </div>
    );
}

export default Quantidade;