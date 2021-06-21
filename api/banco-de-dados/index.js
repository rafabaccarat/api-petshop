const Sequelize = require('sequelize')
const config = require('config') //chamando os dados do config default

const instancia = new Sequelize( // pegando os dados do mysql - default
    config.get('mysql.banco-de-dados'),
    config.get('mysql.usuario'),
    config.get('mysql.senha'),
    {
        host: config.get('mysql.host'),
        dialect: 'mysql'
    }
)

module.exports = instancia