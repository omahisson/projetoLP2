import React from 'react';

import Card from '../components/card';

import { mensagemSucesso, mensagemErro } from '../components/toastr';

import { useNavigate } from 'react-router-dom';

import Stack from '@mui/material/Stack'; //um do lado do outro
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import axios from 'axios';
import { BASE_URL } from '../config/axios';

const baseURL = `${BASE_URL}/administradores`;

function ListagemAdministradores() {
    const navigate = useNavigate();

    const cadastrar = () => {
        navigate('/cadastro-administradores');
    };

    const editar = (id) => {
        navigate(`/cadastro-administradores/${id}`);
    };

    const [dados, setDados] = React.useState([]);

    async function excluir(id) {
        let data = JSON.stringify({ id });
        let url = `${baseURL}/${id}`;
        console.log(url);
        await axios
            .delete(url, data, { headers: { 'Content-Type': 'application/json' } })
            .then(function (response) {
                mensagemSucesso('Administrador excluido com sucesso');
                setDados(dados.filter((dado) => { return dado.id !== id }));
            })
            .catch(function (error) {
                mensagemErro('Erro ao excluir administrador');
                console.log(error);
            });
    }

    React.useEffect(() => {
        axios.get(baseURL)
            .then(function (response) {
                setDados(response.data);
            });
    }, []);

    if(!dados) return null;

    return(
        <div className='container'>
            <Card title='Listagem de Administradores'>
                <div className='row'>
                    <div className='col-md-12'>
                        <div className='bs-component'>
                            <button type='button' className='btn btn-warning' onClick={() => cadastrar()}>Novo Administrador</button>
                            <table className='table table-hover'>
                                <thead>
                                    <tr>
                                        <th scope='col'>Nome</th>
                                        <th scope='col'>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dados.map((dado)=>(
                                        <tr key={dado.id}>
                                            <td>{dado.nome}</td>
                                            <td>
                                                <Stack spacing={1} padding={0} direction='row'>
                                                    <IconButton aria-label='editar' onClick={() => editar(dado.id)}>
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton aria-label='excluir' onClick={() => excluir(dado.id)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Stack>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}

export default ListagemAdministradores;