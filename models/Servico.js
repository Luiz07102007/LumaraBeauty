const db = require("./db");

const Servico = db.sequelize.define(
  "Servico",
  {
    nome: { type: db.Sequelize.STRING },
    descricao: { type: db.Sequelize.TEXT },
    preco: { type: db.Sequelize.DECIMAL(10, 2) },
    icone: { type: db.Sequelize.STRING }, 
  },
  {
    freezeTableName: true,
  }
);

module.exports = Servico;
