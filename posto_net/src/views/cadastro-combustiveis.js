import React, { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../config/axios';

function CadastroCombustiveis() {
  const [tipoCombustivel, setTipoCombustivel] = useState('');
  const [fornecedor, setFornecedor] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [unidade, setUnidade] = useState('Litro');
  const [numeroNota, setNumeroNota] = useState('');
  const [dataEntrega, setDataEntrega] = useState('');
  const [dataValidade, setDataValidade] = useState('');
  const [precoUnitario, setPrecoUnitario] = useState('');
  const [valorTotal, setValorTotal] = useState('');

  // Para exemplo, dados estáticos
  const tiposCombustivel = ['Gasolina', 'Diesel', 'Etanol'];
  const fornecedores = ['Petrobras', 'Shell', 'Raízen'];

  // Calcula valor total assim que quantidade ou preço mudam
  React.useEffect(() => {
    const total = (parseFloat(quantidade) || 0) * (parseFloat(precoUnitario) || 0);
    setValorTotal(total.toFixed(2));
  }, [quantidade, precoUnitario]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Aqui vai lógica de envio para o backend
    try {
      await axios.post(`${BASE_URL}/abastecimento`, {
        tipoCombustivel,
        fornecedor,
        quantidade,
        unidade,
        numeroNota,
        dataEntrega,
        dataValidade,
        precoUnitario,
        valorTotal
      });
      alert('Abastecimento cadastrado com sucesso!');
    } catch (error) {
      alert('Erro ao cadastrar abastecimento.');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 32 }}>
      <h2>Cadastrar Abastecimento</h2>
      <p>Registre a entrada de combustível no posto</p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div>
          <label>Tipo de Combustível</label>
          <select value={tipoCombustivel} onChange={e => setTipoCombustivel(e.target.value)} required>
            <option value="">Selecione o combustível</option>
            {tiposCombustivel.map(tc => <option key={tc} value={tc}>{tc}</option>)}
          </select>
        </div>
        <div>
          <label>Fornecedor</label>
          <select value={fornecedor} onChange={e => setFornecedor(e.target.value)} required>
            <option value="">Selecione o fornecedor</option>
            {fornecedores.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <div>
          <label>Quantidade</label>
          <input type="number" value={quantidade} onChange={e => setQuantidade(e.target.value)} placeholder="Ex: 15000" min={0} required />
        </div>
        <div>
          <label>Unidade</label>
          <select value={unidade} onChange={e => setUnidade(e.target.value)}>
            <option value="Litro">Litro</option>
            <option value="Metro cúbico">Metro cúbico</option>
          </select>
        </div>
        <div>
          <label>Número da Nota</label>
          <input type="text" value={numeroNota} onChange={e => setNumeroNota(e.target.value)} placeholder="Ex: NF123456" required />
        </div>
        <div>
          <label>Data de Entrega</label>
          <input type="date" value={dataEntrega} onChange={e => setDataEntrega(e.target.value)} required />
        </div>
        <div>
          <label>Data de Validade</label>
          <input type="date" value={dataValidade} onChange={e => setDataValidade(e.target.value)} required />
        </div>
        <div>
          <label>Preço Unitário</label>
          <input type="number" value={precoUnitario} onChange={e => setPrecoUnitario(e.target.value)} step="0.01" min={0} required />
        </div>
        <div>
          <label>Valor Total</label>
          <input type="text" value={valorTotal} readOnly />
        </div>
        <div style={{ background: '#f3f3f5', borderRadius: 8, padding: 12, marginTop: 6 }}>
          <ul style={{ fontSize: 14 }}>
            <li>O estoque será atualizado automaticamente após o cadastro</li>
            <li>Certifique-se que a data de validade está correta</li>
            <li>O valor total é calculado automaticamente</li>
            <li>Mantenha a nota fiscal para auditoria</li>
          </ul>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button type="submit" style={{
            flex: 1, background: '#000', color: '#fff', border: 'none', borderRadius: 6, height: 36, cursor: 'pointer'
          }}>Registrar Abastecimento</button>
          <button type="button" style={{
            flex: 1, background: '#fff', color: '#333', border: '1px solid #d1d5db', borderRadius: 6, height: 36, cursor: 'pointer'
          }} onClick={() => window.history.back()}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}

export default CadastroCombustiveis;
