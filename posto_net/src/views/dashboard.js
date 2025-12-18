import React from 'react';
import axios from 'axios';
import { BASE_URL } from '../config/axios';
import {
  FiDollarSign, FiBarChart2, FiDownload, FiTag,
  FiArchive, FiCheckSquare, FiClock, FiFileText
} from 'react-icons/fi';
import '../index.css';
import iconeColuna from '../icones/coluna.svg';
import Card from '../components/card';
import iconeCifrao from '../icones/cifrao.svg';
import rede from '../icones/rede.svg';
import aumento from '../icones/aumento.svg';
import cubo from '../icones/cubo.svg';
import config1 from '../icones/config.svg';

/**
 * Converte um array de objetos para uma string CSV.
 */
const convertArrayToCSV = (data) => {
  if (!data || data.length === 0) {
    return "";
  }

  const headers = Object.keys(data[0]);

  const formatCell = (val) => {
    let value = val === null || val === undefined ? '' : String(val);
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      value = `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  };

  const headerRow = headers.map(formatCell).join(',');
  const dataRows = data.map(row =>
    headers.map(header => formatCell(row[header])).join(',')
  );

  return [headerRow, ...dataRows].join('\n');
};

/**
 * Inicia o download de um arquivo CSV.
 */
const downloadCSV = (content, fileName, mimeType = 'text/csv;charset=utf-8;') => {
  const blob = new Blob([content], { type: mimeType });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};

function Dashboard({ toggleMenu }) {
  const [dadosFinanceiros, setDadosFinanceiros] = React.useState(null);
  const [rankingRede, setRankingRede] = React.useState([]);
  const [maisVendidos, setMaisVendidos] = React.useState([]);
  const [relatorioPreco, setRelatorioPreco] = React.useState([]);
  const [relatorioEstoque, setRelatorioEstoque] = React.useState([]);
  const [relatorioOperacional, setRelatorioOperacional] = React.useState(null);

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const postoId = localStorage.getItem('postoSelecionadoId');
        const queryParam = postoId ? `?id_posto=${postoId}` : '';

        const promises = [
          axios.get(`${BASE_URL}/DadosFinanceiros${queryParam}`),
          axios.get(`${BASE_URL}/RankingRede${queryParam}`),
          axios.get(`${BASE_URL}/MaisVendidos${queryParam}`),
          axios.get(`${BASE_URL}/RelatorioPreco${queryParam}`),
          axios.get(`${BASE_URL}/RelatorioEstoque${queryParam}`),
          axios.get(`${BASE_URL}/RelatorioOperacional${queryParam}`)
        ];

        const responses = await Promise.all(promises);

        const dadosFinanceiros = Array.isArray(responses[0].data)
          ? (responses[0].data[0] || responses[0].data)
          : responses[0].data;
        setDadosFinanceiros(dadosFinanceiros);

        setRankingRede(Array.isArray(responses[1].data) ? responses[1].data : []);
        setMaisVendidos(Array.isArray(responses[2].data) ? responses[2].data : []);
        setRelatorioPreco(Array.isArray(responses[3].data) ? responses[3].data : []);
        setRelatorioEstoque(Array.isArray(responses[4].data) ? responses[4].data : []);

        const relatorioOperacional = Array.isArray(responses[5].data)
          ? (responses[5].data[0] || null)
          : responses[5].data;
        setRelatorioOperacional(relatorioOperacional);
      } catch (err) {
        console.error("Erro ao buscar dados do dashboard:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Carregando dados do dashboard...</div>;
  }

  if (error) {
    return <div>Ocorreu um erro: {error}</div>;
  }

  const nomePosto = localStorage.getItem('postoSelecionado') || 'Posto Ipiranga Vila';

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '20px' }}>
        <div className='container-icone-coluna' onClick={toggleMenu}>
          <img src={iconeColuna} alt="Coluna" width="16" height="16" />
        </div>
        <span className='textoDashboard'>Dashboard - {nomePosto}</span>
      </div>
      
      <div style={{ marginBottom: '32px' }}>
        <h1 className='textoTitulo'>Relatórios - {nomePosto}</h1>
        <h1 className='textoSubtitulo'>Analise o desempenho e acompanhe indicadores importantes do seu posto</h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <FinancialReportCard financialData={dadosFinanceiros} />
        <NetworkReportCard networkRanking={rankingRede} topProducts={maisVendidos} />
        <PriceReportCard priceReportData={relatorioPreco} />
        <StockReportCard stockReportData={relatorioEstoque} />
      </div>
    </div>
  );
}

const FinancialReportCard = ({ financialData }) => {
  const handleDownload = () => {
    if (!financialData) return;
    const dataToExport = [
      { Indicador: 'Faturamento Total', Valor: financialData.faturamentoTotal },
      { Indicador: 'Ticket Médio', Valor: financialData.ticketMedio },
      { Indicador: 'Total de Vendas', Valor: financialData.totalVendas },
      { Indicador: 'Pagamento Principal', Valor: financialData.mainPayment },
    ];
    const csvContent = convertArrayToCSV(dataToExport);
    downloadCSV(csvContent, 'relatorio-financeiro.csv');
  };

  if (!financialData) return null;

  return (
    <Card
      title="Relatórios Financeiros"
      iconeTitle={iconeCifrao}
      botaoHeader={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <select style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #ced4da', marginRight: '8px' }}>
            <option>Mensal</option>
            <option>Semanal</option>
          </select>
          <button
            type='button'
            className='btn btn-primary d-flex align-items-center'
            onClick={handleDownload}
            style={{ backgroundColor: '#000000'}}
          >
            <FiDownload style={{ marginRight: '8px' }} />
            Baixar
          </button>
        </div>
      }
    >
      <p style={{ color: '#6c757d', marginBottom: '24px', fontSize: '16px', fontFamily: 'system-ui' }}>
        Acompanhe faturamento, ticket médio e vendas por período
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
        <div style={{ padding: '16px', borderLeft: '4px solid #e9ecef' }}>
          <p style={{ margin: 0, color: '#6c757d', fontSize: '16px', fontFamily: 'system-ui' }}>Faturamento Total</p>
          <h3 style={{ margin: '8px 0 0 0', fontSize: '24px', fontWeight: 'bold' }}>{financialData.faturamentoTotal}</h3>
        </div>
        <div style={{ padding: '16px', borderLeft: '4px solid #e9ecef' }}>
          <p style={{ margin: 0, color: '#6c757d', fontSize: '16px', fontFamily: 'system-ui' }}>Ticket Médio</p>
          <h3 style={{ margin: '8px 0 0 0', fontSize: '24px', fontWeight: 'bold' }}>{financialData.ticketMedio}</h3>
        </div>
        <div style={{ padding: '16px', borderLeft: '4px solid #e9ecef' }}>
          <p style={{ margin: 0, color: '#6c757d', fontSize: '16px', fontFamily: 'system-ui' }}>Total de Vendas</p>
          <h3 style={{ margin: '8px 0 0 0', fontSize: '24px', fontWeight: 'bold' }}>{financialData.totalVendas}</h3>
        </div>
        <div style={{ padding: '16px', borderLeft: '4px solid #e9ecef' }}>
          <p style={{ margin: 0, color: '#6c757d', fontSize: '16px', fontFamily: 'system-ui' }}>Pagamento Principal</p>
          <p style={{ margin: '8px 0 0 0', fontSize: '18px', fontWeight: '500', fontFamily: 'system-ui' }}>{financialData.mainPayment}</p>
        </div>
      </div>
    </Card>
  );
};

const NetworkReportCard = ({ networkRanking, topProducts }) => {
  const handleDownload = () => {
    const csvRanking = convertArrayToCSV(networkRanking);
    const csvTopProducts = convertArrayToCSV(topProducts);
    const combinedCSV =
      "Ranking de Faturamento\n" +
      csvRanking +
      "\n\n" +
      "Produtos Mais Vendidos\n" +
      csvTopProducts;
    downloadCSV(combinedCSV, 'relatorio-rede.csv');
  };

  return (
    <Card
      title="Relatórios da Rede"
      iconeTitle={rede}
      botaoHeader={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <select style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #ced4da', marginRight: '8px' }}>
            <option>Mensal</option>
            <option>Anual</option>
          </select>
          <button
            type='button'
            className='btn btn-secondary d-flex align-items-center'
            onClick={handleDownload}
            style={{ backgroundColor: '#ffffff', color: '#000000'}}
          >
            <FiDownload style={{ marginRight: '8px' }} />
            Baixar
          </button>
        </div>
      }
    >
      <div style={{ marginTop: '16px' }}>
        <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Ranking de Faturamento</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {networkRanking.map((item, index) => (
            <div
              key={item.id || index}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px',
                backgroundColor: item.isCurrent ? '#e9ecef' : '#e9ebef',
                borderRadius: '6px',
                border: item.isCurrent ? '1px solid #dee2e6' : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', fontWeight: '500' }}>
                <span style={{
                  backgroundColor: '#6c757d',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  marginRight: '12px'
                }}>
                  #{item.id || index + 1}
                </span>
                <span>{item.name}</span>
                {item.isCurrent && (
                  <span style={{
                    backgroundColor: '#343a40',
                    color: '#ffffff',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    marginLeft: '16px'
                  }}>
                    Atual
                  </span>
                )}
              </div>
              <span style={{ fontWeight: 'bold' }}>{item.revenue}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '32px', borderTop: '1px solid #e9ecef', paddingTop: '24px' }}>
        <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Produtos Mais Vendidos</h4>
        <div className='table-responsive'>
          <table className='table table-hover' style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '12px 16px', color: '#6c757d', borderBottom: '2px solid #e9ecef', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '12px' }}>Produto</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', color: '#6c757d', borderBottom: '2px solid #e9ecef', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '12px' }}>Quantidade</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', color: '#6c757d', borderBottom: '2px solid #e9ecef', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '12px' }}>Faturamento</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((product, index) => (
                <tr key={index}>
                  <td style={{ textAlign: 'left', padding: '12px 16px', borderBottom: '1px solid #e9ecef', fontSize: '14px', fontWeight: '500' }}>{product.name}</td>
                  <td style={{ textAlign: 'left', padding: '12px 16px', borderBottom: '1px solid #e9ecef', fontSize: '14px' }}>{product.quantity}</td>
                  <td style={{ textAlign: 'left', padding: '12px 16px', borderBottom: '1px solid #e9ecef', fontSize: '14px' }}>{product.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
};

const PriceReportCard = ({ priceReportData }) => {
  const handleDownload = () => {
    const csvContent = convertArrayToCSV(priceReportData);
    downloadCSV(csvContent, 'relatorio-precos.csv');
  };

  return (
    <Card
      title="Relatórios de Preço"
      iconeTitle={aumento}
      botaoHeader={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <select style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #ced4da', marginRight: '8px' }}>
            <option>Mensal</option>
          </select>
          <button
            type='button'
            className='btn btn-secondary d-flex align-items-center'
            onClick={handleDownload}
            style={{ backgroundColor: '#ffffff', color: '#000000'}}
          >
            <FiDownload style={{ marginRight: '8px' }} />
            Baixar
          </button>
        </div>
      }
    >
      <br></br>
      <div className='table-responsive'>
        <table className='table table-hover' style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '12px 16px', color: '#6c757d', borderBottom: '2px solid #e9ecef', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '12px' }}>Produto</th>
              <th style={{ textAlign: 'left', padding: '12px 16px', color: '#6c757d', borderBottom: '2px solid #e9ecef', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '12px' }}>Responsável</th>
              <th style={{ textAlign: 'left', padding: '12px 16px', color: '#6c757d', borderBottom: '2px solid #e9ecef', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '12px' }}>Preço Anterior</th>
              <th style={{ textAlign: 'left', padding: '12px 16px', color: '#6c757d', borderBottom: '2px solid #e9ecef', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '12px' }}>Novo Preço</th>
              <th style={{ textAlign: 'left', padding: '12px 16px', color: '#6c757d', borderBottom: '2px solid #e9ecef', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '12px' }}>Data Alteração</th>
              <th style={{ textAlign: 'left', padding: '12px 16px', color: '#6c757d', borderBottom: '2px solid #e9ecef', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '12px' }}>Vigência</th>
            </tr>
          </thead>
          <tbody>
            {priceReportData.map((row, index) => (
              <tr key={index}>
                <td style={{ textAlign: 'left', padding: '12px 16px', borderBottom: '1px solid #e9ecef', fontSize: '14px', fontWeight: '500' }}>{row.product}</td>
                <td style={{ textAlign: 'left', padding: '12px 16px', borderBottom: '1px solid #e9ecef', fontSize: '14px' }}>{row.responsible}</td>
                <td style={{ textAlign: 'left', padding: '12px 16px', borderBottom: '1px solid #e9ecef', fontSize: '14px' }}>{row.prevPrice}</td>
                <td style={{ textAlign: 'left', padding: '12px 16px', borderBottom: '1px solid #e9ecef', fontSize: '14px' }}>{row.newPrice}</td>
                <td style={{ textAlign: 'left', padding: '12px 16px', borderBottom: '1px solid #e9ecef', fontSize: '14px' }}>{row.date}</td>
                <td style={{ textAlign: 'left', padding: '12px 16px', borderBottom: '1px solid #e9ecef', fontSize: '14px' }}>{row.effective}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

const StatusBadge = ({ status }) => {
  const isCritical = status === 'Vencimento' || status === 'Crítico';
  return (
    <span style={{
      backgroundColor: isCritical ? '#f8d7da' : '#fff3cd',
      color: isCritical ? '#721c24' : '#856404',
      padding: '4px 10px',
      borderRadius: '12px',
      fontWeight: '600',
      fontSize: '12px'
    }}>
      {status}
    </span>
  );
};

const StockReportCard = ({ stockReportData }) => {
  const handleDownload = () => {
    const csvContent = convertArrayToCSV(stockReportData);
    downloadCSV(csvContent, 'relatorio-estoque.csv');
  };

  return (
    <Card
      title="Relatórios de Estoque"
      iconeTitle={cubo}
      botaoHeader={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <select style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #ced4da', marginRight: '8px' }}>
            <option>Atual</option>
          </select>
          <button
            type='button'
            className='btn btn-secondary d-flex align-items-center'
            onClick={handleDownload}
            style={{ backgroundColor: '#ffffff', color: '#000000'}}
          >
            <FiDownload style={{ marginRight: '8px' }} />
            Baixar
          </button>
        </div>
      }
    >
      <div style={{ marginTop: '16px' }}>
        <div className='table-responsive'>
          <table className='table table-hover' style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '12px 16px', color: '#6c757d', borderBottom: '2px solid #e9ecef', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '12px' }}>Item</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', color: '#6c757d', borderBottom: '2px solid #e9ecef', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '12px' }}>Quantidade</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', color: '#6c757d', borderBottom: '2px solid #e9ecef', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '12px' }}>Estoque Mín.</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', color: '#6c757d', borderBottom: '2px solid #e9ecef', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '12px' }}>Status</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', color: '#6c757d', borderBottom: '2px solid #e9ecef', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '12px' }}>Validade</th>
              </tr>
            </thead>
            <tbody>
              {stockReportData.map((row, index) => (
                <tr key={index}>
                  <td style={{ textAlign: 'left', padding: '12px 16px', borderBottom: '1px solid #e9ecef', fontSize: '14px', fontWeight: '500' }}>{row.item}</td>
                  <td style={{ textAlign: 'left', padding: '12px 16px', borderBottom: '1px solid #e9ecef', fontSize: '14px' }}>{row.quantity}</td>
                  <td style={{ textAlign: 'left', padding: '12px 16px', borderBottom: '1px solid #e9ecef', fontSize: '14px' }}>{row.minStock}</td>
                  <td style={{ textAlign: 'left', padding: '12px 16px', borderBottom: '1px solid #e9ecef', fontSize: '14px' }}>
                    <StatusBadge status={row.status} />
                  </td>
                  <td style={{ textAlign: 'left', padding: '12px 16px', borderBottom: '1px solid #e9ecef', fontSize: '14px' }}>{row.expiry}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
};

const OperationalKpiCard = ({ icon, value, label }) => (
  <div style={{ display: 'flex', alignItems: 'center', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
    <div style={{ fontSize: '24px', color: '#495057', marginRight: '16px' }}>{icon}</div>
    <div>
      <div style={{ fontSize: '22px', fontWeight: 'bold' }}>{value}</div>
      <div style={{ color: '#6c757d', fontSize: '14px' }}>{label}</div>
    </div>
  </div>
);

export default Dashboard;