import React from 'react';
import '../bootstrap.min.css';

import NavbarItem from './navbarItem';

import iconeHome from '../icones/home.svg';
import iconeEmpregados from '../icones/empregados.svg';
import iconeCombustiveis from '../icones/combustiveis.svg';
import iconeProdutosServicos from '../icones/produtosServicos.svg';
import iconePDV from '../icones/pdv.svg';

function Navbar({ menuVisivel }) {
  return (
    <div className={`menu-lateral ${!menuVisivel && 'menu-oculto'}`}>
        <div className='cabecalho-menu'>
          <a href='/' className='navbarzinho-brand'>
          Posto Ipiranga Vila
          </a>
        </div>
        <div className='navbar-nav flex-column navIteem'>
          <NavbarItem
            render='true'
            href='/home'
            label='Home'
            icone={iconeHome}
          />
          <NavbarItem
            render='true'
            href='/empregados'
            label='Empregados'
            icone={iconeEmpregados}
          />
          <NavbarItem
            render='true'
            href='/combustiveis'
            label='Combustiveis'
            icone={iconeCombustiveis}
          />
          <NavbarItem
            render='true'
            href='/produtosServicos'
            label='Produtos e Serviços'
            icone={iconeProdutosServicos}
          />
          <NavbarItem
            render='true'
            href='/pdv'
            label='PDV'
            icone={iconePDV}
          />
        </div>
    </div>
  );
}

export default Navbar;