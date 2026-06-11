import React from 'react';
import '../bootstrap.min.css';

import NavbarItem from './navbarItem';

import iconeHome from '../icones/home.svg';
import iconeEmpregados from '../icones/empregados.svg';
import iconeCombustiveis from '../icones/combustiveis.svg';
import iconeProdutosServicos from '../icones/produtosServicos.svg';
import iconePDV from '../icones/pdv.svg';
import iconeTrocarPosto from '../icones/fecharTurno.svg';

function Navbar({ menuVisivel, currentPath }) {
  const nomePosto = localStorage.getItem('postoSelecionado');

  return (
    <div className={`menu-lateral ${!menuVisivel && 'menu-oculto'}`}>
        <div className='cabecalho-menu'>
          <a href='/' className='navbarzinho-brand'>
          {nomePosto}
          </a>
        </div>
        <div className='navbar-nav flex-column navIteem'>
          <NavbarItem
            render='true'
            href='/home'
            label='Home'
            icone={iconeHome}
            isActive={currentPath === '/home'}
          />
          <NavbarItem
            render='true'
            href='/empregados'
            label='Empregados'
            icone={iconeEmpregados}
            isActive={currentPath === '/empregados' || (currentPath.startsWith('/cadastro-') && (currentPath.includes('administradores') || currentPath.includes('gerentes') || currentPath.includes('funcionarios')))}
          />
          <NavbarItem
            render='true'
            href='/combustiveis'
            label='Combustiveis'
            icone={iconeCombustiveis}
            isActive={currentPath === '/combustiveis' || currentPath.startsWith('/cadastro-tipoCombustivel') || currentPath.startsWith('/cadastro-bombas') || currentPath.startsWith('/cadastro-abastecimento') || currentPath.startsWith('/cadastro-novoPreco')}
          />
          <NavbarItem
            render='true'
            href='/produtosServicos'
            label='Produtos e Serviços'
            icone={iconeProdutosServicos}
            isActive={currentPath === '/produtosServicos' || currentPath.startsWith('/cadastro-produtos') || currentPath.startsWith('/cadastro-servicos')}
          />
          <NavbarItem
            render='true'
            href='/pdv'
            label='PDV'
            icone={iconePDV}
            isActive={currentPath === '/pdv' || currentPath === '/pdv-aberto'}
          />
          <NavbarItem
            render='true'
            href='/postos'
            label='Trocar posto'
            icone={iconeTrocarPosto}
            isActive={currentPath === '/postos'}
          />
        </div>
    </div>
  );
}

export default Navbar;
