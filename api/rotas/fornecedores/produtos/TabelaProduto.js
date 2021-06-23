const Modelo = require('./ModeloTabelaProduto')

module.exports = {
    //criando o DAO
    listar (idFornecedor) {
        return Modelo.findAll({
            where: {
                fornecedor: idFornecedor
            }
        })
    }
}