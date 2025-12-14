import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Card from '../components/card';
import iconeColuna from '../icones/coluna.svg';

import axios from 'axios';
import { BASE_URL } from '../config/axios';
import '../styles/form-cadastro.css';

function CadastroNovoPreco({ toggleMenu }) {
    const { idParam } = useParams();
    const navigate = useNavigate();

    const [carregando, setCarregando] = useState(false);
    const [nomeTipoCombustivel, setNomeTipoCombustivel] = useState('');
    const [precoAtual, setPrecoAtual] = useState('');
    const [fornecedorAtual, setFornecedorAtual] = useState('');
    const [estoqueAtual, setEstoqueAtual] = useState('');
    const [novoPreco, setNovoPreco] = useState('');
    const [dataVigencia, setDataVigencia] = useState('');
    const [responsavel, setResponsavel] = useState('');
    const [motivo, setMotivo] = useState('');
    const [funcionarios, setFuncionarios] = useState([]);

    const [editandoNome, setEditandoNome] = useState(false);
    const [editandoFornecedor, setEditandoFornecedor] = useState(false);
    const [editandoEstoque, setEditandoEstoque] = useState(false);
    const [mostrarDica, setMostrarDica] = useState(true);

    useEffect(() => {
        const dicaVista = localStorage.getItem('dicaNovoPrecoVista');
        if (dicaVista === 'true') {
            setMostrarDica(false);
        }
    }, []);

    useEffect(() => {
        if (!idParam) {
            navigate('/combustiveis');
            return;
        }

        setCarregando(true);
        axios
            .get(`${BASE_URL}/TiposCombustivel/${idParam}`)
            .then(({ data }) => {
                setNomeTipoCombustivel(data.nome || '');
                setPrecoAtual(data.preco || '');
                setFornecedorAtual(data.fornecedor || '');
                setEstoqueAtual(data.estoque || '');
            })
            .catch((error) => {
                alert(error.response?.data || 'Erro ao buscar tipo de combustível');
                navigate('/combustiveis');
            })
            .finally(() => setCarregando(false));
    }, [idParam, navigate]);

    useEffect(() => {
        async function carregarFuncionarios() {
            try {
                const response = await axios.get(`${BASE_URL}/funcionarios`);
                const funcionariosFormatados = Array.isArray(response.data)
                    ? response.data.map(funcionario => ({
                        value: funcionario.nome,
                        text: funcionario.nome
                    }))
                    : [];
                setFuncionarios(funcionariosFormatados);
            } catch (error) {
                console.error('Erro ao carregar funcionários:', error);
                setFuncionarios([]);
            }
        }
        carregarFuncionarios();
    }, []);

    async function salvar(e) {
        e.preventDefault();

        try {
            const tipoAtual = await axios.get(`${BASE_URL}/TiposCombustivel/${idParam}`);
            const dadosAtuais = tipoAtual.data;

            let precoNumerico = novoPreco.trim();
            precoNumerico = precoNumerico.replace(/[^\d,.-]/g, '');
            precoNumerico = precoNumerico.replace(',', '.');
            const numero = parseFloat(precoNumerico);

            if (isNaN(numero)) {
                alert('Por favor, insira um valor válido para o preço');
                return;
            }

            const payloadAtualizado = {
                ...dadosAtuais,
                id: dadosAtuais.id || idParam,
                nome: nomeTipoCombustivel,
                fornecedor: fornecedorAtual,
                estoque: estoqueAtual,
                preco: numero
            };

            await axios.put(`${BASE_URL}/TiposCombustivel/${idParam}`, payloadAtualizado);

            const precoAtualStr = String(precoAtual || '');
            const precoAnteriorNumerico = precoAtualStr.replace(/[^\d,.-]/g, '').replace(',', '.');
            const precoAnterior = parseFloat(precoAnteriorNumerico) || (typeof precoAtual === 'number' ? precoAtual : 0);

            const historicoPayload = {
                id_posto: localStorage.getItem('postoSelecionadoId'),
                tipoCombustivelId: idParam,
                tipoCombustivel: nomeTipoCombustivel,
                precoAnterior: precoAnterior,
                novoPreco: numero,
                dataVigencia: dataVigencia,
                responsavel: responsavel,
                motivo: motivo,
                dataAlteracao: new Date().toISOString().split('T')[0]
            };

            await axios.post(`${BASE_URL}/HistoricoCombustivel`, historicoPayload);
            localStorage.setItem('dicaNovoPrecoVista', 'true');
            alert('Preço alterado com sucesso');
            navigate('/combustiveis');
        } catch (error) {
            console.error('Erro completo:', error);
            alert(error.response?.data || error.message || 'Erro ao salvar alteração de preço');
        }
    }

    if (carregando) {
        return null;
    }

    return (
        <div className="form-page-container">
            <div className="form-header">
                <div className="container-icone-coluna" onClick={toggleMenu}>
                    <img src={iconeColuna} alt="Coluna" width="16" height="16" />
                </div>
                <span className="textoDashboard">Dashboard - {localStorage.getItem('postoSelecionado') || 'Posto Ipiranga Vila'}</span>
            </div>

            <div className="form-title-section">
                <div
                    className="form-back-button"
                    onClick={() => navigate('/combustiveis')}
                    title="Voltar para listagem de combustíveis"
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
                        <path d="m12 19-7-7 7-7"></path>
                        <path d="M19 12H5"></path>
                    </svg>
                </div>
                <div className="form-title-container">
                    <h2 className="form-title">
                        {`Alterar Preço - ${nomeTipoCombustivel || 'Combustível'}`}
                    </h2>
                    <p className="form-subtitle">
                        Registre a alteração de preço do combustível
                    </p>
                </div>
            </div>

            <div className="form-card-container">
                <Card title="Alteração de Preço">
                    <br />
                    <form className="form-structured-form" onSubmit={salvar}>
                        <div className="form-info-card" style={{ backgroundColor: '#f3f4f6' }}>
                            <h4>Informações Atuais</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '5px', marginTop: '12px', fontSize: '14px' }}>
                                <div>
                                    <span style={{ fontWeight: '500', marginRight: '8px' }}>Combustível:</span>
                                    {editandoNome ? (
                                        <input
                                            type="text"
                                            value={nomeTipoCombustivel}
                                            onChange={(e) => setNomeTipoCombustivel(e.target.value)}
                                            onBlur={() => setEditandoNome(false)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') setEditandoNome(false);
                                            }}
                                            autoFocus
                                            style={{
                                                border: '1px solid #3b82f6',
                                                borderRadius: '4px',
                                                padding: '2px 6px',
                                                fontSize: '14px',
                                                width: '150px'
                                            }}
                                        />
                                    ) : (
                                        <span
                                            onDoubleClick={() => setEditandoNome(true)}
                                            style={{ cursor: 'pointer', padding: '2px 4px', borderRadius: '4px' }}
                                            title="Duplo clique para editar"
                                        >
                                            {nomeTipoCombustivel || '-'}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <span style={{ fontWeight: '500', marginRight: '8px' }}>Preço Atual:</span>
                                    <span>{precoAtual || '-'}</span>
                                </div>
                                <div>
                                    <span style={{ fontWeight: '500', marginRight: '8px' }}>Fornecedor:</span>
                                    {editandoFornecedor ? (
                                        <input
                                            type="text"
                                            value={fornecedorAtual}
                                            onChange={(e) => setFornecedorAtual(e.target.value)}
                                            onBlur={() => setEditandoFornecedor(false)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') setEditandoFornecedor(false);
                                            }}
                                            autoFocus
                                            style={{
                                                border: '1px solid #3b82f6',
                                                borderRadius: '4px',
                                                padding: '2px 6px',
                                                fontSize: '14px',
                                                width: '150px'
                                            }}
                                        />
                                    ) : (
                                        <span
                                            onDoubleClick={() => setEditandoFornecedor(true)}
                                            style={{ cursor: 'pointer', padding: '2px 4px', borderRadius: '4px' }}
                                            title="Duplo clique para editar"
                                        >
                                            {fornecedorAtual || '-'}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <span style={{ fontWeight: '500', marginRight: '8px' }}>Estoque:</span>
                                    {editandoEstoque ? (
                                        <input
                                            type="text"
                                            value={estoqueAtual}
                                            onChange={(e) => setEstoqueAtual(e.target.value)}
                                            onBlur={() => setEditandoEstoque(false)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') setEditandoEstoque(false);
                                            }}
                                            autoFocus
                                            style={{
                                                border: '1px solid #3b82f6',
                                                borderRadius: '4px',
                                                padding: '2px 6px',
                                                fontSize: '14px',
                                                width: '150px'
                                            }}
                                        />
                                    ) : (
                                        <span
                                            onDoubleClick={() => setEditandoEstoque(true)}
                                            style={{ cursor: 'pointer', padding: '2px 4px', borderRadius: '4px' }}
                                            title="Duplo clique para editar"
                                        >
                                            {estoqueAtual || '-'}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {mostrarDica && (
                            <div className="form-info-card" style={{ backgroundColor: '#fef3c7', border: '1px solid #fbbf24', borderRadius: '8px', marginTop: '-15px' }}>
                                <h4 style={{ color: '#92400e', marginBottom: '8px' }}>Dica</h4>
                                <p style={{ color: '#78350f', fontSize: '13px', margin: 0 }}>
                                    Dê um <strong>duplo clique</strong> nos campos de Combustível, Fornecedor ou Estoque para editá-los. As alterações serão salvas ao confirmar a alteração de preço.
                                </p>
                            </div>
                        )}

                        <div className="form-grid-row">
                            <div className="form-field-group">
                                <label htmlFor="novoPreco" className="form-label">Novo Preço</label>
                                <div className="form-input-wrapper">
                                    <input
                                        type="text"
                                        id="novoPreco"
                                        name="novoPreco"
                                        value={novoPreco}
                                        onChange={(e) => setNovoPreco(e.target.value)}
                                        placeholder="R$ 0,00"
                                        required
                                        className="card-pdv-input form-input"
                                    />
                                </div>
                            </div>
                            <div className="form-field-group">
                                <label htmlFor="dataVigencia" className="form-label">Data de Vigência</label>
                                <div className="form-input-wrapper">
                                    <input
                                        type="date"
                                        id="dataVigencia"
                                        name="dataVigencia"
                                        value={dataVigencia}
                                        onChange={(e) => setDataVigencia(e.target.value)}
                                        required
                                        className="card-pdv-input form-input"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-field-group">
                            <label htmlFor="responsavel" className="form-label">Responsável pela Alteração</label>
                            <div className="form-input-wrapper" style={{ cursor: 'pointer' }}>
                                <select
                                    id="responsavel"
                                    name="responsavel"
                                    value={responsavel}
                                    onChange={(e) => setResponsavel(e.target.value)}
                                    required
                                    className="card-pdv-input form-input"
                                    style={{
                                        appearance: 'none',
                                        backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'m6 9 6 6 6-6\'%3E%3C/path%3E%3C/svg%3E")',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'right 8px center',
                                        backgroundSize: '16px',
                                        paddingRight: '32px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <option value="">Selecione o responsável</option>
                                    {funcionarios.map(funcionario => (
                                        <option key={funcionario.value} value={funcionario.value}>
                                            {funcionario.text}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-field-group">
                            <label htmlFor="motivo" className="form-label">Motivo da Alteração</label>
                            <div className="form-input-wrapper">
                                <input
                                    type="text"
                                    id="motivo"
                                    name="motivo"
                                    value={motivo}
                                    onChange={(e) => setMotivo(e.target.value)}
                                    placeholder="Ex: Aumento do fornecedor, ajuste de margem, etc."
                                    required
                                    className="card-pdv-input form-input"
                                />
                            </div>
                        </div>

                        <div className="form-info-card" style={{ backgroundColor: '#fef3c7', border: '1px solid #fbbf24', borderRadius: '8px' }}>
                            <h4 style={{ color: '#92400e', marginBottom: '8px' }}>Atenção</h4>
                            <ul style={{ color: '#78350f', fontSize: '13px', margin: 0, paddingLeft: '18px' }}>
                                <li>Esta alteração será registrada no histórico de preços</li>
                                <li>O preço anterior será mantido para referência</li>
                                <li>A data de vigência define quando o novo preço entra em vigor</li>
                                <li>Certifique-se de que o novo preço está correto</li>
                            </ul>
                        </div>

                        <div className="form-button-group">
                            <button type="submit" className="form-button-primary">
                                Confirmar Alteração
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/combustiveis')}
                                className="form-button-secondary"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
}

export default CadastroNovoPreco;