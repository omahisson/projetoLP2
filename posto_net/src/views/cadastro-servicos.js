import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Card from '../components/card';
import iconeColuna from '../icones/coluna.svg';

import { buscarServico, criarServico, atualizarServico } from '../services/servicoService';

function CadastroServicos({ toggleMenu }) {
    const { idParam } = useParams();
    const navigate = useNavigate();

    const [id, setId] = useState('');
    const [nome, setNome] = useState('');
    const [preco, setPreco] = useState('');
    const [duracao, setDuracao] = useState('');
    const [descricao, setDescricao] = useState('');
    const [labels, setLabels] = useState('');
    const [dados, setDados] = useState(null);

    const inicializar = useCallback(() => {
        setId('');
        setNome('');
        setPreco('');
        setDuracao('');
        setDescricao('');
        setLabels('');
        setDados({});
    }, []);

    async function salvar() {
        const labelsArray = labels ? labels.split(',').map(item => item.trim()).filter(Boolean) : [];
        const payload = {
            id,
            idPosto: localStorage.getItem('postoSelecionadoId'),
            nome,
            preco: parseFloat(preco) || 0,
            duracao: parseInt(duracao, 10) || 0,
            descricao,
            labels: labelsArray
        };

        try {
            if (idParam == null) {
                await criarServico(payload);
                alert(`Servico ${nome} cadastrado com sucesso!`);
            } else {
                await atualizarServico(idParam, payload);
                alert(`Servico ${nome} alterado com sucesso!`);
            }
            navigate('/produtosServicos');
        } catch (error) {
            alert('Erro ao salvar servico: ' + (error.response?.data || error.message));
        }
    }

    const buscar = useCallback(async () => {
        if (idParam == null) {
            inicializar();
            return;
        }

        try {
            const response = await buscarServico(idParam);
            setDados(response);
            setId(response.id);
            setNome(response.nome || '');
            setPreco(response.preco || '');
            setDuracao(response.duracao || '');
            setDescricao(response.descricao || '');
            setLabels(response.labels ? response.labels.join(', ') : '');
        } catch (error) {
            console.error('Erro ao buscar servico:', error);
        }
    }, [idParam, inicializar]);

    useEffect(() => {
        buscar();
    }, [buscar]);

    if (!dados) return null;

    const formStyles = {
        container: { padding: '24px' },
        headerSection: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' },
        titleSection: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' },
        titleContainer: { display: 'flex', flexDirection: 'column' },
        title: { fontSize: '20px', fontWeight: '500', margin: 0, fontFamily: 'system-ui' },
        subtitle: { fontSize: '14px', color: 'rgb(113, 113, 130)', margin: 0, marginTop: '4px', fontFamily: 'system-ui' },
        cardContainer: { maxWidth: '672px' },
        form: { display: 'flex', flexDirection: 'column', gap: '24px' },
        fieldGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
        label: { fontSize: '14px', fontWeight: '500', fontFamily: 'system-ui', color: '#212529' },
        description: { fontSize: '14px', color: 'rgb(113, 113, 130)', fontFamily: 'system-ui', marginTop: '4px' },
        inputWrapper: { display: 'flex', alignItems: 'center', backgroundColor: 'rgb(243, 243, 245)', borderRadius: '8px', padding: '0 12px', minHeight: '40px' },
        input: { flex: 1, border: 'none', background: 'transparent', padding: '8px 0', fontFamily: 'system-ui', fontSize: '14px', outline: 'none' },
        gridRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' },
        buttonGroup: { display: 'flex', gap: '12px', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' },
        buttonPrimary: { flex: 1, height: '36px', borderRadius: '6px', border: 'none', backgroundColor: '#000', color: '#fff', cursor: 'pointer' },
        buttonSecondary: { flex: 1, height: '36px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: '#fff', color: '#212529', cursor: 'pointer' }
    };

    return (
        <div style={formStyles.container}>
            <div style={formStyles.headerSection}>
                <div className='container-icone-coluna' onClick={toggleMenu}>
                    <img src={iconeColuna} alt="Coluna" width="16" height="16" />
                </div>
                <span className='textoDashboard'>Dashboard - {localStorage.getItem('postoSelecionado') || 'Posto Ipiranga Vila'}</span>
            </div>

            <div style={formStyles.titleSection}>
                <div
                    onClick={() => navigate('/produtosServicos')}
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '6px' }}
                    title="Voltar para listagem de servicos"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m12 19-7-7 7-7"></path>
                        <path d="M19 12H5"></path>
                    </svg>
                </div>
                <div style={formStyles.titleContainer}>
                    <h2 style={formStyles.title}>{idParam ? 'Editar Servico' : 'Cadastrar Servico'}</h2>
                    <p style={formStyles.subtitle}>Preencha os dados do servico</p>
                </div>
            </div>

            <div style={formStyles.cardContainer}>
                <Card title='Dados do Servico'>
                    <form onSubmit={(e) => { e.preventDefault(); salvar(); }}>
                        <div style={formStyles.form}>
                            <div style={formStyles.fieldGroup}>
                                <label htmlFor="nome" style={formStyles.label}>Nome do Servico</label>
                                <div style={formStyles.inputWrapper}>
                                    <input id="nome" value={nome} onChange={e => setNome(e.target.value)} required placeholder="Nome do servico" style={formStyles.input} />
                                </div>
                            </div>

                            <div style={formStyles.gridRow}>
                                <div style={formStyles.fieldGroup}>
                                    <label htmlFor="preco" style={formStyles.label}>Preco (R$)</label>
                                    <div style={formStyles.inputWrapper}>
                                        <input id="preco" type="number" step="0.01" min="0" value={preco} onChange={e => setPreco(e.target.value)} placeholder="0.00" style={formStyles.input} />
                                    </div>
                                </div>

                                <div style={formStyles.fieldGroup}>
                                    <label htmlFor="duracao" style={formStyles.label}>Duracao (min)</label>
                                    <div style={formStyles.inputWrapper}>
                                        <input id="duracao" type="number" min="0" value={duracao} onChange={e => setDuracao(e.target.value)} placeholder="Ex: 30" style={formStyles.input} />
                                    </div>
                                </div>
                            </div>

                            <div style={formStyles.fieldGroup}>
                                <label htmlFor="descricao" style={formStyles.label}>Descricao</label>
                                <div style={{ marginTop: 8 }}>
                                    <textarea id="descricao" value={descricao} onChange={e => setDescricao(e.target.value)} placeholder="Detalhes do servico" style={{ width: '100%', minHeight: 80, padding: 12, borderRadius: 8, border: '1px solid #e5e7eb', fontFamily: 'system-ui' }} />
                                </div>
                            </div>

                            <div style={formStyles.fieldGroup}>
                                <label htmlFor="labels" style={formStyles.label}>Labels (Tags)</label>
                                <div style={formStyles.description}>Separe as tags por virgula</div>
                                <div style={formStyles.inputWrapper}>
                                    <input id="labels" value={labels} onChange={e => setLabels(e.target.value)} placeholder="ex: lavagem, alinhamento" style={formStyles.input} />
                                </div>
                            </div>
                        </div>

                        <div style={formStyles.buttonGroup}>
                            <button type="submit" style={formStyles.buttonPrimary}>
                                {idParam ? 'Salvar Alteracoes' : 'Cadastrar Servico'}
                            </button>
                            <button type="button" style={formStyles.buttonSecondary} onClick={() => navigate('/produtosServicos')}>Cancelar</button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
}

export default CadastroServicos;
