const db = require("../database/database.js");

exports.criarPostagem = (req, res) => {
  const { usuario_id, assunto, equipamento, descricao } = req.body;
  const data_postagem = new Date().toISOString();

  const sql =
    "INSERT INTO postagens (usuario_id, assunto, equipamento, descricao, data_postagem) VALUES (?, ?, ?, ?, ?)";
  const params = [usuario_id, assunto, equipamento, descricao, data_postagem];

  db.run(sql, params, function (err) {
    if (err) {
      return res.status(400).json({ erro: err.message });
    }
    res.json({
      message: "Postagem criada",
      data: {
        id: this.lastID,
        usuario_id,
        assunto,
        equipamento,
        descricao,
        data_postagem,
      },
    });
  });
};

exports.listarPostagens = (req, res) => {
  const sql = "SELECT * FROM postagens";

  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(400).json({ erro: err.message });
    }
    res.json({ data: rows });
  });
};

exports.buscarPostagemPorId = (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM postagens WHERE id = ?";

  db.get(sql, [id], (err, row) => {
    if (err) {
      return res.status(400).json({ erro: err.message });
    }
    if (!row) {
      return res.status(404).json({ mensagem: "Postagem não encontrada" });
    }
    res.json({ data: row });
  });
};

exports.excluirPostagem = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM postagens WHERE id = ?";

  db.run(sql, [id], function (err) {
    if (err) {
      return res.status(400).json({ erro: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ mensagem: "Postagem não encontrada" });
    }
    res.json({ mensagem: "Postagem excluída" });
  });
};
