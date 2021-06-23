// criar tabelas - tirando as info
const modelos = [
    require('../rotas/fornecedores/ModeloTabelaFornecedor'),
    require('../rotas/fornecedores/produtos/ModeloTabelaProduto')
]

async function criarTabelas() {
    // estabelecendo um for para a criação de tabelas
    for (let contador = 0; contador < modelos.length; contador++) {
        const modelo = modelos[contador]
        await modelo.sync()
    }
}

criarTabelas()