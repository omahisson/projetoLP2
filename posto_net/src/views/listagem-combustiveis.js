import React from 'react';
import axios from 'axios';
import { BASE_URL } from '../config/axios';
import { 
  FiPlus, 
  FiTag, 
  FiClock, 
  FiTrendingUp, 
  FiFilter // Ícone para "Bomba", parece um filtro/funil
} from 'react-icons/fi';

// --- COMPONENTE PRINCIPAL ---

const ListagemCombustiveis = () => {

  const [tiposCombustivel, setTiposCombustivel] = React.useState([]);
  const [dadosBomba, setDadosBomba] = React.useState([]);

  const [loading, setLoading] = React.useState(true); 
  const [error, setError] = React.useState(null); 

  React.useEffect(() => {
    // --- MUDANÇA ---
    // Coloca todas as chamadas em um array de "Promises"
    const promises = [
      axios.get(`${BASE_URL}/TiposCombustivel`),
      axios.get(`${BASE_URL}/DadosBomba`),
    ];

    // Promise.all espera todas terminarem
    Promise.all(promises)
      .then((responses) => {
        // 'responses' é um array com os resultados NA MESMA ORDEM que as chamadas
        console.log('Tipos de combustíveis:', responses[0].data);
        setTiposCombustivel(responses[0].data);

        console.log('Dados das bombas:', responses[1].data);
        setDadosBomba(Array.isArray(responses[1].data) ? responses[1].data : []);
        
      })
      .catch((err) => {
        // Pega qualquer erro de qualquer chamada
        console.error("Erro ao buscar dados do dashboard:", err);
        setError(err.message);
      })
      .finally(() => {
        // Roda no final, com sucesso ou erro
        setLoading(false); 
      });

  }, []); // Array vazio, roda só uma vez

  // --- MUDANÇA ---
  // Verificação de loading e erro centralizada
  if (loading) {
    return <div>Carregando dados do dashboard...</div>;
  }

  if (error) {
    return <div>Ocorreu um erro: {error}</div>;
  }

  return (
    <main style={styles.mainContent}>
      {/* 1. Cabeçalho da Página */}
      <Header />
      
      {/* 2. Seção Tipos de Combustível */}
      <SectionTiposCombustivel tiposCombustivelData = {tiposCombustivel}/>

      {/* 3. Seção Bombas de Combustível */}
      <SectionBombasCombustivel bombasCombustivelData = {dadosBomba}/>
    </main>
  );
};

// --- COMPONENTES MENORES ---

const Header = () => (
  <header style={styles.header}>
    <div>
      <h1 style={styles.headerTitle}>Gerenciamento de Combustíveis</h1>
      <p style={styles.headerSubtitle}>Gerencie abastecimentos, bombas e tipos de combustível</p>
    </div>
    <button style={styles.primaryButton}>
      <FiPlus size={16} style={{ marginRight: '8px' }} />
      Cadastrar Abastecimento
    </button>
  </header>
);

const SectionHeader = ({ icon, title, buttonText }) => (
  <div style={styles.sectionHeader}>
    <div style={styles.sectionTitleContainer}>
      {icon}
      <h2 style={styles.sectionTitle}>{title}</h2>
    </div>
    <button style={styles.secondaryButton}>
      <FiPlus size={16} style={{ marginRight: '8px' }} />
      {buttonText}
    </button>
  </div>
);

const SectionTiposCombustivel = ({tiposCombustivelData}) => (
  <section>
    <SectionHeader 
      icon={<FiTag size={20} style={{ marginRight: '12px' }} />} 
      title="Tipos de Combustível"
      buttonText="Novo Tipo"
    />
    <div style={styles.listContainer}>
      {tiposCombustivelData.map(tipo => (
        <TipoCombustivelCard key={tipo.id} tipo={tipo} />
      ))}
    </div>
  </section>
);

const TipoCombustivelCard = ({ tipo }) => (
  <div style={styles.tipoCard}>
    <div style={styles.tipoCardInfo}>
      <div style={styles.tipoCardHeader}>
        <h3 style={styles.tipoCardTitle}>{tipo.nome}</h3>
        <span style={styles.priceBadge}>{tipo.preco}</span>
      </div>
      <div style={styles.infoGrid}>
        <InfoItem label="Fornecedor" value={tipo.fornecedor} />
        <InfoItem label="Último Abastecimento" value={tipo.ultimoAbastecimento} />
        <InfoItem label="Validade" value={tipo.validade} />
        <InfoItem label="Estoque" value={tipo.estoque} />
        <InfoItem label="Status" value={tipo.status} />
      </div>
    </div>
    <div style={styles.tipoCardActions}>
      <button style={styles.priceButton}>Preço</button>
      <button style={styles.iconButton}><FiClock size={18} /></button>
      <button style={styles.iconButton}><FiTrendingUp size={18} /></button>
    </div>
  </div>
);

const InfoItem = ({ label, value }) => (
  <div>
    <p style={styles.infoLabel}>{label}</p>
    <p style={styles.infoValue}>{value}</p>
  </div>
);

