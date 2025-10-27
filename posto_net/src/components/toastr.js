/* global toastr */ // Adicionar no topo

export function mostrarMensagem(titulo, mensagem, tipo){
    toastr[tipo](mensagem, titulo);
}

export function mensagemErro(mensagem){
    mostrarMensagem('Erro', mensagem, 'error');
}

export function mensagemSucesso(mensagem){
    mostrarMensagem('Sucesso', mensagem, 'success');
}