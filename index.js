const express = require("express");
const app = express();
const session = require("express-session");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const path = require("path");

// imports para arrumar o erro LIXO do Handlebars
const exphbs = require("express-handlebars");
const Handlebars = require("handlebars");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");

// Models
const Cliente = require("./models/Cliente");
const Funcionario = require("./models/Funcionario");
const Servico = require("./models/Servico");
const Agendamento = require("./models/Agendamento");

// Sessão
app.use(
  session({
    secret: "salãosecreto",
    resave: false,
    saveUninitialized: true,
  })
);

// Static
app.use(express.static("public"));

//  Liberando o handlebars que tava me travando Agrkagkagka
app.engine(
  "handlebars",
  exphbs.engine({
    defaultLayout: "main",
    handlebars: allowInsecurePrototypeAccess(Handlebars),
  })
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Middleware de sessão para todas as views
app.use((req, res, next) => {
  res.locals.usuario = req.session.cliente;
  next();
});

//  Middleware de autenticação
function logado(req, res, next) {
  if (req.session.cliente) {
    next();
  } else {
    res.redirect("/login");
  }
}

// Rotas

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const cliente = await Cliente.findOne({ where: { email: req.body.email } });
  if (cliente) {
    const match = await bcrypt.compare(req.body.senha, cliente.senha);
    if (match) {
      req.session.cliente = cliente;
      res.redirect("/");
    } else {
      res.send("Senha incorreta!<p><a href=/login>Voltar</a></p>");
    }
  } else {
    res.send('Usuário não encontrado!<p><a href="/cadastro">Cadastrar</a>');
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

app.get("/cadastro", (req, res) => {
  res.render("cadastro");
});

app.post("/cadastro", async (req, res) => {
  const hash = await bcrypt.hash(req.body.senha, 10);
  try {
    await Cliente.create({
      nome: req.body.nome,
      email: req.body.email,
      senha: hash,
    });
    res.redirect("/login");
  } catch (err) {
    res.send("Erro no registro: " + err);
  }
});

app.get("/servicos", async (req, res) => {
  try {
    const servicos = await Servico.findAll();
    res.render("servicos", { servicos });
  } catch (err) {
    res.send("Erro ao carregar serviços: " + err);
  }
});

app.get("/funcionarios", async (req, res) => {
  try {
    const funcionarios = await Funcionario.findAll();
    res.render("funcionarios", { funcionarios });
  } catch (err) {
    res.send("Erro ao carregar funcionários: " + err);
  }
});

app.get("/agendamento", logado, async (req, res) => {
  const servicos = await Servico.findAll();
  const funcionarios = await Funcionario.findAll();
  res.render("agendamento", { servicos, funcionarios });
});

app.post("/agendamento", logado, async (req, res) => {
  try {
    await Agendamento.create({
      data: req.body.data,
      horario: req.body.horario,
      ServicoId: req.body.servico,
      FuncionarioId: req.body.funcionario,
      ClienteId: req.session.cliente.id,
    });
    res.send(
      'Agendamento realizado com sucesso!<p><a href="/agendamento">Voltar</a>'
    );
  } catch (err) {
    res.send('Erro ao agendar:<p><a href="/agendamento">Voltar</a>' + err);
  }
});
app.get("/meus-agendamentos", logado, async (req, res) => {
  try {
    const agendamentos = await Agendamento.findAll({
      where: { ClienteId: req.session.cliente.id },
      include: [Servico, Funcionario],
      order: [["data", "ASC"]],
    });
    res.render("meusAgendamentos", { agendamentos });
  } catch (err) {
    res.send("Erro ao carregar agendamentos: " + err);
  }
});

// Cancelar agendamento
app.post("/cancelar-agendamento/:id", logado, async (req, res) => {
  try {
    await Agendamento.destroy({
      where: {
        id: req.params.id,
        ClienteId: req.session.cliente.id,
      },
    });
    res.redirect("/meus-agendamentos");
  } catch (err) {
    res.send("Erro ao cancelar: " + err);
  }
});
// tela do esquecido
app.get("/esqueci", (req, res) => {
  res.render("esqueci");
});

// pega o e-mail do caba
app.post("/esqueci", async (req, res) => {
  const cliente = await Cliente.findOne({ where: { email: req.body.email } });

  if (!cliente) {
    return res.send("E-mail não encontrado.<p><a href=/esqueci>Voltar</a></p>");
  }

  // Id pra saber quem foi o caba que perdeu a senha
  res.redirect("/redefinir/" + cliente.id);
});

// Mostrar tela de nova senha
app.get("/redefinir/:id", async (req, res) => {
  const cliente = await Cliente.findByPk(req.params.id);
  if (!cliente) {
    return res.send("Usuário não encontrado.<p><a href=/esqueci>Voltar</a></p>");
  }
  res.render("redefinirSenha", { cliente });
});

// Atualizar a senha
app.post("/redefinir/:id", async (req, res) => {
  const cliente = await Cliente.findByPk(req.params.id);
  if (!cliente) {
    return res.send("Usuário não encontrado.<p><a href=/esqueci>Voltar</a></p>");
  }

  const novaHash = await bcrypt.hash(req.body.novaSenha, 10);
  cliente.senha = novaHash;
  await cliente.save();

  res.send('Senha atualizada com sucesso. <a href="/login">Ir para login</a>');
});
app.listen(8081, () => {
  console.log("Servidor rodando em http://localhost:8081");
});