const SectionBombasCombustivel = ({bombasCombustivelData}) => (
  <section style={{ marginTop: '40px' }}>
    <SectionHeader 
      icon={<FiFilter size={20} style={{ marginRight: '12px' }} />} 
      title="Bombas de Combustível"
      buttonText="Nova Bomba"
    />
    <div style={styles.gridContainer}>
      {bombasCombustivelData.map(bomba => (
        <BombaCombustivelCard key={bomba.id} bomba={bomba} />
      ))}
    </div>
  </section>
);

const BombaCombustivelCard = ({ bomba }) => {
  const isAtiva = bomba.status === 'Ativa';
  
  let badgeType = 'default';
  if (bomba.status === 'Ativa') badgeType = 'ativa';
  if (bomba.status === 'Manutenção') badgeType = 'manutencao';

  return (
    <div style={styles.bombaCard}>
      <div style={styles.bombaCardHeader}>
        <h3 style={styles.bombaCardTitle}>{bomba.nome}</h3>
        <Badge text={bomba.status} type={badgeType} />
      </div>
      <div style={styles.bombaCardContent}>
        <p style={styles.bombaCardSubtitle}>Combustíveis:</p>
        <div style={styles.tagContainer}>
          {bomba.combustiveis.map(comb => (
            <Tag key={comb} text={comb} />
          ))}
        </div>
      </div>
      <div style={styles.bombaCardFooter}>
        <button style={styles.secondaryButton}>Editar</button>
        <button style={styles.secondaryButton}>
          {isAtiva ? 'Inativar' : 'Ativar'}
        </button>
      </div>
    </div>
  );
};

const Badge = ({ text, type }) => {
  let style = styles.badgeDefault;
  if (type === 'ativa') style = { ...style, ...styles.badgeAtiva };
  if (type === 'manutencao') style = { ...style, ...styles.badgeManutencao };

  return (
    <span style={style}>{text}</span>
  );
};

const Tag = ({ text }) => (
  <span style={styles.tag}>{text}</span>
);

// --- ESTILOS (CSS-in-JS) ---

const styles = {
  mainContent: {
    flex: 1,
    padding: '32px',
    backgroundColor: '#f8f9fa', // Fundo cinza claro
    fontFamily: '"Inter", Arial, sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
  },
  headerTitle: {
    fontSize: '24px',
    fontWeight: '600',
    margin: 0,
    color: '#212529',
  },
  headerSubtitle: {
    fontSize: '16px',
    color: '#6c757d',
    margin: '4px 0 0 0',
  },
  primaryButton: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 16px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#343a40',
    color: '#ffffff',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
  },
  secondaryButton: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 14px',
    borderRadius: '6px',
    border: '1px solid #ced4da',
    backgroundColor: '#ffffff',
    color: '#343a40',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '14px',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '16px',
    borderBottom: '1px solid #e9ecef',
    marginBottom: '24px',
  },
  sectionTitleContainer: {
    display: 'flex',
    alignItems: 'center',
    color: '#343a40',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    margin: 0,
  },
  listContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  tipoCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: '#ffffff',
    border: '1px solid #e9ecef',
    borderRadius: '8px',
    padding: '20px',
  },
  tipoCardInfo: {
    flex: 1,
  },
  tipoCardHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '16px',
  },
  tipoCardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    margin: 0,
  },
  priceBadge: {
    backgroundColor: '#343a40',
    color: '#ffffff',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold',
    marginLeft: '12px',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '16px',
  },
  infoLabel: {
    fontSize: '12px',
    color: '#6c757d',
    margin: 0,
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: '14px',
    color: '#212529',
    fontWeight: '500',
    margin: '4px 0 0 0',
  },
  tipoCardActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginLeft: '16px',
  },
  priceButton: {
    fontSize: '14px',
    color: '#6c757d',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '500',
    padding: '8px',
  },
  iconButton: {
    background: 'none',
    border: 'none',
    color: '#6c757d',
    cursor: 'pointer',
    padding: '8px',
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '24px',
  },
  bombaCard: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    border: '1px solid #e9ecef',
    borderRadius: '8px',
    padding: '20px',
    height: '100%',
  },
  bombaCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
  },
  bombaCardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    margin: 0,
  },
  badgeDefault: {
    padding: '4px 10px',
    borderRadius: '12px',
    fontWeight: '600',
    fontSize: '12px',
    textTransform: 'capitalize',
  },
  badgeAtiva: {
    backgroundColor: '#d4edda', // Verde
    color: '#155724',
  },
  badgeManutencao: {
    backgroundColor: '#fff3cd', // Amarelo
    color: '#856404',
  },
  bombaCardContent: {
    flex: 1,
  },
  bombaCardSubtitle: {
    fontSize: '14px',
    color: '#6c757d',
    margin: 0,
  },
  tagContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '12px',
  },
  tag: {
    backgroundColor: '#f1f3f5',
    color: '#495057',
    padding: '6px 10px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '500',
  },
  bombaCardFooter: {
    display: 'flex',
    gap: '12px',
    marginTop: '20px',
    paddingTop: '16px',
    borderTop: '1px solid #f1f3f5',
  },
};

export default ListagemCombustiveis;