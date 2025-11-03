import React from 'react';
import { 
  FiDollarSign, FiBarChart2, FiDownload, FiHome, FiTrendingUp, 
  FiTag, FiArchive, FiCheckSquare, FiClock, FiFileText, FiChevronDown
} from 'react-icons/fi';
//import './App.css';

// --- DADOS MOCKADOS (Simulando uma API) ---

const financialData = {
  totalRevenue: 'R$ 125.430,50',
  averageTicket: 'R$ 87,25',
  totalSales: '1438',
  mainPayment: 'Cartão de Crédito (45%)',
};

const networkRanking = [
  { id: 1, name: 'Posto Shell Centro', revenue: 'R$ 125.430,50' },
  { id: 2, name: 'Posto BR Rodovia', revenue: 'R$ 98.750,30' },
  { id: 3, name: 'Posto Ipiranga Vila', revenue: 'R$ 87.650,20', isCurrent: true },
  { id: 4, name: 'Posto Texaco Norte', revenue: 'R$ 76.540,10' },
];

const topProducts = [
  { name: 'Gasolina Comum', quantity: '15.420', revenue: 'R$ 89.250,30' },
  { name: 'Diesel S-10', quantity: '8.750', revenue: 'R$ 52.800,40' },
  { name: 'Etanol', quantity: '6.320', revenue: 'R$ 31.250,80' },
  { name: 'Água Mineral', quantity: '2.850', revenue: 'R$ 7.125,00' },
  { name: 'Refrigerante', quantity: '1.960', revenue: 'R$ 8.820,00' },
];

const priceReportData = [
    { product: 'Gasolina Comum', responsible: 'João Silva', prevPrice: 'R$ 5,65', newPrice: 'R$ 5,39', date: '19/08/2024', effective: '20/08/2024' },
    { product: 'Diesel S-10', responsible: 'Maria Santos', prevPrice: 'R$ 5,55', newPrice: 'R$ 5,92', date: '18/08/2024', effective: '19/08/2024' },
    { product: 'Etanol', responsible: 'Carlos Lima', prevPrice: 'R$ 4,25', newPrice: 'R$ 4,25', date: '17/08/2024', effective: '18/08/2024' },
];

const stockReportData = [
    { item: 'Gasolina Aditivada', quantity: 855, minStock: 1000, status: 'Em Alerta', expiry: '14/12/2024' },
    { item: 'Óleo Lubrificante 1L', quantity: 12, minStock: 20, status: 'Crítico', expiry: '25/10/2024' },
    { item: 'Chocolate Lata', quantity: 8, minStock: 15, status: 'Crítico', expiry: '24/10/2024' },
];

const operationalData = {
    openChecklists: { value: '8/10', label: 'Checklists Abertos' },
    activeShifts: { value: 3, label: 'Turnos Ativos' },
    formsToday: { value: 12, label: 'Formulários Hoje' },
};


// --- COMPONENTES ---

const App = () => {
  return (
    <div style={styles.appLayout}>
      <main style={styles.mainContent}>
        <Header />

        {/* --- Seções do Dashboard --- */}
        <FinancialReportCard />
        <NetworkReportCard />
        <PriceReportCard />
        <StockReportCard />
        <OperationalReportCard />

      </main>
    </div>
  );
};

// Componentes menores para organizar o código

const Header = () => (
    <header style={styles.header}>
        <h1>Relatórios - Posto Ipiranga Vila</h1>
        <p style={styles.subtitle}>Análise o desempenho e acompanhe indicadores importantes do seu posto</p>
    </header>
);

const Card = ({ children, style }) => (
    <div style={{...styles.card, ...style}}>
        {children}
    </div>
);

const CardHeader = ({ icon, title, children }) => (
    <div style={styles.cardHeader}>
        <div style={styles.cardTitleContainer}>
            {icon}
            <h2 style={styles.cardTitle}>{title}</h2>
        </div>
        <div style={styles.cardActions}>
            <select style={styles.select}>{children}</select>
            <button style={styles.downloadButton}>
                <FiDownload style={{ marginRight: '8px' }} />
                Baixar
            </button>
        </div>
    </div>
);

const KpiCard = ({ title, value }) => (
    <div style={styles.kpiCard}>
        <p style={styles.kpiTitle}>{title}</p>
        <h3 style={styles.kpiValue}>{value}</h3>
    </div>
);

