
CREATE DATABASE salaobeleza;
USE salaobeleza;

-- Tabela Cliente
CREATE TABLE Cliente (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(100) NOT NULL,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL
);

-- Tabela Funcionario
CREATE TABLE Funcionario (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    telefone VARCHAR(20),
    especializacao VARCHAR(100),
    imagem VARCHAR(255), -- Já adiciona o campo de imagem aqui
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL
);

-- Tabela Servico
CREATE TABLE Servico (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10, 2) NOT NULL,
    icone VARCHAR(255), -- Já adiciona o campo de ícone aqui
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL
);

-- Tabela Agendamento
CREATE TABLE Agendamento (
    id INT PRIMARY KEY AUTO_INCREMENT,
    data DATE NOT NULL,
    horario TIME NOT NULL,
    ServicoId INT NOT NULL,
    ClienteId INT NOT NULL,
    FuncionarioId INT NOT NULL,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    FOREIGN KEY (ServicoId) REFERENCES Servico(id),
    FOREIGN KEY (ClienteId) REFERENCES Cliente(id),
    FOREIGN KEY (FuncionarioId) REFERENCES Funcionario(id)
);

-- Dados de Servicos (com ícones)
INSERT INTO Servico (nome, descricao, preco, icone, createdAt, updatedAt) VALUES
('Corte Feminino', 'Corte de cabelo feminino com escova finalizadora.', 80.00, '/icons/corte-feminino.png', NOW(), NOW()),
('Hidratação Capilar', 'Tratamento de nutrição intensa com óleo de argan.', 120.00, '/icons/hidratacao.png', NOW(), NOW()),
('Coloração', 'Coloração profissional para cabelos.', 100.00, '/icons/coloracao.png', NOW(), NOW()),
('Escova', 'Fios alinhados, volumosos e com movimento natural.', 40.00, '/icons/escova.png', NOW(), NOW()),
('Corte Masculino', 'Corte de cabelo masculino.', 50.00, '/icons/corte-masculino.png', NOW(), NOW()),
('Mechas e Luzes', 'Clareie os fios de forma parcial e crie um efeito iluminado e natural.', 120.00, '/icons/mechas.png', NOW(), NOW());

-- Dados de Funcionarios (com imagens)
INSERT INTO Funcionario (nome, telefone, especializacao, imagem, createdAt, updatedAt) VALUES
('Mariana Silva', '(11) 91111-1111', 'Especialista em corte feminino e finalização', '/img/funcionarios/mariana.png', NOW(), NOW()),
('Carlos Oliveira', '(11) 92222-2222', 'Especialista em hidratação e tratamentos capilares', '/img/funcionarios/carlos.png', NOW(), NOW()),
('Fernanda Costa', '(11) 93333-3333', 'Especialista em coloração profissional', '/img/funcionarios/fernanda.png', NOW(), NOW()),
('Juliana Rocha', '(11) 94444-4444', 'Especialista em escova e finalização', '/img/funcionarios/juliana.png', NOW(), NOW()),
('Pedro Almeida', '(11) 95555-5555', 'Especialista em corte masculino e barbeiro', '/img/funcionarios/pedro.png', NOW(), NOW()),
('Camila Souza', '(11) 96666-6666', 'Especialista em mechas, luzes e clareamento', '/img/funcionarios/camila.png', NOW(), NOW());
