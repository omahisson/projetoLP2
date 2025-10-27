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
      <div className='container'>
        <Rotas />
        <Navbar />
      </div>
    )
  }
}

export default App;