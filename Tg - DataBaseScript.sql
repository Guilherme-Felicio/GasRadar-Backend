
CREATE TABLE usuario (
idUsuario int AUTO_INCREMENT PRIMARY KEY ,
nome varchar(30) NOT NULL,
email varchar(100) NOT NULL,
adm boolean NOT NULL,
telefone varchar(11) NOT NULL,
senha varchar(255) NOT NULL
);

CREATE TABLE consumidor (
idConsumidor int AUTO_INCREMENT PRIMARY KEY,
idUsuario int,
cpf varchar(11) NOT NULL,
sexo char(1) NOT NULL,
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
cnpj varchar(14),
status varchar(10),
endereco varchar(50) NOT NULL,
bairro varchar(30) NOT NULL,
cep varchar(8) NOT NULL,
cidade varchar(50) NOT NULL,
uf varchar(2) NOT NULL,
latitude varchar(15),
longitude varchar(15),
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





INSERT INTO combustivel (nome, unidade) VALUES ("Etanol", "Litrão");



