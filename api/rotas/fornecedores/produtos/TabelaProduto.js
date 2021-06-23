const Modelo = require('./ModeloTabelaProduto')
const instancia = require('../../../banco-de-dados')

module.exports = {
    //criando o DAO
    listar (idFornecedor) {
        return Modelo.findAll({
            where: {
                fornecedor: idFornecedor
            },
            raw: true //sequelize retorna os valores em js puro
        })
    },
    inserir (dados) {
        return Modelo.create(dados)
    },
    remover (idProduto, idFornecedor) {
        return Modelo.destroy({
            where: {
                id: idProduto,
                fornecedor: idFornecedor
            }
        })
    },
    async pegarPorId (idProduto, idFornecedor) {
        const encontrado = await Modelo.findOne({
            where: {
                id: idProduto,
                fornecedor: idFornecedor
            },
            raw: true //vai voltar o objeto como objeto puro em JS
        })
        // if como parametro para encontrar o produto
        if (!encontrado) {
            throw new Error('Produto não foi encontrado!')
        }

        return encontrado
    },
    atualizar (dadosDoProduto, dadosParaAtualizar) {
        return Modelo.update(
            dadosParaAtualizar,
            {
                where: dadosDoProduto
            }
        )
    },
    subtrair (idProduto, idFornecedor, campo, quantidade) {
        return instancia.transaction(async transacao => {
            const produto = await Modelo.findOne({
                where: {
                    id: idProduto,
                    fornecedor: idFornecedor
                }
            })
            produto[campo] = quantidade

            await produto.save()

            return produto
        })
    }
}