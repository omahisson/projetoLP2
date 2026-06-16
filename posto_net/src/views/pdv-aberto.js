import React from 'react';

import { useNavigate, useLocation } from 'react-router-dom';

import Card from '../components/card';
import CardItemPDV from '../components/card-item-pdv';
import Quantidade from '../components/quantidade';

import ModalFecharTurno from '../components/modal-fechar-turno';
import ModalVendas from '../components/modal-vendas';

import { listarProdutos } from '../services/produtoService';
import { listarServicos } from '../services/servicoService';
import { listarCombustiveis } from '../services/combustivelService';
import { buscarTurno, listarTurnosAbertos, listarVendasTurno, registrarVenda, cancelarVenda, fecharTurno } from '../services/pdvService';

function PdvAberto({ toggleMenu }) {
    const navigate = useNavigate();
    const location = useLocation();

    const [termoPesquisa, setTermoPesquisa] = React.useState('');
    const [categoriaSelecionada, setCategoriaSelecionada] = React.useState('combustiveis');
    const [produtos, setProdutos] = React.useState([]);
    const [servicos, setServicos] = React.useState([]);
    const [combustiveis, setCombustiveis] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    const [turnoId, setTurnoId] = React.useState(null);
    const [turnoAtual, setTurnoAtual] = React.useState(location.state || null);
    const dadosTurno = turnoAtual || {};
    const { operadorNome, turno, horaAbertura, valorInicialCaixa } = dadosTurno;

    const [tipoVenda, setTipoVenda] = React.useState('quantidade');
    const [quantidade, setQuantidade] = React.useState(1);
    const [valor, setValor] = React.useState(0);

    const [itemSelecionado, setItemSelecionado] = React.useState(null);
    const [itensVenda, setItensVenda] = React.useState([]);

    const [mostrarToast, setMostrarToast] = React.useState(false);
    const [mostrarModalFecharTurno, setMostrarModalFecharTurno] = React.useState(false);
    const [formaPagamento, setFormaPagamento] = React.useState('dinheiro');
    const [vendasFinalizadas, setVendasFinalizadas] = React.useState([]);
    const [mostrarModalVendas, setMostrarModalVendas] = React.useState(false);

    const montarEstadoTurno = React.useCallback((turnoData) => {
        const formatarDataHoraTurno = (dataStr) => {
            if (!dataStr) return '';
            const data = new Date(dataStr);
            if (isNaN(data.getTime())) return '';
            return data.toLocaleString('pt-BR');
        };

        return {
            turnoId: turnoData.id,
            operadorId: turnoData.operadorId,
            operadorNome: turnoData.operadorNome,
            turno: turnoData.turno,
            horaAbertura: formatarDataHoraTurno(turnoData.horaAberturaISO),
            valorInicialCaixa: turnoData.valorInicialCaixa || 0
        };
    }, []);

    React.useEffect(() => {
        const recuperarTurno = async () => {
            try {
                if (location.state?.turnoId) {
                    setTurnoId(location.state.turnoId);
                    setTurnoAtual(location.state);
                    await buscarVendasDoTurno(location.state.turnoId);
                    return;
                }

                const turnoIdSalvo = localStorage.getItem('turnoAbertoId');
                if (turnoIdSalvo) {
                    const turnoData = await buscarTurno(turnoIdSalvo);

                    if (turnoData && turnoData.status === 'aberto') {
                        setTurnoId(turnoData.id);
                        setTurnoAtual(montarEstadoTurno(turnoData));
                        await buscarVendasDoTurno(turnoData.id);
                    } else {
                        localStorage.removeItem('turnoAbertoId');
                        navigate('/pdv');
                    }
                } else {
                    const postoId = localStorage.getItem('postoSelecionadoId');
                    const turnosAbertos = postoId ? await listarTurnosAbertos(postoId) : [];
                    if (turnosAbertos.length > 0) {
                        const turnoAberto = turnosAbertos[0];
                        localStorage.setItem('turnoAbertoId', turnoAberto.id);
                        setTurnoId(turnoAberto.id);
                        setTurnoAtual(montarEstadoTurno(turnoAberto));
                        await buscarVendasDoTurno(turnoAberto.id);
                        return;
                    }
                    navigate('/pdv');
                }
            } catch (error) {
                console.error('Erro ao recuperar turno:', error);
                localStorage.removeItem('turnoAbertoId');
                navigate('/pdv');
            }
        };

        recuperarTurno();
    }, [location.state, navigate, montarEstadoTurno]);

    const buscarVendasDoTurno = async (idTurno) => {
        try {
            const vendas = await listarVendasTurno(idTurno);
            setVendasFinalizadas(vendas);
        } catch (error) {
            console.error('Erro ao buscar vendas do turno:', error);
        }
    };

    const buscarDados = React.useCallback(async () => {
        try {
            const postoId = localStorage.getItem('postoSelecionadoId');
            const [produtosData, servicosData, combustiveisData] = await Promise.all([
                listarProdutos(postoId),
                listarServicos(postoId),
                listarCombustiveis(postoId)
            ]);
            setProdutos(produtosData || []);
            setServicos(servicosData || []);
            setCombustiveis(combustiveisData || []);
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    React.useEffect(() => {
        buscarDados();
    }, [buscarDados]);

    React.useEffect(() => {
        setItemSelecionado(null);
        setQuantidade(1);
        setValor(0);
        setTipoVenda('quantidade');
    }, [categoriaSelecionada]);

    const formatarTurno = (turno) => {
        if (!turno) return '';
        const turnos = {
            'matutino': 'matutino',
            'vespertino': 'vespertino',
            'noturno': 'noturno'
        };
        return turnos[turno] || turno;
    };

    const handleFecharTurno = () => {
        setMostrarModalFecharTurno(true);
    };

    const handleConfirmarFecharTurno = async (dados) => {
        try {
            if (!turnoId) {
                alert('Erro: Turno não identificado.');
                return;
            }

            await fecharTurno(turnoId, {
                valorFinalCaixa: dados.valorFinalCaixa,
                valorEsperado: dados.valorEsperado,
                diferenca: dados.diferenca
            });

            localStorage.removeItem('turnoAbertoId');

            setMostrarModalFecharTurno(false);
            navigate('/pdv');
        } catch (error) {
            console.error('Erro ao salvar fechamento de turno:', error);
            alert('Erro ao salvar fechamento de turno. Tente novamente.');
        }
    };

    const handleVendaCancelada = async (vendaId) => {
        try {
            const vendaAtualizada = await cancelarVenda(vendaId);

            setVendasFinalizadas(prevVendas =>
                prevVendas.map(v => v.id === vendaId ? vendaAtualizada : v)
            );
            await buscarDados();
        } catch (error) {
            console.error('Erro ao atualizar venda cancelada:', error);
        }
    };

    const calcularTotaisVendas = () => {
        const todasVendas = vendasFinalizadas.filter(venda => !venda.cancelada);
        const totalVendas = todasVendas.reduce((sum, venda) => sum + (venda.total || 0), 0);
        const totalCartao = todasVendas
            .filter(venda => venda.formaPagamento === 'cartao')
            .reduce((sum, venda) => sum + (venda.total || 0), 0);
        const totalDinheiro = todasVendas
            .filter(venda => venda.formaPagamento === 'dinheiro')
            .reduce((sum, venda) => sum + (venda.total || 0), 0);

        return {
            total: totalVendas,
            transacoes: todasVendas.length,
            cartao: totalCartao,
            dinheiro: totalDinheiro
        };
    };

    const handleFinalizarVenda = async () => {
        if (itensVenda.length === 0) {
            return;
        }

        if (!turnoId) {
            alert('Erro: Turno não identificado. Por favor, abra o turno novamente.');
            navigate('/pdv');
            return;
        }

        const totalVenda = calcularTotal();
        const novaVenda = {
            idTurno: turnoId,
            itens: itensVenda.map(item => ({
                tipo: item.tipo,
                itemId: item.itemId,
                titulo: item.titulo,
                quantidade: item.quantidade,
                precoUnitario: item.precoUnitario,
                valorTotal: item.valorTotal,
                unidade: item.unidade
            })),
            total: totalVenda,
            formaPagamento: formaPagamento,
            data: new Date().toISOString()
        };

        try {
            const vendaSalva = await registrarVenda(novaVenda);

            setVendasFinalizadas([vendaSalva, ...vendasFinalizadas]);
            setItensVenda([]);
            await buscarDados();
            setMostrarToast(true);

            setTimeout(() => {
                setMostrarToast(false);
            }, 3000);
        } catch (error) {
            console.error('Erro ao salvar venda:', error);
            alert('Erro ao salvar venda. Tente novamente.');
        }
    };

    const formatarPreco = (valor) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    };

    const extrairPrecoNumerico = (valorFormatado) => {
        if (!valorFormatado) return 0;
        return parseFloat(
            valorFormatado
                .replace('R$', '')
                .replace(/\s/g, '')
                .replace(/\./g, '')
                .replace(',', '.')
        ) || 0;
    };

    const handleAdicionarAVenda = () => {
        if (!itemSelecionado) return;
        const qtd = tipoVenda === 'quantidade' ? quantidade : (valor > 0 ? valor / extrairPrecoNumerico(itemSelecionado.valor) : 0);
        const valorFinal = tipoVenda === 'quantidade'
            ? quantidade * extrairPrecoNumerico(itemSelecionado.valor)
            : valor;

        if ((tipoVenda === 'quantidade' && quantidade <= 0) ||
            (tipoVenda === 'preco' && valor <= 0)) {
            return;
        }

        const novoItem = {
            id: Date.now(),
            produtoId: itemSelecionado.id,
            itemId: itemSelecionado.id,
            tipo: itemSelecionado.tipo,
            titulo: itemSelecionado.titulo,
            quantidade: tipoVenda === 'quantidade' ? quantidade : qtd,
            precoUnitario: extrairPrecoNumerico(itemSelecionado.valor),
            valorTotal: valorFinal,
            unidade: itemSelecionado.unidade || 'L'
        };

        setItensVenda([...itensVenda, novoItem]);

        setItemSelecionado(null);
        setQuantidade(1);
        setValor(0);
        setTipoVenda('quantidade');
    };

    const handleRemoverItem = (itemId) => {
        setItensVenda(itensVenda.filter(item => item.id !== itemId));
    };

    const calcularTotal = () => {
        return itensVenda.reduce((total, item) => total + item.valorTotal, 0);
    };

    const itensFiltrados = React.useMemo(() => {
        let itens = [];

        if (categoriaSelecionada === 'servicos') {
            itens = servicos.map(servico => ({
                id: servico.id,
                tipo: 'servico',
                titulo: servico.nome,
                label: servico.labels && servico.labels.length > 0 ? servico.labels[0] : '',
                valor: formatarPreco(servico.preco),
                precoPorUnidade: servico.preco,
                unidade: 'serviço',
                quantidade: servico.estoque || 0,
                tipoExibicao: 'status',
                situacao: 'Disponível'
            }));
        } else if (categoriaSelecionada === 'combustiveis') {
            itens = combustiveis.map(combustivel => {
                const nomeCompleto = combustivel.nome || '';
                const primeiroNome = nomeCompleto.split(' ')[0] || '';

                let precoNumerico = combustivel.preco;
                if (typeof precoNumerico === 'string') {
                    precoNumerico = parseFloat(precoNumerico.replace(/[^\d,.-]/g, '').replace(',', '.')) || 0;
                }
                if (isNaN(precoNumerico) || precoNumerico === null || precoNumerico === undefined) {
                    precoNumerico = 0;
                }

                return {
                    id: combustivel.id,
                    tipo: 'combustivel',
                    titulo: combustivel.nome,
                    label: primeiroNome,
                    valor: formatarPreco(precoNumerico),
                    precoPorUnidade: precoNumerico,
                    unidade: combustivel.unidade || 'L',
                    quantidade: combustivel.estoque,
                    tipoExibicao: 'estoque'
                };
            });
        } else if (categoriaSelecionada === 'conveniencia') {
            itens = produtos
                .filter(produto =>
                    !produto.labels ||
                    !produto.labels.some(label => label.toLowerCase() === 'combustível')
                )
                .map(produto => ({
                    id: produto.id,
                    tipo: 'produto',
                    titulo: produto.nome,
                    label: produto.labels && produto.labels.length > 0 ? produto.labels[0] : '',
                    valor: formatarPreco(produto.preco),
                    precoPorUnidade: produto.preco,
                    unidade: 'unidade',
                    quantidade: produto.estoque,
                    tipoExibicao: 'estoque'
                }));
        }

        if (termoPesquisa.trim()) {
            itens = itens.filter(item =>
                item.titulo.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
                (item.label && item.label.toLowerCase().includes(termoPesquisa.toLowerCase()))
            );
        }

        return itens;
    }, [categoriaSelecionada, termoPesquisa, produtos, servicos, combustiveis]);

    const turnoFormatado = formatarTurno(turno);
    const nomeOperador = operadorNome || 'Não informado';
    const horaExibicao = horaAbertura || '';

    return (
        <>
            {mostrarToast && (
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    zIndex: 1000,
                    backgroundColor: '#ffffff',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: '8px',
                    padding: '16px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    minWidth: '300px',
                    animation: 'slideInRight 0.3s ease-out'
                }}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        height="20"
                        width="20"
                        style={{ color: '#10b981', flexShrink: 0 }}
                    >
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd"></path>
                    </svg>
                    <div style={{
                        fontSize: '14px',
                        fontFamily: 'system-ui',
                        fontWeight: 500,
                        color: '#0f172a'
                    }}>
                        Venda finalizada com sucesso!
                    </div>
                </div>
            )}

            {mostrarModalFecharTurno && (
                <ModalFecharTurno
                    operadorNome={operadorNome}
                    turno={turno}
                    horaAbertura={horaAbertura}
                    totalVendas={calcularTotaisVendas().total}
                    transacoes={calcularTotaisVendas().transacoes}
                    totalCartao={calcularTotaisVendas().cartao}
                    totalDinheiro={calcularTotaisVendas().dinheiro}
                    valorInicial={valorInicialCaixa || 0}
                    onClose={() => setMostrarModalFecharTurno(false)}
                    onConfirmar={handleConfirmarFecharTurno}
                />
            )}

            {mostrarModalVendas && (
                <ModalVendas
                    vendas={vendasFinalizadas}
                    onClose={() => setMostrarModalVendas(false)}
                    onVendaCancelada={handleVendaCancelada}
                />
            )}

            <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ flex: 1 }}>
                        <h1 className='textoTitulo'>PDV - Ponto de Venda</h1>
                        <h1 className='textoSubtitulo'>
                            {turnoFormatado ? `Turno ${turnoFormatado}` : 'Turno não selecionado'} • Operador: {nomeOperador} • Aberto às: {horaExibicao}
                        </h1>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                            type='button'
                            onClick={() => {
                                setMostrarModalVendas(true);
                            }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                padding: '8px 16px',
                                height: '36px',
                                fontSize: '14px',
                                fontWeight: '500',
                                border: '1px solid #e9ecef',
                                backgroundColor: '#ffffff',
                                color: '#212529',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                fontFamily: 'system-ui'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#f8f9fa';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = '#ffffff';
                            }}
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
                                <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"></path>
                                <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path>
                                <path d="M12 17.5v-11"></path>
                            </svg>
                            Vendas
                            {vendasFinalizadas.filter(v => !v.cancelada).length > 0 && (
                                <span style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '2px 8px',
                                    borderRadius: '6px',
                                    fontSize: '12px',
                                    fontWeight: '500',
                                    backgroundColor: '#e9ecef',
                                    color: '#495057',
                                    marginLeft: '4px',
                                    minWidth: '20px',
                                    height: '20px'
                                }}>
                                    {vendasFinalizadas.filter(v => !v.cancelada).length}
                                </span>
                            )}
                        </button>
                        <button
                            type='button'
                            className='label-badge-gerente d-flex align-items-center'
                            onClick={handleFecharTurno}
                            style={{
                                cursor: 'pointer',
                                gap: '4px',
                                padding: '8px 12px',
                                fontSize: '14px',
                                lineHeight: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '1px solid #e9ecef',
                                backgroundColor: '#ffffff',
                                color: '#212529',
                                borderRadius: '6px',
                                transition: 'all 0.2s',
                                fontFamily: 'system-ui'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#f8f9fa';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = '#ffffff';
                            }}
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
                                <path d="m16 17 5-5-5-5"></path>
                                <path d="M21 12H9"></path>
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            </svg>
                            Fechar Turno
                        </button>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                    <div className="card-itens-venda" style={{ width: '65%', flex: '0 0 65%' }}>
                        <Card
                            title='Produtos Disponíveis'
                        >
                            <div style={{ marginBottom: '16px' }}>
                                <p className='textoSubtitulo mb-0' style={{ textAlign: 'left' }}>Selecione os itens para venda</p>
                            </div>
                            <div style={{ width: '100%' }}>
                                <div className='card-pdv-input-wrapper' style={{ marginBottom: '0', borderRadius: '16px' }}>
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px', color: 'rgb(113, 113, 130)' }}>
                                        <path d="M11.4351 10.0629H10.7124L10.4562 9.81589C11.3528 8.77301 11.8335 7.4191 11.8335 5.91667C11.8335 2.64524 9.18821 0 5.91675 0C2.64524 0 0 2.64524 0 5.91667C0 9.18821 2.64524 11.8335 5.91675 11.8335C7.41919 11.8335 8.77301 11.3528 9.81589 10.4562L10.0629 10.7124V11.4351L14.6367 16L16 14.6367L11.4351 10.0629ZM5.91675 10.0629C3.55175 10.0629 1.77059 8.28167 1.77059 5.91667C1.77059 3.55167 3.55175 1.77042 5.91675 1.77042C8.28175 1.77042 10.0629 3.55167 10.0629 5.91667C10.0629 8.28167 8.28175 10.0629 5.91675 10.0629Z" fill="currentColor" />
                                    </svg>
                                    <input
                                        type='text'
                                        placeholder='Buscar produtos...'
                                        className='card-pdv-input'
                                        value={termoPesquisa}
                                        onChange={(e) => setTermoPesquisa(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div style={{ width: '100%', marginTop: '12px' }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    backgroundColor: 'rgb(243, 243, 245)',
                                    borderRadius: '16px',
                                    padding: '3px',
                                    gap: '3px'
                                }}>
                                    <button
                                        type='button'
                                        onClick={() => setCategoriaSelecionada('combustiveis')}
                                        style={{
                                            flex: 1,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px',
                                            padding: '8px 12px',
                                            borderRadius: '16px',
                                            border: 'none',
                                            backgroundColor: categoriaSelecionada === 'combustiveis' ? '#ffffff' : 'transparent',
                                            color: categoriaSelecionada === 'combustiveis' ? '#0f172a' : 'rgb(113, 113, 130)',
                                            fontSize: '14px',
                                            fontWeight: '500',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            fontFamily: 'system-ui'
                                        }}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 4 0v-6.998a2 2 0 0 0-.59-1.42L18 5"></path>
                                            <path d="M14 21V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v16"></path>
                                            <path d="M2 21h13"></path>
                                            <path d="M3 9h11"></path>
                                        </svg>
                                        Combustíveis
                                    </button>
                                    <button
                                        type='button'
                                        onClick={() => setCategoriaSelecionada('conveniencia')}
                                        style={{
                                            flex: 1,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px',
                                            padding: '8px 12px',
                                            borderRadius: '16px',
                                            border: 'none',
                                            backgroundColor: categoriaSelecionada === 'conveniencia' ? '#ffffff' : 'transparent',
                                            color: categoriaSelecionada === 'conveniencia' ? '#0f172a' : 'rgb(113, 113, 130)',
                                            fontSize: '14px',
                                            fontWeight: '500',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            fontFamily: 'system-ui'
                                        }}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M16 10a4 4 0 0 1-8 0"></path>
                                            <path d="M3.103 6.034h17.794"></path>
                                            <path d="M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z"></path>
                                        </svg>
                                        Conveniência
                                    </button>
                                    <button
                                        type='button'
                                        onClick={() => setCategoriaSelecionada('servicos')}
                                        style={{
                                            flex: 1,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px',
                                            padding: '8px 12px',
                                            borderRadius: '16px',
                                            border: 'none',
                                            backgroundColor: categoriaSelecionada === 'servicos' ? '#ffffff' : 'transparent',
                                            color: categoriaSelecionada === 'servicos' ? '#0f172a' : 'rgb(113, 113, 130)',
                                            fontSize: '14px',
                                            fontWeight: '500',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            fontFamily: 'system-ui'
                                        }}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z"></path>
                                        </svg>
                                        Serviços
                                    </button>
                                </div>
                            </div>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(calc(50% - 6px), 1fr))',
                                gap: '12px',
                                marginTop: '16px'
                            }}>
                                {loading ? (
                                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '20px' }}>
                                        <p className='textoSubtitulo'>Carregando...</p>
                                    </div>
                                ) : itensFiltrados.length === 0 ? (
                                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '20px' }}>
                                        <p className='textoSubtitulo'>Nenhum item encontrado</p>
                                    </div>
                                ) : (
                                    itensFiltrados.map((item) => (
                                        <CardItemPDV
                                            key={item.id}
                                            titulo={item.titulo}
                                            label={item.label}
                                            valor={item.valor}
                                            unidade={item.unidade}
                                            quantidade={item.quantidade}
                                            situacao={item.situacao}
                                            tipoExibicao={item.tipoExibicao}
                                            selecionado={itemSelecionado?.id === item.id}
                                            onClick={() => {
                                                setItemSelecionado(item);
                                                setQuantidade(1);
                                                setValor(0);
                                                setTipoVenda('quantidade');
                                            }}
                                        />
                                    ))
                                )}
                            </div>
                            {itemSelecionado && (
                                <div style={{ marginTop: '16px' }}>
                                    <Quantidade
                                        tipoSelecionado={tipoVenda}
                                        onTipoChange={setTipoVenda}
                                        quantidade={quantidade}
                                        valor={valor}
                                        onQuantidadeChange={setQuantidade}
                                        onValorChange={setValor}
                                        onAdicionar={handleAdicionarAVenda}
                                        unidade={itemSelecionado.unidade || 'L'}
                                        mostrarRadioButtons={categoriaSelecionada === 'combustiveis'}
                                        precoPorUnidade={itemSelecionado.precoPorUnidade || parseFloat(itemSelecionado.valor?.replace('R$', '').replace('.', '').replace(',', '.') || 0)}
                                        permiteFracao={categoriaSelecionada === 'combustiveis'}
                                    />
                                </div>
                            )}
                        </Card>
                    </div>

                    <div className="card-itens-venda" style={{ width: 'calc(35% - 24px)', flex: '0 0 calc(35% - 24px)', marginRight: '0' }}>
                        <Card
                            title='Itens da Venda'
                        >
                            <div style={{ marginBottom: '16px' }}>
                                <p className='textoSubtitulo mb-0' style={{ textAlign: 'left' }}>
                                    {itensVenda.length} item(ns) selecionado(s)
                                </p>
                            </div>

                            {itensVenda.length === 0 ? (
                                <div className='d-flex justify-content-center'>
                                    <p className='mb-0 textoSubtitulo'>Nenhum item adicionado</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '8px',
                                        maxHeight: '240px',
                                        overflowY: 'auto'
                                    }}>
                                        {itensVenda.map((item) => (
                                            <div
                                                key={item.id}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    padding: '12px',
                                                    backgroundColor: '#ffffff',
                                                    borderRadius: '8px',
                                                    border: '1px solid rgba(0, 0, 0, 0.1)'
                                                }}
                                            >
                                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                    <p style={{
                                                        margin: 0,
                                                        fontSize: '14px',
                                                        fontFamily: 'system-ui',
                                                        fontWeight: 500,
                                                        color: '#0f172a'
                                                    }}>
                                                        {item.titulo}
                                                    </p>
                                                    <p style={{
                                                        margin: 0,
                                                        fontSize: '12px',
                                                        fontFamily: 'system-ui',
                                                        color: 'rgb(113, 113, 130)'
                                                    }}>
                                                        {item.quantidade.toFixed(2)}{item.unidade} {formatarPreco(item.precoUnitario)}
                                                    </p>
                                                </div>
                                                <div style={{
                                                    textAlign: 'right',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: '4px',
                                                    alignItems: 'flex-end'
                                                }}>
                                                    <p style={{
                                                        margin: 0,
                                                        fontSize: '14px',
                                                        fontFamily: 'system-ui',
                                                        fontWeight: 500,
                                                        color: '#0f172a'
                                                    }}>
                                                        {formatarPreco(item.valorTotal)}
                                                    </p>
                                                    <button
                                                        type='button'
                                                        onClick={() => handleRemoverItem(item.id)}
                                                        style={{
                                                            height: '32px',
                                                            padding: '0 12px',
                                                            backgroundColor: '#dc2626',
                                                            color: '#ffffff',
                                                            border: 'none',
                                                            borderRadius: '6px',
                                                            fontSize: '12px',
                                                            fontFamily: 'system-ui',
                                                            fontWeight: 500,
                                                            cursor: 'pointer',
                                                            transition: 'background-color 0.2s'
                                                        }}
                                                        onMouseEnter={(e) => e.target.style.backgroundColor = '#b91c1c'}
                                                        onMouseLeave={(e) => e.target.style.backgroundColor = '#dc2626'}
                                                    >
                                                        Remover
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div style={{
                                        borderTop: '1px solid rgba(0, 0, 0, 0.1)',
                                        paddingTop: '16px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '16px'
                                    }}>
                                        <div style={{ display: 'flex', gap: '16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <input
                                                    type="radio"
                                                    id="pagamento-dinheiro"
                                                    name="forma-pagamento"
                                                    checked={formaPagamento === 'dinheiro'}
                                                    onChange={() => setFormaPagamento('dinheiro')}
                                                    style={{ cursor: 'pointer' }}
                                                />
                                                <label
                                                    htmlFor="pagamento-dinheiro"
                                                    style={{
                                                        fontSize: '14px',
                                                        fontFamily: 'system-ui',
                                                        fontWeight: 500,
                                                        lineHeight: '20px',
                                                        cursor: 'pointer',
                                                        userSelect: 'none'
                                                    }}
                                                >
                                                    Dinheiro
                                                </label>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <input
                                                    type="radio"
                                                    id="pagamento-cartao"
                                                    name="forma-pagamento"
                                                    checked={formaPagamento === 'cartao'}
                                                    onChange={() => setFormaPagamento('cartao')}
                                                    style={{ cursor: 'pointer' }}
                                                />
                                                <label
                                                    htmlFor="pagamento-cartao"
                                                    style={{
                                                        fontSize: '14px',
                                                        fontFamily: 'system-ui',
                                                        fontWeight: 500,
                                                        lineHeight: '20px',
                                                        cursor: 'pointer',
                                                        userSelect: 'none'
                                                    }}
                                                >
                                                    Cartão
                                                </label>
                                            </div>
                                        </div>

                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between'
                                        }}>
                                            <span style={{
                                                fontSize: '14px',
                                                fontFamily: 'system-ui',
                                                fontWeight: 500,
                                                color: '#0f172a'
                                            }}>
                                                Total:
                                            </span>
                                            <span style={{
                                                fontSize: '20px',
                                                fontFamily: 'system-ui',
                                                fontWeight: 500,
                                                color: '#0f172a'
                                            }}>
                                                {formatarPreco(calcularTotal())}
                                            </span>
                                        </div>
                                        <button
                                            type='button'
                                            onClick={handleFinalizarVenda}
                                            style={{
                                                width: '100%',
                                                height: '40px',
                                                backgroundColor: '#000000',
                                                color: '#ffffff',
                                                border: 'none',
                                                borderRadius: '8px',
                                                fontSize: '14px',
                                                fontFamily: 'system-ui',
                                                fontWeight: 500,
                                                cursor: 'pointer',
                                                transition: 'background-color 0.2s'
                                            }}
                                            onMouseEnter={(e) => e.target.style.backgroundColor = '#333333'}
                                            onMouseLeave={(e) => e.target.style.backgroundColor = '#000000'}
                                        >
                                            Finalizar Venda
                                        </button>
                                    </div>
                                </div>
                            )}
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

export default PdvAberto;
