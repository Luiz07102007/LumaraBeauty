const db = require("./db");

const Cliente = db.sequelize.define(
  "Cliente",
  {
    nome: { type: db.Sequelize.STRING },
    email: { type: db.Sequelize.STRING, unique: true },
    senha: { type: db.Sequelize.STRING },
  },
  {
    freezeTableName: true,
  }
);

module.exports = Cliente;
