import React from 'react';

import ListagemEmpregados from './views/listagem-empregados';
import Pdv from './views/pdv';
import PdvAberto from './views/pdv-aberto';
import ListagemServicosProdutos from './views/listagem-produtosServicos';

import CadastroAdministradores from './views/cadastro-administradores';
import CadastroGerentes from './views/cadastro-gerentes';
import CadastroFuncionarios from './views/cadastro-funcionarios';
import CadastroServicos from './views/cadastro-servicos';
import CadastroProdutos from './views/cadastro-produtos';

import Dashboard from './views/dashboard';

import { Route, Routes, BrowserRouter} from 'react-router-dom'
import ListagemCombustiveis from './views/listagem-combustiveis';
import CadastroCombustiveis from './views/cadastro-combustiveis';

function Rotas({ toggleMenu }){
    return(
        <BrowserRouter>
        <Routes>
            <Route path='/cadastro-administradores/:idParam?' element={<CadastroAdministradores toggleMenu={toggleMenu} />} /> 
            <Route path='/cadastro-gerentes/:idParam?' element={<CadastroGerentes toggleMenu={toggleMenu} />} />
            <Route path='/cadastro-funcionarios/:idParam?' element={<CadastroFuncionarios toggleMenu={toggleMenu} />} />
            <Route path='/cadastro-combustiveis/:idParam?' element={<CadastroCombustiveis toggleMenu={toggleMenu} />} />
            <Route path='/cadastro-servicos/:idParam?' element={<CadastroServicos toggleMenu={toggleMenu} />} />
            <Route path='/cadastro-produtos/:idParam?' element={<CadastroProdutos toggleMenu={toggleMenu} />} />

            <Route path='/empregados' element={<ListagemEmpregados toggleMenu={toggleMenu} />} />
            
            <Route path='/home' element={<Dashboard toggleMenu={toggleMenu}/>} />
            <Route path='/combustiveis' element={<ListagemCombustiveis toggleMenu={toggleMenu}/>} />
            <Route path='/produtosServicos' element={<ListagemServicosProdutos toggleMenu={toggleMenu} />} />
            <Route path='/pdv' element={<Pdv toggleMenu={toggleMenu} />} />
            <Route path='/pdv-aberto' element={<PdvAberto toggleMenu={toggleMenu} />} />
            
            <Route path='/' element={<Dashboard toggleMenu={toggleMenu}/>} />
        </Routes>
        </BrowserRouter>
    )
}

export default Rotas;