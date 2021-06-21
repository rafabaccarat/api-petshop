const Modelo = require('./ModeloTabelaFornecedor')

module.exports = {
    listar () {
        return Modelo.findAll()
    },
    inserir(fornecedor){
        return Modelo.create(fornecedor)
    },
    async pegarPorId(id){
        const encontrado = await Modelo.findOne({ //buscar encontrar um
            where: {
                id: id
            }
        }) 

        if(!encontrado){ //caso não exista, estiver vazia
            throw new Error('Fornecedor não encontrado')
        }

        return encontrado //retornar o que foi encontrado
    },

    atualizar(id, dadosParaAtualizar){
        return Modelo.update(
            dadosParaAtualizar,
            { 
                where: { id: id}
            }
        )
    },
    remover (id) {
        return Modelo.destroy({
            where: {id, id}
        })
    }
}