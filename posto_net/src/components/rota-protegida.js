import React from 'react';
import { Navigate } from 'react-router-dom';

function RotaProtegida({ cargos, children }) {
    const cargo = localStorage.getItem('cargo');
    const token = localStorage.getItem('token');

    if (!token) return <Navigate to="/login" replace />;
    if (!cargos.includes(cargo)) return <Navigate to="/pdv" replace />;
    return children;
}

export default RotaProtegida;
