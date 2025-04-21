// 1) Get: Aqui estou retornando os dados da API diretamente as funções Get através da requisião fetch
async function getClientes() { // Clientes
    const url = "https://sistemalift1.com.br/lift_ps/api/Clientes";
    const response = await fetch(url);
    return await response.json();
}
async function getPedidos() { // Pedidos
    const url = "https://sistemalift1.com.br/lift_ps/api/Pedidos";
    const response = await fetch(url);
    return await response.json();
}
async function getProdutos() { // Produtos
    const url = "https://sistemalift1.com.br/lift_ps/api/Produtos";
    const response = await fetch(url);
    return await response.json();
}
async function getItens() { // Itens
    const url = "https://sistemalift1.com.br/lift_ps/api/Itenspedido";
    const response = await fetch(url);
    return await response.json();
}

// 2) Funções Extras para reaproveitamento e buscando aplicar o padrão solid
function linha_Html(ref) { // Função própria para criação das linhas/célular do html
    const td = document.createElement("td");
    td.innerHTML = ref ?? "N/A";
    return td;
}
function formatarMoeda(valor) { //Formatar valor para R$
    return Number(valor).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}
function formatarData(data){ //formatar data para padrão xx/xx/xxxx (Estava xx-xx-xxxx)
    return data.replace(/-/g, "/");
}
function ValorTotalPedido(pedidoId, itens, produtos) { // Cálculo dos valores
    let total = 0;

    const itensDoPedido = itens.filter(item => item.pedido === pedidoId);

    itensDoPedido.forEach(item => {
        const produto = produtos.find(p => p.id === item.produto);
        if (produto) {
            total += item.quantidade * produto.valor;
        }
    });

    return formatarMoeda(total);
}

// 3) Função Principal - Atribui a Get a exibição das informações - Chamada feita separada em cada arquivo html
async function DadosClientes() { // Clientes
    const clientes = await getClientes(); // Recebe os dados da Get
    const tabela = document.getElementById("tabela"); // Insere na ID Tabela no HTML

    clientes.forEach(cliente => {
        const tr_cliente = document.createElement("tr"); // Linha para cada cliente

        tr_cliente.appendChild(linha_Html(cliente.id));
        tr_cliente.appendChild(linha_Html(cliente.nome));
        tr_cliente.appendChild(linha_Html(cliente.cpf));
        tr_cliente.appendChild(linha_Html(cliente.email));

        tabela.appendChild(tr_cliente);
    });
}
async function DadosProdutos() { // Produtos
    const produtos = await getProdutos(); // Recebe os dados da Get
    const tabela = document.getElementById("tabela"); // Insere na ID Tabela no HTML

    produtos.forEach(produto => {
        const tr_produto = document.createElement("tr"); // Linha para cada cliente

        tr_produto.appendChild(linha_Html(produto.id));
        tr_produto.appendChild(linha_Html(produto.nome));
        tr_produto.appendChild(linha_Html(formatarMoeda(produto.valor)));

        tabela.appendChild(tr_produto);
    });
}
async function DadosPedidos() { // Pedidos
    const pedidos = await getPedidos(); // Recebe os dados da Get
    const tabela = document.getElementById("tabela"); // Insere na ID Tabela no HTML

    pedidos.forEach(pedido => {
        const tr_pedido = document.createElement("tr"); // Linha para cada cliente

        tr_pedido.appendChild(linha_Html(pedido.id));
        tr_pedido.appendChild(linha_Html(pedido.cliente));
        tr_pedido.appendChild(linha_Html(formatarData(pedido.data)));

        tabela.appendChild(tr_pedido);
    });
}

// 4) Funções para navegar entre os pedidos e exibir as infos
function MostrarNumeroPedido() { // Exibe o Número do pedido no h2
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");

    const titulo = document.getElementById("numero_pedido");
    if (id && titulo) {
        titulo.textContent = `Pedido nº ${id}`;
    }
}
function getPedidoIdAtual() { // Guarda o valor da página atual
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get("id"));
}
function index() { // Index
    window.location.href = "index.html";
}
function voltarPagina() { // Botão
    const idAtual = getPedidoIdAtual();
    if (idAtual > 1) {
        window.location.href = `info_pedido.html?id=${idAtual - 1}`;
    } else {
        alert("Você já está no primeiro pedido.");
    }
}
function avancarPagina() { // Botão
    const idAtual = getPedidoIdAtual();
    window.location.href = `info_pedido.html?id=${idAtual + 1}`;
}