import React from 'react';

import { useNavigate } from 'react-router-dom';

import iconeColuna from '../icones/coluna.svg';
import CardPDV, { CardPDVSelect, CardPDVInput } from '../components/card-pdv';
import iconeRelogio from '../icones/relogio.svg';

import { listarFuncionarios } from '../services/funcionarioService';
import { abrirTurno, listarTurnosAbertos } from '../services/pdvService';

function Pdv({ toggleMenu }) {
    const navigate = useNavigate();
    const [funcionarios, setFuncionarios] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [operadorSelecionado, setOperadorSelecionado] = React.useState('');
    const [turnoSelecionado, setTurnoSelecionado] = React.useState('');
    const [valorInicialCaixa, setValorInicialCaixa] = React.useState('');

    const parseValor = (valor) => {
        return Number(String(valor || '').replace(/\./g, '').replace(',', '.')) || 0;
    };

    const montarEstadoTurno = React.useCallback((turnoData) => {
        const formatarDataHora = (dataStr) => {
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
            horaAbertura: formatarDataHora(turnoData.horaAberturaISO),
            valorInicialCaixa: turnoData.valorInicialCaixa || 0
        };
    }, []);

    React.useEffect(() => {
        const fetchFuncionarios = async () => {
            try {
                const postoId = localStorage.getItem('postoSelecionadoId');
                
                if (!postoId) {
                    setFuncionarios([]);
                    setLoading(false);
                    return;
                }

                const turnosAbertos = await listarTurnosAbertos(postoId);
                if (turnosAbertos.length > 0) {
                    const turnoAberto = turnosAbertos[0];
                    localStorage.setItem('turnoAbertoId', turnoAberto.id);
                    navigate('/pdv-aberto', {
                        state: montarEstadoTurno(turnoAberto)
                    });
                    return;
                }
                
                const funcionariosData = await listarFuncionarios(postoId);
                const funcionariosFormatados = funcionariosData.map(funcionario => ({
                    value: funcionario.id,
                    text: funcionario.nome,
                    labels: funcionario.labels || []
                }));
                setFuncionarios(funcionariosFormatados);
            } catch (error) {
                console.error('Erro ao buscar funcionários:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFuncionarios();
    }, [navigate, montarEstadoTurno]);

    const handleAbrirTurno = async () => {
        if (!operadorSelecionado || !turnoSelecionado) {
            alert('Por favor, selecione o operador e o turno antes de abrir o turno.');
            return;
        }

        if (!valorInicialCaixa || parseValor(valorInicialCaixa) <= 0) {
            alert('Por favor, informe o valor inicial em caixa.');
            return;
        }

        const postoId = localStorage.getItem('postoSelecionadoId');
        if (!postoId) {
            alert('Nenhum posto selecionado. Por favor, selecione um posto primeiro.');
            return;
        }

        const agora = new Date();
        const dataFormatada = agora.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        const horaFormatada = agora.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        const horaAbertura = `${dataFormatada}, ${horaFormatada}`;

        const operadorId = typeof operadorSelecionado === 'string' ? parseInt(operadorSelecionado) : operadorSelecionado;
        const funcionario = funcionarios.find(f => f.value === operadorId || f.value === operadorSelecionado);
        const nomeOperador = funcionario ? funcionario.text : 'Não informado';

        const turnos = {
            'matutino': 'matutino',
            'vespertino': 'vespertino',
            'noturno': 'noturno'
        };
        const nomeTurno = turnos[turnoSelecionado] || turnoSelecionado;

        try {
            const turnoAberto = await abrirTurno({
                idPosto: postoId,
                operadorId: operadorSelecionado,
                operadorNome: nomeOperador,
                turno: nomeTurno,
                valorInicialCaixa
            });
            const turnoId = turnoAberto.id;

            localStorage.setItem('turnoAbertoId', turnoId);

            navigate('/pdv-aberto', {
                state: {
                    turnoId: turnoId,
                    operadorId: operadorSelecionado,
                    operadorNome: nomeOperador,
                    turno: nomeTurno,
                    horaAbertura: horaAbertura,
                    valorInicialCaixa: parseValor(valorInicialCaixa)
                }
            });
        } catch (error) {
            console.error('Erro ao abrir turno:', error);
            alert('Erro ao abrir turno. Tente novamente.');
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '20px' }}>
                <div className='container-icone-coluna' onClick={toggleMenu}>
                    <img src={iconeColuna} alt="Coluna" width="16" height="16" />
                </div>
                <span className='textoDashboard'>Dashboard - {localStorage.getItem('postoSelecionado') || 'Posto Ipiranga Vila'}</span>
                </div>
            <div className='pdv-wrapper'>
                <CardPDV
                    icone={iconeRelogio}
                    titulo='Abertura de Turno'
                    subtitulo='Informe os dados necessários para iniciar o turno'
                    label='Operador'
                    selectPlaceholder='Selecione o funcionário'
                    selectOptionLabel={(option) => {
                        const cargo = option.labels && option.labels.length > 0 ? option.labels[0] : '';
                        return cargo ? `${option.text} - ${cargo}` : option.text;
                    }}
                    selectOptions={funcionarios}
                    selectProps={{
                        value: operadorSelecionado,
                        onChange: (e) => setOperadorSelecionado(e.target.value)
                    }}
                >
                    <div className='mt-0 align-self-stretch'>
                        <CardPDVSelect
                            label='Turno'
                            placeholder='Selecione o turno'
                            options={[
                                { value: 'matutino', text: 'Matutino (06:00 - 14:00)' },
                                { value: 'vespertino', text: 'Vespertino (14:00 - 22:00)' },
                                { value: 'noturno', text: 'Noturno (22:00 - 06:00)' }
                            ]}
                            selectProps={{
                                value: turnoSelecionado,
                                onChange: (e) => setTurnoSelecionado(e.target.value)
                            }}
                        />
                    </div>

                    <div className='mt-0 align-self-stretch'>
                        <CardPDVInput
                            label='Valor Inicial em Caixa'
                            prefix='R$'
                            placeholder='0,00'
                            inputProps={{
                                inputMode: 'decimal',
                                value: valorInicialCaixa,
                                onChange: (e) => setValorInicialCaixa(e.target.value)
                            }}
                        />
                    </div>

                    <div className='mt-2 align-self-stretch'>
                        <button type='button' className='card-pdv-button' onClick={handleAbrirTurno} disabled={loading}>
                            {loading ? 'Carregando...' : 'Abrir Turno'}
                        </button>
                    </div>
                </CardPDV>
            </div>
        </div>
    );
}

export default Pdv;
