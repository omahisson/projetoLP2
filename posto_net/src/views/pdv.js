import React from 'react';

import { useNavigate } from 'react-router-dom';

import iconeColuna from '../icones/coluna.svg';
import CardPDV, { CardPDVSelect, CardPDVInput } from '../components/card-pdv';
import iconeRelogio from '../icones/relogio.svg';
import iconeADM from '../icones/adm.svg';
import iconeAdd from '../icones/add.svg';
import iconeGerentes from '../icones/gerentes.svg';
import iconeFuncionarios from '../icones/funcionarios.svg';

import axios from 'axios';
import { BASE_URL } from '../config/axios';

function Pdv({ toggleMenu }) {
    const navigate = useNavigate();

    const handleAbrirTurno = () => {
        navigate('/pdv-aberto');
    };

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '20px' }}>
                <div className='container-icone-coluna' onClick={toggleMenu}>
                    <img src={iconeColuna} alt="Coluna" width="16" height="16" />
                </div>
                <span className='textoDashboard'>Dashboard - Posto Ipiranga Vila</span>
            </div>
            <div className='pdv-wrapper'>
                <CardPDV
                    icone={iconeRelogio}
                    titulo='Abertura de Turno'
                    subtitulo='Informe os dados necessários para iniciar o turno'
                    label='Operador'
                    selectPlaceholder='Selecione o funcionário'
                    selectOptionLabel={({ text, value }) => `${text} (${value})`}
                    selectOptions={[
                        { value: 'Frentista', text: 'Fernanda Rodrigues' },
                        { value: 'Supervisor', text: 'Paulo Mendez' }
                    ]}
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
                        />
                    </div>

                    <div className='mt-0 align-self-stretch'>
                        <CardPDVInput
                            label='Valor Inicial em Caixa'
                            prefix='R$'
                            placeholder='0,00'
                            inputProps={{ inputMode: 'decimal' }}
                        />
                    </div>

                    <div className='mt-2 align-self-stretch'>
                        <button type='button' className='card-pdv-button' onClick={handleAbrirTurno}>
                            Abrir Turno
                        </button>
                    </div>
                </CardPDV>
            </div>
        </div>
    );
}

export default Pdv;

