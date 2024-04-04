function salvarToken(token){
    // Aqui salvo o usuario na Store
    localStorage.setItem('token', token)
}

function obterToken(token){
    // Obtenho o token da store
   return localStorage.getItem("token");
}

function salvarUsuario(usuario){
   return localStorage.setItem('usuario', JSON.stringify(usuario));
}

function obterUsuario(usuario){
    let usuarioStore = localStorage.getItem("usuario");
    return JSON.parse(usuarioStore);
}

function sairDoSistema(){
    localStorage.removeItem('token'); 
    localStorage.removeItem('usuario');
    window.open('login.html', '_self');
}