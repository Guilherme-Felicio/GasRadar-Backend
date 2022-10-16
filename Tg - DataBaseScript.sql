
CREATE TABLE usuario (
idUsuario int AUTO_INCREMENT PRIMARY KEY ,
nome varchar(30) NOT NULL,
adm boolean NOT NULL,
telefone varchar(11) NOT NULL,
email varchar(100) NOT NULL,
senha varchar(255) NOT NULL
);

CREATE TABLE consumidor (
idConsumidor int AUTO_INCREMENT PRIMARY KEY,
idUsuario int,
cpf varchar(11) NOT NULL,
genero char(1) NOT NULL,
dataNasc DATETIME NOT NULL,
FOREIGN KEY (idUsuario) REFERENCES usuario(idUsuario) ON DELETE CASCADE
);

CREATE TABLE bandeira (
idBandeira int AUTO_INCREMENT PRIMARY KEY,
nome varchar(30) NOT NULL
);

CREATE TABLE estabelecimento (
idEstabelecimento int AUTO_INCREMENT PRIMARY KEY,
idUsuario int,
idBandeira int,
status varchar(10),
endereco varchar(50) NOT NULL,
bairro varchar(30) NOT NULL,
cep varchar(8) NOT NULL,
cidade varchar(50) NOT NULL,
uf varchar(2) NOT NULL,
latitude varchar(10),
longitude varchar(10),
nota float(12),
urlImagem varchar(255),
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
idCombustivel int,
idEstabelecimento int,
dataAtualizacao DATETIME NOT NULL,
quantidade DOUBLE NOT NULL,
preco DOUBLE NOT NULL,
FOREIGN KEY (idCombustivel) REFERENCES combustivel(idCombustivel),
FOREIGN KEY (idEstabelecimento) REFERENCES estabelecimento(idEstabelecimento)
);



INSERT INTO combustivel (nome, unidade) VALUES ("Etanol", "estabelecimentoLitrão");



