const roteador = require('express').Router()
const TabelaFornecedor = require('./TabelaFornecedor')
const Fornecedor = require('./Fornecedor')
const SerializadorFornecedor = require('../../Serializador').SerializadorFornecedor

roteador.options('/', (requisicao, resposta) => {
    resposta.set('Access-Control-Allow-Methods', 'GET, POST')
    resposta.set('Access-Control-Allow-Headers', 'Content-Type')
    resposta.status(204)
    resposta.end()
})

//rotas para as informações '/' => listagem
roteador.get('/', async (requisicao, resposta) => {
    const resultados = await TabelaFornecedor.listar()
    resposta.status(200)
    const serializador = new SerializadorFornecedor(
        resposta.getHeader('Content-Type'),
        ('empresa')
    )
    resposta.send(
        serializador.serializar(resultados)
    )
})

roteador.post('/', async (requisicao, resposta, proximo) => {
    try {
        const dadosRecebidos = requisicao.body
        const fornecedor = new Fornecedor(dadosRecebidos)
        await fornecedor.criar()
        resposta.status(201)
        const serializador = new SerializadorFornecedor(
            resposta.getHeader('Content-Type'),
            ['empresa']
        )
        resposta.send(
            serializador.serializar(fornecedor)
        )
    } catch(erro){
        proximo(erro)
    }
})

roteador.options('/:idFornecedor', (requisicao, resposta) => {
    resposta.set('Access-Control-Allow-Methods', 'GET, PUT, DELETE')
    resposta.set('Access-Control-Allow-Headers', 'Content-Type')
    resposta.status(204)
    resposta.end()
})

// definimos o parametro da nossa rota - url
roteador.get('/:idFornecedor', async (requisicao, resposta, proximo) => {
    // tratando o erro que esta sendo emitido
    try{
        const id = requisicao.params.idFornecedor
        const fornecedor = new Fornecedor({ id: id})
        await fornecedor.carregar()
        resposta.status(200)
        const serializador = new SerializadorFornecedor(
            resposta.getHeader('Content-Type'),
            ['empresa','email','dataCriacao','dataAtualizacao','versao']
        )
        resposta.send(
            serializador.serializar(fornecedor)
        )
    } catch(erro){
        proximo(erro)
    }
})

roteador.put('/:idFornecedor', async (requisicao, resposta, proximo) => {
    try {
        const id = requisicao.params.idFornecedor
        const dadosRecebidos = requisicao.body
        // assign => funcao javascript para juntar varios objetos em 1 so
        const dados = Object.assign({}, dadosRecebidos, { id: id })
        const fornecedor = new Fornecedor(dados) 
        await fornecedor.atualizar()
        resposta.status(204)
        resposta.end()
    } catch(erro) {
        proximo(erro)

    }
})

// declarar a rota delete - um servidor por definicao
roteador.delete('/:idFornecedor', async (requisicao, resposta, proximo) => {
    try {
        const id = requisicao.params.idFornecedor
        const fornecedor = new Fornecedor({id: id})
        await fornecedor.carregar()
        await fornecedor.remover()
        resposta.status(204)
        resposta.end()
    } catch (erro) {
        proximo(erro)
    }
})

// aqui integramos produtos/index.js aos fornecedores
const roteadorProdutos = require('./produtos')

//middleware para verificar as nossas rotas de fornecedores
const verificarFornecedor = async (requisicao, resposta, proximo) => {
    try {
        const id = requisicao.params.idFornecedor
        const fornecedor = new Fornecedor({ id: id})
        await fornecedor.carregar()
        requisicao.fornecedor = fornecedor //pratica do express comum - vai estar disponivel em todas as rotas
        proximo()
    } catch (erro) {
        proximo(erro)
    }
}

roteador.use('/:idFornecedor/produtos', verificarFornecedor, roteadorProdutos)

module.exports = roteador