const FinancialReportCard = () => (
    <Card>
        <CardHeader icon={<FiDollarSign size={20} color="#6c757d" />} title="Relatórios Financeiros">
            <option>Mensal</option>
            <option>Semanal</option>
        </CardHeader>
        <p style={styles.cardSubtitle}>Acompanhe faturamento, ticket médio e vendas por período</p>
        <div style={styles.kpiGrid}>
            <KpiCard title="Faturamento Total" value={financialData.totalRevenue} />
            <KpiCard title="Ticket Médio" value={financialData.averageTicket} />
            <KpiCard title="Total de Vendas" value={financialData.totalSales} />
            <KpiCard title="Pagamento Principal" value={financialData.mainPayment} />
        </div>
    </Card>
);

const NetworkReportCard = () => (
    <Card>
        <CardHeader icon={<FiBarChart2 size={20} color="#6c757d" />} title="Relatórios da Rede">
            <option>Mensal</option>
            <option>Anual</option>
        </CardHeader>
        <section style={{marginTop: '16px'}}>
            <h3 style={styles.sectionTitle}>Ranking de Faturamento</h3>
            <div style={styles.rankingList}>
                {networkRanking.map((item) => (
                    <div key={item.id} style={item.isCurrent ? styles.rankingItemCurrent : styles.rankingItem}>
                        <div style={styles.rankingInfo}>
                            <span>#{item.id}</span>
                            <span style={{ marginLeft: '16px' }}>{item.name}</span>
                            {item.isCurrent && <span style={styles.currentBadge}>Atual</span>}
                        </div>
                        <span style={styles.rankingValue}>{item.revenue}</span>
                    </div>
                ))}
            </div>
        </section>
        <section style={{ marginTop: '32px' }}>
            <h3 style={styles.sectionTitle}>Produtos Mais Vendidos</h3>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Produto</th>
                        <th style={styles.th}>Quantidade</th>
                        <th style={styles.th}>Faturamento</th>
                    </tr>
                </thead>
                <tbody>
                    {topProducts.map((product, index) => (
                        <tr key={index}>
                            <td style={styles.td}>{product.name}</td>
                            <td style={styles.td}>{product.quantity}</td>
                            <td style={styles.td}>{product.revenue}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    </Card>
);

const PriceReportCard = () => (
    <Card>
        <CardHeader icon={<FiTag size={20} color="#6c757d" />} title="Relatórios de Preço">
            <option>Mensal</option>
        </CardHeader>
        <table style={{...styles.table, marginTop: '16px'}}>
            <thead>
                <tr>
                    <th style={styles.th}>Produto</th>
                    <th style={styles.th}>Responsável</th>
                    <th style={styles.th}>Preço Anterior</th>
                    <th style={styles.th}>Novo Preço</th>
                    <th style={styles.th}>Data Alteração</th>
                    <th style={styles.th}>Vigência</th>
                </tr>
            </thead>
            <tbody>
                {priceReportData.map((row, index) => (
                    <tr key={index}>
                        <td style={styles.td}>{row.product}</td>
                        <td style={styles.td}>{row.responsible}</td>
                        <td style={styles.td}>{row.prevPrice}</td>
                        <td style={styles.td}>{row.newPrice}</td>
                        <td style={styles.td}>{row.date}</td>
                        <td style={styles.td}>{row.effective}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </Card>
);

const StatusBadge = ({ status }) => {
    const style = status === 'Crítico' ? styles.statusBadgeCritical : styles.statusBadgeAlert;
    return <span style={style}>{status}</span>
}

const StockReportCard = () => (
    <Card>
        <CardHeader icon={<FiArchive size={20} color="#6c757d" />} title="Relatórios de Estoque">
            <option>Hoje</option>
        </CardHeader>
        <table style={{...styles.table, marginTop: '16px'}}>
            <thead>
                <tr>
                    <th style={styles.th}>Item em Situação de Vencimento</th>
                    <th style={styles.th}>Quantidade</th>
                    <th style={styles.th}>Estoque Min.</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Validade</th>
                </tr>
            </thead>
            <tbody>
                {stockReportData.map((row, index) => (
                    <tr key={index}>
                        <td style={styles.td}>{row.item}</td>
                        <td style={styles.td}>{row.quantity}</td>
                        <td style={styles.td}>{row.minStock}</td>
                        <td style={styles.td}><StatusBadge status={row.status} /></td>
                        <td style={styles.td}>{row.expiry}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </Card>
);

const OperationalKpiCard = ({icon, value, label}) => (
    <div style={styles.opKpiCard}>
        <div style={styles.opKpiIcon}>{icon}</div>
        <div>
            <div style={styles.opKpiValue}>{value}</div>
            <div style={styles.opKpiLabel}>{label}</div>
        </div>
    </div>
)

const OperationalReportCard = () => (
    <Card>
        <CardHeader icon={<FiCheckSquare size={20} color="#6c757d" />} title="Relatórios Operacionais">
            <option>Diário</option>
        </CardHeader>
        <p style={styles.cardSubtitle}>Análise por turnos, checklist e fluxo de trabalho</p>
        <div style={styles.opKpiGrid}>
            <OperationalKpiCard icon={<FiCheckSquare />} value={operationalData.openChecklists.value} label={operationalData.openChecklists.label} />
            <OperationalKpiCard icon={<FiClock />} value={operationalData.activeShifts.value} label={operationalData.activeShifts.label} />
            <OperationalKpiCard icon={<FiFileText />} value={operationalData.formsToday.value} label={operationalData.formsToday.label} />
        </div>
    </Card>
);


// --- ESTILOS (CSS-in-JS) ---

const styles = {
  appLayout: {
    display: 'flex',
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    fontFamily: '"Inter", Arial, sans-serif',
  },
  sidebar: {
    width: '250px',
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRight: '1px solid #dee2e6',
  },
  sidebarHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    marginBottom: '20px',
    border: '1px solid #e9ecef',
    borderRadius: '8px',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 10px',
    listStyle: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    color: '#495057',
    marginBottom: '4px'
  },
  navItemActive: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 10px',
    listStyle: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    backgroundColor: '#f1f3f5',
    color: '#212529',
    fontWeight: '600',
    marginBottom: '4px'
  },
  mainContent: {
    flex: 1,
    padding: '32px',
    overflowY: 'auto',
  },
  header: {
    marginBottom: '32px',
  },
  subtitle: {
    color: '#6c757d'
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '24px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    marginBottom: '24px',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  cardTitleContainer: { display: 'flex', alignItems: 'center' },
  cardTitle: { fontSize: '18px', fontWeight: '600', marginLeft: '12px', margin: '0 0 0 12px' },
  cardActions: { display: 'flex', alignItems: 'center' },
  select: { padding: '8px 12px', borderRadius: '6px', border: '1px solid #ced4da', backgroundColor: '#f8f9fa', marginRight: '16px' },
  downloadButton: { display: 'flex', alignItems: 'center', padding: '8px 16px', borderRadius: '6px', border: 'none', backgroundColor: '#343a40', color: '#ffffff', cursor: 'pointer', fontWeight: 'bold' },
  cardSubtitle: { color: '#6c757d', marginTop: 0, marginBottom: '24px', fontSize: '14px' },
  kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' },
  kpiCard: { padding: '16px', borderLeft: '4px solid #e9ecef' },
  kpiTitle: { margin: 0, color: '#6c757d', fontSize: '14px' },
  kpiValue: { margin: '8px 0 0 0', fontSize: '24px', fontWeight: 'bold' },
  sectionTitle: { fontSize: '16px', fontWeight: '600', marginBottom: '16px' },
  rankingList: { display: 'flex', flexDirection: 'column', gap: '8px' },
  rankingItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '6px' },
  rankingItemCurrent: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: '#e9ecef', borderRadius: '6px', border: '1px solid #dee2e6' },
  rankingInfo: { display: 'flex', alignItems: 'center', fontWeight: '500' },
  currentBadge: { backgroundColor: '#6c757d', color: '#ffffff', fontSize: '12px', fontWeight: 'bold', padding: '4px 8px', borderRadius: '12px', marginLeft: '16px' },
  rankingValue: { fontWeight: 'bold' },
  table: { width: '100%', borderCollapse: 'collapse', },
  th: { textAlign: 'left', padding: '12px 16px', color: '#6c757d', borderBottom: '2px solid #e9ecef', fontWeight: 'normal', textTransform: 'uppercase', fontSize: '12px' },
  td: { textAlign: 'left', padding: '12px 16px', borderBottom: '1px solid #e9ecef', fontSize: '14px' },
  statusBadgeAlert: { backgroundColor: '#fff3cd', color: '#856404', padding: '4px 10px', borderRadius: '12px', fontWeight: '600', fontSize: '12px' },
  statusBadgeCritical: { backgroundColor: '#f8d7da', color: '#721c24', padding: '4px 10px', borderRadius: '12px', fontWeight: '600', fontSize: '12px' },
  opKpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' },
  opKpiCard: { display: 'flex', alignItems: 'center', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' },
  opKpiIcon: { fontSize: '24px', color: '#495057', marginRight: '16px' },
  opKpiValue: { fontSize: '22px', fontWeight: 'bold' },
  opKpiLabel: { color: '#6c757d', fontSize: '14px' },
};

export default App;