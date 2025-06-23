const db = require("./db");

const Agendamento = db.sequelize.define(
  "Agendamento",
  {
    data: { type: db.Sequelize.DATEONLY },
    horario: { type: db.Sequelize.TIME },
  },
  {
    freezeTableName: true,
  }
);
// Relacionamentos
const Cliente = require("./Cliente");
const Funcionario = require("./Funcionario");
const Servico = require("./Servico");

Agendamento.belongsTo(Servico);
Agendamento.belongsTo(Cliente);
Agendamento.belongsTo(Funcionario);

module.exports = Agendamento;
