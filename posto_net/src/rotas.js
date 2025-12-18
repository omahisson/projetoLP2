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
import CadastroBombas from './views/cadastro-bombas';
import CadastroTipoCombustivel from './views/cadastro-tipoCombustivel';
import CadastroAbastecimento from './views/cadastro-abastecimento';
import CadastroNovoPreco from './views/cadastro-novoPreco';
import CadastroPosto from './views/cadastro-posto';
import Postos from './views/postos';
import ListagemEstatisticas from './views/listagem-estatisticas';
import ListagemHistorico from './views/listagem-historico';

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
            <Route path='/cadastro-bombas/:idParam?' element={<CadastroBombas toggleMenu={toggleMenu} />} />
            <Route path='/cadastro-tipoCombustivel/:idParam?' element={<CadastroTipoCombustivel toggleMenu={toggleMenu} />} />
            <Route path='/cadastro-abastecimento/:idParam?' element={<CadastroAbastecimento toggleMenu={toggleMenu} />} />
            <Route path='/cadastro-novoPreco/:idParam?' element={<CadastroNovoPreco toggleMenu={toggleMenu} />} />
            <Route path='/cadastro-posto/:idParam?' element={<CadastroPosto toggleMenu={toggleMenu}/>} />
            <Route path='/listagem-estatisticas/:idParam?' element={<ListagemEstatisticas toggleMenu={toggleMenu}/>} />
            <Route path='/historico/:idParam?' element={<ListagemHistorico toggleMenu={toggleMenu}/>} />
            
            <Route path='/empregados' element={<ListagemEmpregados toggleMenu={toggleMenu} />} />
            
            <Route path='/home' element={<Dashboard toggleMenu={toggleMenu}/>} />
            <Route path='/combustiveis' element={<ListagemCombustiveis toggleMenu={toggleMenu}/>} />
            <Route path='/produtosServicos' element={<ListagemServicosProdutos toggleMenu={toggleMenu} />} />
            <Route path='/pdv' element={<Pdv toggleMenu={toggleMenu} />} />
            <Route path='/pdv-aberto' element={<PdvAberto toggleMenu={toggleMenu} />} />
            <Route path='/postos' element={<Postos />} />
            
            <Route path='/' element={<Postos />} />
        </Routes>
        </BrowserRouter>
    )
}

export default Rotas;