import React from 'react'; //importo em toda pagina
import './bootstrap.min.css'; //estilo css
import 'toastr/build/toastr.min';
import 'toastr/build/toastr.css';
import Navbar from './components/navbar.js';
import Rotas from './rotas.js';

//react ou eh classe ou funcao
// q retorna uma coisa, entao uso objeto para devolver mais

class App extends React.Component {
  state = { menuVisivel: localStorage.getItem('menuVisivel') !== 'false' };

  toggleMenu = () => {
    const novoEstado = !this.state.menuVisivel;
    this.setState({ menuVisivel: novoEstado });
    localStorage.setItem('menuVisivel', novoEstado);
  }

  render() {
    const { menuVisivel } = this.state;
    const currentPath = window.location.pathname;
    const mostrarNavbar = !currentPath.includes('/cadastro-posto');
    
    return (
      <div className='d-flex'>
        {mostrarNavbar && <Navbar menuVisivel={menuVisivel} />}
        <div className={`conteudo-principal ${!menuVisivel && 'menu-escondido'} ${!mostrarNavbar && 'menu-escondido'}`}>
          <Rotas toggleMenu={this.toggleMenu} />
        </div>
      </div>
    )
  }
}

export default App;