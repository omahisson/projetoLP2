import React, { useState } from 'react';
import { verificarMatricula } from '../services/authService';

function CampoMatricula({ value, onChange, onDisponibilidade, style, wrapperStyle, labelStyle }) {
    const [mensagem, setMensagem] = useState('');

    async function validar() {
        const matricula = value.trim();
        if (!matricula) return;
        setMensagem('Verificando matrícula...');
        try {
            const disponivel = await verificarMatricula(matricula);
            onDisponibilidade(disponivel);
            setMensagem(disponivel ? 'Matrícula disponível.' : 'Esta matrícula já está em uso.');
        } catch {
            onDisponibilidade(false);
            setMensagem('Não foi possível verificar a matrícula. Tente novamente.');
        }
    }

    function alterar(event) {
        onChange(event.target.value);
        onDisponibilidade(null);
        setMensagem('');
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label htmlFor="matricula" style={labelStyle}>Matrícula</label>
            <div style={wrapperStyle}>
                <input id="matricula" name="matricula" value={value} onChange={alterar} onBlur={validar} placeholder="Ex.: PEDRO001" required style={style} className="card-pdv-input" />
            </div>
            {mensagem && <span style={{ fontSize: '13px', color: mensagem === 'Matrícula disponível.' ? '#15803d' : mensagem.startsWith('Verificando') ? '#6b7280' : '#b91c1c', fontFamily: 'system-ui' }}>{mensagem}</span>}
        </div>
    );
}

export default CampoMatricula;
