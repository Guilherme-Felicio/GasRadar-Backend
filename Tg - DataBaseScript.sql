
CREATE TABLE usuario (
idUsuario int AUTO_INCREMENT PRIMARY KEY ,
email varchar(100) NOT NULL,
senha varchar(255) NOT NULL,
isEmailVerificado boolean NOT NULL,
codigoVerificao varchar(255),
CONSTRAINT UC_USUARIO_EMAIL UNIQUE (email)
);

CREATE TABLE administrador (
idAdministrador int AUTO_INCREMENT PRIMARY KEY,
idUsuario int NOT NULL,
nome varchar(30) NOT NULL,
telefone varchar(11) NOT NULL,
dataNasc DATETIME NOT NULL,
FOREIGN KEY (idUsuario) REFERENCES usuario(idUsuario) ON DELETE CASCADE
);


CREATE TABLE consumidor (
idConsumidor int AUTO_INCREMENT PRIMARY KEY,
idUsuario int NOT NULL,
cpf varchar(11) NOT NULL,
sexo char(1) NOT NULL,
dataNasc DATETIME NOT NULL,
nome varchar(30) NOT NULL,
telefone varchar(11) NOT NULL,
cep varchar(8) NOT NULL,
numero int NOT NULL,
endereco varchar(50) NOT NULL,
bairro varchar(30) NOT NULL,
cidade varchar(50) NOT NULL,
uf varchar(2) NOT NULL,
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
urlImagem varchar(255),
nome varchar(30) NOT NULL,
telefone varchar(11) NOT NULL,
numero int NOT NULL,
cnpj varchar(14),
uf varchar(2) NOT NULL,
status varchar(20),
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
FOREIGN KEY (idEstabelecimento) REFERENCES estabelecimento(idEstabelecimento)
);

CREATE TABLE avaliacao (
idAvaliacao int AUTO_INCREMENT PRIMARY KEY,
idConsumidor int NOT NULL,
idEstabelecimento int NOT NULL,
descricao varchar(200) NOT NULL,
nota DOUBLE NOT NULL,
dataAvaliacao DATETIME NOT NULL,
FOREIGN KEY (idConsumidor) REFERENCES consumidor(idConsumidor),
FOREIGN KEY (idEstabelecimento) REFERENCES estabelecimento(idEstabelecimento)
);

CREATE TABLE denuncia (
idDenuncia int AUTO_INCREMENT PRIMARY KEY,
idConsumidor int NOT NULL,
idEstabelecimento int NOT NULL,
idAdministrador int  NOT NULL,
descricao varchar(200) NOT NULL,
dataDenuncia DATETIME NOT NULL,
dataInicioPenalidade DATETIME,
dataTerminoPenalidade DATETIME,
status varchar(20),
FOREIGN KEY (idConsumidor) REFERENCES consumidor(idConsumidor),
FOREIGN KEY (idEstabelecimento) REFERENCES estabelecimento(idEstabelecimento),
FOREIGN KEY (idAdministrador) REFERENCES administrador(idAdministrador)
);





INSERT INTO combustivel (nome, unidade) VALUES ("Etanol", "Litrão");



