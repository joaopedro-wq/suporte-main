const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./support.db", (err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados: ", err);
  } else {
    console.log("Conectado ao banco de dados SQLite.");
  }
});

const criarTabelas = () => {
  db.run(`CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    senha TEXT NOT NULL, 
    tipo TEXT NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS postagens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    assunto TEXT NOT NULL,
    equipamento TEXT NOT NULL,
    descricao TEXT NOT NULL,
    data_postagem DATETIME NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS respostas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    postagem_id INTEGER NOT NULL,
    conteudo TEXT NOT NULL,
    data_resposta DATETIME NOT NULL,
    FOREIGN KEY (postagem_id) REFERENCES postagens (id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS avaliacoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    resposta_id INTEGER NOT NULL,
    nota INTEGER NOT NULL,
    FOREIGN KEY (resposta_id) REFERENCES respostas (id)
  )`);
};

// Executar criação das tabelas
criarTabelas();

module.exports = db;

