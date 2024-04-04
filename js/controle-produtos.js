const URL = 'http://localhost:3400/produtos';

let listaprodutos = [];
let btnAdicionar = document.querySelector('#btn-adicionar');
let tabelaproduto = document.querySelector('table>tbody');
let modalproduto = new bootstrap.Modal(document.getElementById('modal-produto'));
let btnSalvar = document.querySelector("#btn-salvar");
console.log(btnSalvar); 
btnSalvar.addEventListener('click', () => {});


let formModal = {
    id: document.querySelector("#id"),
    nome: document.querySelector("#nome"),
    valor: document.querySelector("#valor"),
    quantidadeestoque: document.querySelector("#quantidadeestoque"),
    datacadastro: document.querySelector("#datacadastro"),
};

btnAdicionar.addEventListener('click', () =>{
    limparmodalprodutos();
    modalproduto.show();
});

function obterproduto() {
    fetch(URL, {
        method: 'GET',
        headers: {
            'authorization' : obterToken()
        }
    })
    .then(Response => Response.json()) 
    .then(produtos =>{
        listaprodutos = produtos;
        populartabela(produtos);
    })
    .catch((erro) => {});
}
obterproduto();

function populartabela(produtos){
    tabelaproduto.textContent = '';
    produtos.forEach(element => {
        criarlinhanatabela(element); 
    });
}

function criarlinhanatabela(produto){
    let tr = document.createElement('tr');
    let  tdId = document.createElement('td');
    let  tdNome = document.createElement('td');
    let  tdquantidadeestoque = document.createElement('td');
    let  tdvalor = document.createElement('td');
    let  tdDataCadastro = document.createElement('td');
    let  tdAcoes = document.createElement('td');

    tdId.textContent = produto.id;
    tdNome.textContent = produto.nome;
    tdquantidadeestoque.textContent = produto.quantidadeestoque;
    tdvalor.textContent = produto.valor;
    tdDataCadastro.textContent = new Date(produto.dataCadastro).toLocaleDateString();
    tdAcoes.innerHTML = `<button onclick="editarProduto(${produto.id})" class="btn btn-outline-primary btn-sm mr-3">Editar</button>
                         <button onclick="excluirProduto(${produto.id})" class="btn btn-outline-primary btn-sm mr-3">Excluir</button>`;

    tr.appendChild(tdId);
    tr.appendChild(tdNome);
    tr.appendChild(tdvalor);
    tr.appendChild(tdquantidadeestoque);  
    tr.appendChild(tdDataCadastro);  
    tr.appendChild(tdAcoes);                      
    tabelaproduto.appendChild(tr);
}

document.getElementById("btn-salvar").addEventListener('click', () => {
    let produto = obterprodutodomodal();
    if (!produto.validar()) {
        alert("Todos os campos devem ser preenchidos.");
        return;
    }
    adicionarprodutonobackend(produto);
});

function obterprodutodomodal() {
    return {
        id: formModal.id.value,
        nome: formModal.nome.value,
        valor: formModal.valor.value,
        quantidadeestoque: formModal.quantidadeestoque.value,
        datacadastro: formModal.datacadastro.value
            ? new Date(formModal.datacadastro.value).toISOString()
            : new Date().toISOString()
    };
}

function adicionarprodutonobackend(produto){
    fetch(URL,{
        method: 'POST',
        headers: {
            authorization: obterToken(),
            'content-type': 'application/json'
        },
        body: JSON.stringify(produto)
    })
    .then(Response => Response.json())
    .then(Response => {
        listaprodutos.push(Response);
        populartabela(listaprodutos);
        modalproduto.hide();
        alert(`O produto ${produto.nome} foi cadastrado com sucesso!`);
    });
}

function limparmodalprodutos() {
    formModal.id.value = '';
    formModal.nome.value = '';
    formModal.valor.value = '';
    formModal.quantidadeestoque.value = '';
    formModal.datacadastro.value = '';
}

function excluirProduto(id){
    if(confirm("Deseja realmente excluir o produto?")){
        fetch(`${URL}/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: obterToken()
            }
        })
        .then(() => {
            listaprodutos = listaprodutos.filter(produto => produto.id !== id);
            populartabela(listaprodutos);
        });
    }
}


function excluirprodutonobackend(id){
    fetch(`${URL}/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: obterToken()
        }
    })
    .then(() => {
        removeprodutodalista(id);
        populartabela(listaprodutos);
    });
}

function removeprodutodalista(id){
    let indice = listaprodutos.findIndex(produto => produto.id == id);
    listaprodutos.splice(indice, 1);
}
