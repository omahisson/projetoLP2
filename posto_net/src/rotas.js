import React from 'react';

import ListagemEmpregados from './views/listagem-empregados';

import CadastroAdministradores from './views/cadastro-administradores';
import CadastroGerentes from './views/cadastro-gerentes';
import CadastroFuncionarios from './views/cadastro-funcionarios';

import { Route, Routes, BrowserRouter} from 'react-router-dom'

function Rotas({ toggleMenu }){
    return(
        <BrowserRouter>
        <Routes>
            <Route path='/cadastro-administradores/:idParam?' element={<CadastroAdministradores />} /> 
            <Route path='/cadastro-gerentes/:idParam?' element={<CadastroGerentes />} />
            <Route path='/cadastro-funcionarios/:idParam?' element={<CadastroFuncionarios />} />

            <Route path='/empregados' element={<ListagemEmpregados toggleMenu={toggleMenu} />} />
            
            <Route path='/home' element={<div>Home</div>} />
            <Route path='/combustiveis' element={<div>Combustíveis</div>} />
            <Route path='/produtosServicos' element={<div>Produtos e Serviços</div>} />
            <Route path='/pdv' element={<div>PDV</div>} />
            
            <Route path='/' element={<ListagemEmpregados toggleMenu={toggleMenu} />} />
        </Routes>
        </BrowserRouter>
    )
}

export default Rotas;