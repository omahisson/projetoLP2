import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Card from '../components/card';

import { atualizarPosto, buscarPosto, criarPosto } from '../services/postoService';
import '../styles/form-cadastro.css';

function CadastroPosto({ toggleMenu }) {
    const { idParam } = useParams();
    const navigate = useNavigate();

    const [id, setId] = useState('');
    const [razaoSocial, setRazaoSocial] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [nomeFantasia, setNomeFantasia] = useState('');
    const [rua, setRua] = useState('');
    const [numero, setNumero] = useState('');
    const [complemento, setComplemento] = useState('');
    const [bairro, setBairro] = useState('');
    const [cidade, setCidade] = useState('');
    const [estado, setEstado] = useState('');
    const [cep, setCep] = useState('');
    const [telefone, setTelefone] = useState('');
    const [email, setEmail] = useState('');
    const [carregando, setCarregando] = useState(false);

    useEffect(() => {
        if (!idParam) {
            setId('');
            setRazaoSocial('');
            setCnpj('');
            setNomeFantasia('');
            setRua('');
            setNumero('');
            setComplemento('');
            setBairro('');
            setCidade('');
            setEstado('');
            setCep('');
            setTelefone('');
            setEmail('');
            return;
        }

        setCarregando(true);
        buscarPosto(idParam)
            .then((data) => {
                setId(data.id);
                setRazaoSocial(data.razaoSocial || '');
                setCnpj(data.cnpj || '');
                setNomeFantasia(data.nomeFantasia || '');
                setRua(data.rua || data.logradouro || '');
                setNumero(data.numero || '');
                setComplemento(data.complemento || '');
                setBairro(data.bairro || '');
                setCidade(data.cidade || '');
                setEstado(data.estado || '');
                setCep(data.cep || '');
                setTelefone(data.telefone || '');
                setEmail(data.email || '');
            })
            .catch((error) => alert(error.response?.data || 'Erro ao buscar posto'))
            .finally(() => setCarregando(false));
    }, [idParam]);

    function formatarCNPJ(value) {
        const numbers = value.replace(/\D/g, '');
        if (numbers.length <= 14) {
            return numbers.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
        }
        return value;
    }

    function formatarCEP(value) {
        const numbers = value.replace(/\D/g, '');
        if (numbers.length <= 8) {
            return numbers.replace(/^(\d{5})(\d{3})$/, '$1-$2');
        }
        return value;
    }

    function formatarTelefone(value) {
        const numbers = value.replace(/\D/g, '');
        if (numbers.length <= 11) {
            return numbers.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
        }
        return value;
    }

    async function salvar(e) {
        e.preventDefault();

        const payload = {
            razaoSocial,
            cnpj,
            nomeFantasia,
            rua,
            numero,
            complemento,
            bairro,
            cidade,
            estado: estado.toUpperCase(),
            cep,
            telefone,
            email
        };

        if (idParam) {
            payload.id = id;
        }

        try {
            if (idParam) {
                await atualizarPosto(idParam, payload);
                alert('Posto alterado com sucesso');
            } else {
                await criarPosto(payload);
                alert('Posto cadastrado com sucesso');
            }

            navigate('/postos');
        } catch (error) {
            alert(error.response?.data || 'Erro ao salvar posto');
        }
    }

    if (carregando) {
        return null;
    }

    return (
        <div className="form-page-container">
            <div className="form-card-container form-card-container-centered">
                <Card title="Cadastrar Novo Posto" titleAlign="center">
                    <form className="form-structured-form" onSubmit={salvar}>
                        <div className="form-field-group">
                            <p className="form-subtitle" style={{ textAlign: 'center', marginBottom: '16px' }}>
                                Preencha os dados do posto de gasolina
                            </p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="form-field-group">
                                    <label htmlFor="razaoSocial" className="form-label">Razão Social *</label>
                                    <div className="form-input-wrapper">
                                        <input
                                            type="text"
                                            id="razaoSocial"
                                            name="razaoSocial"
                                            value={razaoSocial}
                                            onChange={(e) => setRazaoSocial(e.target.value)}
                                            placeholder="Razão social da empresa"
                                            required
                                            className="card-pdv-input form-input"
                                        />
                                    </div>
                                </div>

                                <div className="form-field-group">
                                    <label htmlFor="cnpj" className="form-label">CNPJ *</label>
                                    <div className="form-input-wrapper">
                                        <input
                                            type="text"
                                            id="cnpj"
                                            name="cnpj"
                                            value={cnpj}
                                            onChange={(e) => setCnpj(formatarCNPJ(e.target.value))}
                                            placeholder="00.000.000/0000-00"
                                            required
                                            className="card-pdv-input form-input"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-field-group">
                                <label htmlFor="nomeFantasia" className="form-label">Nome Fantasia *</label>
                                <div className="form-input-wrapper">
                                    <input
                                        type="text"
                                        id="nomeFantasia"
                                        name="nomeFantasia"
                                        value={nomeFantasia}
                                        onChange={(e) => setNomeFantasia(e.target.value)}
                                        placeholder="Nome fantasia do posto"
                                        required
                                        className="card-pdv-input form-input"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-field-group">
                            <div>
                                <h4 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '4px', fontFamily: 'system-ui' }}>Endereço</h4>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                <div className="form-field-group">
                                    <label htmlFor="rua" className="form-label">Rua/Avenida *</label>
                                    <div className="form-input-wrapper">
                                        <input
                                            type="text"
                                            id="rua"
                                            name="rua"
                                            value={rua}
                                            onChange={(e) => setRua(e.target.value)}
                                            placeholder="Ex: Rua das Flores, Av. Paulista"
                                            required
                                            className="card-pdv-input form-input"
                                        />
                                    </div>
                                </div>

                                <div className="form-field-group">
                                    <label htmlFor="numero" className="form-label">Número *</label>
                                    <div className="form-input-wrapper">
                                        <input
                                            type="text"
                                            id="numero"
                                            name="numero"
                                            value={numero}
                                            onChange={(e) => setNumero(e.target.value)}
                                            placeholder="Ex: 123"
                                            required
                                            className="card-pdv-input form-input"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                <div className="form-field-group">
                                    <label htmlFor="complemento" className="form-label">Complemento</label>
                                    <div className="form-input-wrapper">
                                        <input
                                            type="text"
                                            id="complemento"
                                            name="complemento"
                                            value={complemento}
                                            onChange={(e) => setComplemento(e.target.value)}
                                            placeholder="Ex: Sala 101, Loja 5 (opcional)"
                                            className="card-pdv-input form-input"
                                        />
                                    </div>
                                    <p className="form-subtitle">Campo opcional</p>
                                </div>

                                <div className="form-field-group">
                                    <label htmlFor="bairro" className="form-label">Bairro *</label>
                                    <div className="form-input-wrapper">
                                        <input
                                            type="text"
                                            id="bairro"
                                            name="bairro"
                                            value={bairro}
                                            onChange={(e) => setBairro(e.target.value)}
                                            placeholder="Ex: Centro, Vila Madalena"
                                            required
                                            className="card-pdv-input form-input"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                                <div className="form-field-group">
                                    <label htmlFor="cidade" className="form-label">Cidade *</label>
                                    <div className="form-input-wrapper">
                                        <input
                                            type="text"
                                            id="cidade"
                                            name="cidade"
                                            value={cidade}
                                            onChange={(e) => setCidade(e.target.value)}
                                            placeholder="Ex: São Paulo"
                                            required
                                            className="card-pdv-input form-input"
                                        />
                                    </div>
                                </div>

                                <div className="form-field-group">
                                    <label htmlFor="estado" className="form-label">Estado *</label>
                                    <div className="form-input-wrapper">
                                        <input
                                            type="text"
                                            id="estado"
                                            name="estado"
                                            value={estado}
                                            onChange={(e) => setEstado(e.target.value.toUpperCase())}
                                            placeholder="Ex: SP"
                                            maxLength="2"
                                            required
                                            className="card-pdv-input form-input"
                                        />
                                    </div>
                                    <p className="form-subtitle">Use a sigla (2 letras)</p>
                                </div>

                                <div className="form-field-group">
                                    <label htmlFor="cep" className="form-label">CEP *</label>
                                    <div className="form-input-wrapper">
                                        <input
                                            type="text"
                                            id="cep"
                                            name="cep"
                                            value={cep}
                                            onChange={(e) => setCep(formatarCEP(e.target.value))}
                                            placeholder="00000-000"
                                            maxLength="9"
                                            required
                                            className="card-pdv-input form-input"
                                        />
                                    </div>
                                    <p className="form-subtitle">Formato: 00000-000</p>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div className="form-field-group">
                                <label htmlFor="telefone" className="form-label">Telefone *</label>
                                <div className="form-input-wrapper">
                                    <input
                                        type="tel"
                                        id="telefone"
                                        name="telefone"
                                        value={telefone}
                                        onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
                                        placeholder="(00) 00000-0000"
                                        required
                                        className="card-pdv-input form-input"
                                    />
                                </div>
                            </div>

                            <div className="form-field-group">
                                <label htmlFor="email" className="form-label">E-mail *</label>
                                <div className="form-input-wrapper">
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="contato@posto.com"
                                        required
                                        className="card-pdv-input form-input"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-button-group">
                            <button type="submit" className="form-button-primary">
                                {idParam ? 'Salvar Alterações' : 'Cadastrar Posto'}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/postos')}
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

export default CadastroPosto;
