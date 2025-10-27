import React from 'react';

import ListagemAdministradores from './views/listagem-administradores';
import ListagemGerentes from './views/listagem-gerentes';
import ListagemFuncionarios from './views/listagem-funcionarios';

import CadastroAdministradores from './views/cadastro-administradores';
import CadastroGerentes from './views/cadastro-gerentes';
import CadastroFuncionarios from './views/cadastro-funcionarios';

import { Route, Routes, BrowserRouter} from 'react-router-dom'

function Rotas(props){
    return(
        <BrowserRouter>
        <Routes>
            <Route path='/cadastro-administradores/:idParam?' element={<CadastroAdministradores />} /> 
            <Route path='/cadastro-gerentes/:idParam?' element={<CadastroGerentes />} />
            <Route path='/cadastro-funcionarios/:idParam?' element={<CadastroFuncionarios />} />

            <Route path='/listagem-administradores/:idParam?' element={<ListagemAdministradores />} />
            <Route path='/listagem-gerentes/:idParam?' element={<ListagemGerentes />} />
            <Route path='/listagem-funcionarios/:idParam?' element={<ListagemFuncionarios />} />
        </Routes>
        </BrowserRouter>
    )
}

export default Rotas;