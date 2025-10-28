import React from 'react'; //importo em toda pagina
import './bootstrap.min.css'; //estilo css
import 'toastr/build/toastr.min';
import 'toastr/build/toastr.css';
import Navbar from './components/navbar.js';
import Rotas from './rotas.js';

//react ou eh classe ou funcao
// q retorna uma coisa, entao uso objeto para devolver mais

class App extends React.Component{
  render(){
    return(
      <div className='d-flex'>
        <Navbar />
        <div className='conteudo-principal'>
          <div className='container'>
            <Rotas />
          </div>
        </div>
      </div>
    )
  }
}

export default App;