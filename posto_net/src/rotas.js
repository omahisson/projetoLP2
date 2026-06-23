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
import Login from './views/login';
import CriarConta from './views/criar-conta';
import RotaProtegida from './components/rota-protegida';

import Dashboard from './views/dashboard';

import { Route, Routes, BrowserRouter} from 'react-router-dom'
import ListagemCombustiveis from './views/listagem-combustiveis';

function Rotas({ toggleMenu }){
    return(
        <BrowserRouter>
        <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/criar-conta' element={<CriarConta />} />
            <Route path='/cadastro-administradores/:idParam?' element={<RotaProtegida cargos={['ADMINISTRADOR']}><CadastroAdministradores toggleMenu={toggleMenu} /></RotaProtegida>} /> 
            <Route path='/cadastro-gerentes/:idParam?' element={<RotaProtegida cargos={['ADMINISTRADOR']}><CadastroGerentes toggleMenu={toggleMenu} /></RotaProtegida>} />
            <Route path='/cadastro-funcionarios/:idParam?' element={<RotaProtegida cargos={['ADMINISTRADOR', 'GERENTE']}><CadastroFuncionarios toggleMenu={toggleMenu} /></RotaProtegida>} />
            <Route path='/cadastro-servicos/:idParam?' element={<RotaProtegida cargos={['ADMINISTRADOR', 'GERENTE']}><CadastroServicos toggleMenu={toggleMenu} /></RotaProtegida>} />
            <Route path='/cadastro-produtos/:idParam?' element={<RotaProtegida cargos={['ADMINISTRADOR', 'GERENTE']}><CadastroProdutos toggleMenu={toggleMenu} /></RotaProtegida>} />
            <Route path='/cadastro-bombas/:idParam?' element={<RotaProtegida cargos={['ADMINISTRADOR', 'GERENTE']}><CadastroBombas toggleMenu={toggleMenu} /></RotaProtegida>} />
            <Route path='/cadastro-tipoCombustivel/:idParam?' element={<RotaProtegida cargos={['ADMINISTRADOR', 'GERENTE']}><CadastroTipoCombustivel toggleMenu={toggleMenu} /></RotaProtegida>} />
            <Route path='/cadastro-abastecimento/:idParam?' element={<RotaProtegida cargos={['ADMINISTRADOR', 'GERENTE']}><CadastroAbastecimento toggleMenu={toggleMenu} /></RotaProtegida>} />
            <Route path='/cadastro-novoPreco/:idParam?' element={<RotaProtegida cargos={['ADMINISTRADOR', 'GERENTE']}><CadastroNovoPreco toggleMenu={toggleMenu} /></RotaProtegida>} />
            <Route path='/cadastro-posto/:idParam?' element={<RotaProtegida cargos={['ADMINISTRADOR', 'GERENTE']}><CadastroPosto toggleMenu={toggleMenu}/></RotaProtegida>} />
            <Route path='/listagem-estatisticas/:idParam?' element={<ListagemEstatisticas toggleMenu={toggleMenu}/>} />
            <Route path='/historico/:idParam?' element={<ListagemHistorico toggleMenu={toggleMenu}/>} />
            
            <Route path='/empregados' element={<RotaProtegida cargos={['ADMINISTRADOR', 'GERENTE']}><ListagemEmpregados toggleMenu={toggleMenu} /></RotaProtegida>} />
            
            <Route path='/home' element={<RotaProtegida cargos={['ADMINISTRADOR', 'GERENTE']}><Dashboard toggleMenu={toggleMenu}/></RotaProtegida>} />
            <Route path='/combustiveis' element={<ListagemCombustiveis toggleMenu={toggleMenu}/>} />
            <Route path='/produtosServicos' element={<ListagemServicosProdutos toggleMenu={toggleMenu} />} />
            <Route path='/pdv' element={<Pdv toggleMenu={toggleMenu} />} />
            <Route path='/pdv-aberto' element={<PdvAberto toggleMenu={toggleMenu} />} />
            <Route path='/postos' element={<RotaProtegida cargos={['ADMINISTRADOR', 'GERENTE']}><Postos /></RotaProtegida>} />
            
            <Route path='/' element={<Login />} />
        </Routes>
        </BrowserRouter>
    )
}

export default Rotas;
