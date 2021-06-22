const ValorNaoSuportado = require('./erros/ValorNaoSuportado')
const jsontoxml = require('jsontoxml')

class Serializador {
    json(dados){
        // formato json
        return JSON.stringify(dados)
    }

    xml(dados) {
        let tag = this.tagSingular //estabelecer no singular

        if(Array.isArray(dados)){
            tag = this.tagPlural //estabelecer no plural
            dados = dados.map((item) => {
                return {
                    [this.tagSingular]: item // metodo para separar para cada fornecedor
                }
            })
        }
        return jsontoxml({ [tag]: dados}) //vai receber de acordo com o que for definido
    }

    serializar(dados) {
        dados = this.filtrar(dados)
        // verificar o tipo de conteudo, se é do formato json
        if(this.contentType == 'application/json') {
            return this.json(dados)
        } 

        if(this.contentType == 'application/xml') {
            return this.xml(dados)
        }
        
        throw new ValorNaoSuportado(this.contentType)
    }

    filtrarObjeto (dados) {
        const novoObjeto = {}

        this.camposPublicos.forEach((campo) => {
            if (dados.hasOwnProperty(campo)) {
                novoObjeto[campo] = dados[campo]
            }
        })
        return novoObjeto
    }

    filtrar (dados) {
        if (Array.isArray(dados)) {
            //metodo javascript
            dados = dados.map(item => {
                return this.filtrarObjeto(item)
            })
        } else {
            dados = this.filtrarObjeto(dados)
        }
        return dados
    }
}

class SerializadorFornecedor extends Serializador {
    constructor(contentType, camposExtras) {
        super()
        this.contentType = contentType
        this.camposPublicos = [
            'id',
            'empresa',
            'categoria'
        ].concat(camposExtras || [])
        this.tagSingular = 'fornecedor'
        this.tagPlural = 'fornecedores'
    }
}

class SerializadorErro extends Serializador {
    constructor(contentType, camposExtras) {
        super()
        this.contentType = contentType
        this.camposPublicos = [
            'id',
            'mensagem'
        ].concat(camposExtras || [])
        this.tagSingular = 'erro'
        this.tagPlural = 'erros'
    }
}

module.exports = {
    Serializador: Serializador,
    SerializadorFornecedor: SerializadorFornecedor,
    SerializadorErro: SerializadorErro,
    formatosAceitos: ['application/json', 'application/xml']
}