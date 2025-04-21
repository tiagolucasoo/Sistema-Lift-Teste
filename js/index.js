/* Script Principal:

Requisitos: Exibir Dados do Pedido, do Cliente e do valor e encaminhar para o pedido
            Funções: Cálculo de valor [base.js]
                     Acessar Pedido [Encaminhar para info_pedido ao clicar]

*/

// Função Principal - Para exibição dos valores get e conversões de strings,etc...
async function DadosPedidos() {
    const pedidos = await getPedidos();
    const clientes = await getClientes();
    const itens = await getItens();
    const produtos = await getProdutos();
    const tabela = document.getElementById("tabela");

    pedidos.forEach(pedido => {
        const cliente = clientes.find(c => c.id === pedido.cliente);
        const tr_pedido = document.createElement("tr");

        const td_link = document.createElement("td");
        const link = document.createElement("a");

        link.href = `info_pedido.html?id=${pedido.id}`;
        link.textContent = pedido.id;
        link.style.textDecoration = "none";
        td_link.appendChild(link);

        const valorTotal = ValorTotalPedido(pedido.id, itens, produtos);

        tr_pedido.appendChild(td_link);
        tr_pedido.appendChild(linha_Html(cliente ? cliente.nome : "Cliente não encontrado"));
        tr_pedido.appendChild(linha_Html(formatarData(pedido.data)));
        tr_pedido.appendChild(linha_Html(valorTotal));

        tabela.appendChild(tr_pedido);
    });
}
async function DadosInfo_Pedidos() {
    const urlParams = new URLSearchParams(window.location.search);
    const pedidoId = urlParams.get('id'); // ID vindo da URL

    const pedidos = await getPedidos();
    const clientes = await getClientes();
    const itens = await getItens();
    const produtos = await getProdutos();

    const tabelaCliente = document.getElementById("tabela_cliente");
    const tabelaPedido = document.getElementById("tabela_pedido");

    // Encontrar o pedido com base no ID
    const pedido = pedidos.find(p => p.id == pedidoId);
    if (!pedido) {
        alert("Pedido não encontrado, clique em OK para retornar a tela inicial de consulta.");
        window.location.href = "index.html";
        return;
    }
    const cliente = clientes.find(c => c.id === pedido.cliente);
    if (!cliente) {
        alert("Cliente não encontrado, clique em OK para retornar a tela inicial de consulta.");
        window.location.href = "index.html"
        return;
    }

    const tr_cliente = document.createElement("tr");
    tr_cliente.appendChild(linha_Html(cliente.nome));
    tr_cliente.appendChild(linha_Html(cliente.cpf));
    tr_cliente.appendChild(linha_Html(formatarData(pedido.data)));
    tr_cliente.appendChild(linha_Html(cliente.email));
    tabelaCliente.appendChild(tr_cliente);

    const itensPedido = itens.filter(item => item.pedido === pedido.id);

    itensPedido.forEach(item => {
    const produto = produtos.find(p => p.id === item.produto);

    const tr_item = document.createElement("tr");

    tr_item.appendChild(linha_Html(produto ? produto.id : "N/A"));
    tr_item.appendChild(linha_Html(produto ? produto.nome : "Produto não encontrado"));
    tr_item.appendChild(linha_Html(item.quantidade));

    const valorUnitario = produto ? formatarMoeda(produto.valor) : "N/A";
    tr_item.appendChild(linha_Html(valorUnitario));
    
    tabelaPedido.appendChild(tr_item);
    });

    const valorTotal = ValorTotalPedido(pedido.id, itens, produtos);
    const tr_total = document.createElement("tr");
    tr_total.appendChild(linha_Html(""));
    tr_total.appendChild(linha_Html("Valor Total:"));
    tr_total.appendChild(linha_Html(valorTotal));
    tabelaPedido.appendChild(tr_total);
}