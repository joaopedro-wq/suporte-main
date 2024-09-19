const db = require("../database/database.js");

exports.criarResposta = (req, res) => {
  const { postagem_id, conteudo } = req.body;
  const data_resposta = new Date().toISOString();

  const sql =
    "INSERT INTO respostas (postagem_id, conteudo, data_resposta) VALUES (?, ?, ?)";
  const params = [postagem_id, conteudo, data_resposta];

  db.run(sql, params, function (err) {
    if (err) {
      return res.status(400).json({ erro: err.message });
    }
    res.json({
      message: "Resposta criada",
      data: { id: this.lastID, postagem_id, conteudo, data_resposta },
    });
  });
};

exports.listarRespostas = (req, res) => {
  const { postagem_id } = req.params;
  const sql = "SELECT * FROM respostas WHERE postagem_id = ?";

  db.all(sql, [postagem_id], (err, rows) => {
    if (err) {
      return res.status(400).json({ erro: err.message });
    }
    res.json({ data: rows });
  });
};

exports.excluirResposta = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM respostas WHERE id = ?";
  db.run(sql, id, function (err) {
    if (err) {
      return res.status(400).json({ erro: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: "Resposta não encontrada" });
    }
    res.json({ message: "Resposta excluída com sucesso" });
  });
};

exports.atualizarResposta = (req, res) => {
  const { id } = req.params;
  const { conteudo } = req.body;

  const sql = "UPDATE respostas SET conteudo = ? WHERE id = ?";
  const params = [conteudo, id];

  db.run(sql, params, function (err) {
    if (err) {
      return res.status(400).json({ erro: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: "Resposta não encontrada" });
    }
    res.json({ message: "Resposta atualizada com sucesso" });
  });
};
exports.avaliarResposta = (req, res) => {
  const { id } = req.params;
  const { nota } = req.body;

  if (nota < 0 || nota > 5) {
    return res.status(400).json({ erro: "A nota deve ser entre 0 e 5" });
  }

  const sql = "UPDATE respostas SET avaliacao = ? WHERE id = ?";
  const params = [nota, id];

  db.run(sql, params, function (err) {
    if (err) {
      return res.status(400).json({ erro: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: "Resposta não encontrada" });
    }
    res.json({ message: "Avaliação registrada com sucesso" });
  });
};
