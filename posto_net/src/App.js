import React from 'react'; //importo em toda pagina
import './bootstrap.min.css'; //estilo css
import 'toastr/build/toastr.min';
import 'toastr/build/toastr.css';
import Navbar from './components/navbar.js';
import Rotas from './rotas.js';

//react ou eh classe ou funcao
// q retorna uma coisa, entao uso objeto para devolver mais

class App extends React.Component {
  state = { 
    menuVisivel: localStorage.getItem('menuVisivel') !== 'false',
    currentPath: window.location.pathname
  };

  toggleMenu = () => {
    const novoEstado = !this.state.menuVisivel;
    this.setState({ menuVisivel: novoEstado });
    localStorage.setItem('menuVisivel', novoEstado);
  }

  componentDidMount() {
    this.pathnameListener = () => {
      this.setState({ currentPath: window.location.pathname });
    };
    
    window.addEventListener('popstate', this.pathnameListener);
    
    this.pathCheckInterval = setInterval(() => {
      const newPath = window.location.pathname;
      if (newPath !== this.state.currentPath) {
        this.setState({ currentPath: newPath });
      }
    }, 100);
  }

  componentWillUnmount() {
    if (this.pathnameListener) {
      window.removeEventListener('popstate', this.pathnameListener);
    }
    if (this.pathCheckInterval) {
      clearInterval(this.pathCheckInterval);
    }
  }

  render() {
    const { menuVisivel } = this.state;
    const currentPath = window.location.pathname;
    const rotaAutenticacao = currentPath === '/' || currentPath === '/login' || currentPath === '/criar-conta';
    const mostrarNavbar = !rotaAutenticacao && !currentPath.includes('/cadastro-posto') && currentPath !== '/postos';
    
    return (
      <div className='d-flex'>
        {mostrarNavbar && <Navbar menuVisivel={menuVisivel} currentPath={currentPath} />}
        <div className={`conteudo-principal ${!menuVisivel && 'menu-escondido'} ${!mostrarNavbar && 'menu-escondido'}`}>
          <Rotas toggleMenu={this.toggleMenu} />
        </div>
      </div>
    )
  }
}

export default App;
