const db = require("./db");

const Funcionario = db.sequelize.define(
  "Funcionario",
  {
    nome: { type: db.Sequelize.STRING },
    telefone: { type: db.Sequelize.STRING },
    especializacao: { type: db.Sequelize.STRING },
    imagem: { type: db.Sequelize.STRING },
  },
  {
    freezeTableName: true,
  }
);

module.exports = Funcionario;
