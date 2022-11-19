
CREATE TABLE usuario (
idUsuario int AUTO_INCREMENT PRIMARY KEY ,
email varchar(100) NOT NULL,
senha varchar(255) NOT NULL,
isEmailVerificado boolean NOT NULL,
codigoVerificacao varchar(255),
CONSTRAINT UC_USUARIO_EMAIL UNIQUE (email)
);

CREATE TABLE administrador (
idAdministrador int AUTO_INCREMENT PRIMARY KEY,
idUsuario int NOT NULL,
nome varchar(30) NOT NULL,
telefone varchar(15) NOT NULL,
dataNasc DATETIME NOT NULL,
urlImagem varchar(500),
FOREIGN KEY (idUsuario) REFERENCES usuario(idUsuario) ON DELETE CASCADE
);


CREATE TABLE consumidor (
idConsumidor int AUTO_INCREMENT PRIMARY KEY,
idUsuario int NOT NULL,
cpf varchar(11) NOT NULL,
genero char(1) NOT NULL,
dataNasc DATETIME NOT NULL,
nome varchar(30) NOT NULL,
telefone varchar(15) NOT NULL,
cep varchar(8) NOT NULL,
numero int NOT NULL,
endereco varchar(50) NOT NULL,
bairro varchar(30) NOT NULL,
cidade varchar(50) NOT NULL,
uf varchar(2) NOT NULL,
urlImagem varchar(500),
FOREIGN KEY (idUsuario) REFERENCES usuario(idUsuario) ON DELETE CASCADE
);

CREATE TABLE bandeira (
idBandeira int AUTO_INCREMENT PRIMARY KEY,
nome varchar(30) NOT NULL
);

CREATE TABLE estabelecimento (
idEstabelecimento int AUTO_INCREMENT PRIMARY KEY,
idUsuario int NOT NULL,
idBandeira int,
endereco varchar(50) NOT NULL,
bairro varchar(30) NOT NULL,
cidade varchar(50) NOT NULL,
cep varchar(8) NOT NULL,
nota float(12),
latitude varchar(15),
longitude varchar(15),
urlImagem varchar(500),
nome varchar(30) NOT NULL,
telefone varchar(15) NOT NULL,
numero int NOT NULL,
cnpj varchar(14),
uf varchar(2) NOT NULL,
status varchar(20),
horarioAbertura varchar(30) NOT NULL,
horarioEncerramento varchar(30) NOT NULL,
dataTerminoPenalidade DATETIME NOT NULL,
dataFundacao DATETIME NOT NULL,
FOREIGN KEY (idUsuario) REFERENCES usuario(idUsuario) ON DELETE CASCADE,
FOREIGN KEY (idBandeira) REFERENCES bandeira(idBandeira) 
);

CREATE TABLE combustivel (
idCombustivel int AUTO_INCREMENT PRIMARY KEY,
nome varchar(30) NOT NULL,
unidade varchar(20) Not NULL
);

CREATE TABLE estabelecimentoCombustivel (
idEstabelecimentoCombustivel int AUTO_INCREMENT PRIMARY KEY,
idCombustivel int NOT NULL,
idEstabelecimento int NOT NULL,
dataAtualizacao DATETIME NOT NULL,
quantidade DOUBLE NOT NULL,
preco DOUBLE NOT NULL,
FOREIGN KEY (idCombustivel) REFERENCES combustivel(idCombustivel),
FOREIGN KEY (idEstabelecimento) REFERENCES estabelecimento(idEstabelecimento) ON DELETE CASCADE
);

CREATE TABLE avaliacao (
idAvaliacao int AUTO_INCREMENT PRIMARY KEY,
idConsumidor int NOT NULL,
idEstabelecimento int NOT NULL,
descricao varchar(255) NOT NULL,
nota DOUBLE NOT NULL,
dataAvaliacao DATETIME NOT NULL,
FOREIGN KEY (idConsumidor) REFERENCES consumidor(idConsumidor) ON DELETE CASCADE,
FOREIGN KEY (idEstabelecimento) REFERENCES estabelecimento(idEstabelecimento) ON DELETE CASCADE
);

CREATE TABLE denuncia (
idDenuncia int AUTO_INCREMENT PRIMARY KEY,
idConsumidor int NOT NULL,
idEstabelecimento int NOT NULL,
idAdministrador int,
descricao varchar(255) NOT NULL,
dataDenuncia DATETIME NOT NULL,
status varchar(20),
FOREIGN KEY (idConsumidor) REFERENCES consumidor(idConsumidor) ON DELETE CASCADE,
FOREIGN KEY (idEstabelecimento) REFERENCES estabelecimento(idEstabelecimento) ON DELETE CASCADE,
FOREIGN KEY (idAdministrador) REFERENCES administrador(idAdministrador) ON DELETE CASCADE
);

