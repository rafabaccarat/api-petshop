const roteador = require('express').Router()
const TabelaFornecedor = require('./TabelaFornecedor')
const Fornecedor = require('./Fornecedor')

//rotas para as informações '/' => listagem
roteador.get('/', async (requisicao, resposta) => {
    const resultados = await TabelaFornecedor.listar()
    resposta.status(200)
    resposta.send(
        JSON.stringify(resultados)
    )
})

roteador.post('/', async (requisicao, resposta) => {
    try {
        const dadosRecebidos = requisicao.body
        const fornecedor = new Fornecedor(dadosRecebidos)
        await fornecedor.criar()
        resposta.status(201)
        resposta.send(
            JSON.stringify(fornecedor)
        )
    } catch(erro) {
        resposta.status(400)
        resposta.send(
            JSON.stringify({
                mensagem: erro.message
            })
        )
    } 
})

// definimos o parametro da nossa rota - url
roteador.get('/:idFornecedor', async (requisicao, resposta) => {
    // tratando o erro que esta sendo emitido
    try{
        const id = requisicao.params.idFornecedor
        const fornecedor = new Fornecedor({ id: id})
        await fornecedor.carregar()
        resposta.status(200)
        resposta.send(
            JSON.stringify(fornecedor)
        )
    } catch(erro){
        resposta.status(404)
        resposta.send(
            JSON.stringify ({
                mensagem: erro.message
            })
        )
    }
})

roteador.put('/:idFornecedor', async (requisicao, resposta) => {
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
        resposta;status(400)
        resposta.send(
            JSON.stringify ({
                mensagem: erro.message
            })
        )
    }
})

// declarar a rota delete - um servidor por definicao
roteador.delete('/:idFornecedor', async (requisicao, resposta) => {
    try {
        const id = requisicao.params.idFornecedor
        const fornecedor = new Fornecedor({id: id})
        await fornecedor.carregar()
        await fornecedor.remover()
        resposta.status(204)
        resposta.end()
    } catch (erro) {
        resposta.status(404)
        resposta.send(
            JSON.stringify ({
                mensagem: erro.message
            })
        )
    }
})

module.exports = roteador