const db = require("../database/database.js");

exports.criarAvaliacao = (req, res) => {
  const { resposta_id, nota } = req.body;

  if (nota < 0 || nota > 5) {
    return res.status(400).json({ erro: "A nota deve ser entre 0 e 5" });
  }

  const sql = "INSERT INTO avaliacoes (resposta_id, nota) VALUES (?, ?)";
  const params = [resposta_id, nota];

  db.run(sql, params, function (err) {
    if (err) {
      return res.status(400).json({ erro: err.message });
    }
    res.json({
      message: "Avaliação criada com sucesso",
      data: { id: this.lastID, resposta_id, nota },
    });
  });
};

exports.criarOuAtualizarAvaliacao = (req, res) => {
  const { resposta_id, nota } = req.body;

  if (nota < 0 || nota > 5) {
    return res.status(400).json({ erro: "A nota deve ser entre 0 e 5" });
  }

  const sqlVerificar = "SELECT * FROM avaliacoes WHERE resposta_id = ?";
  db.get(sqlVerificar, [resposta_id], (err, row) => {
    if (err) {
      return res.status(400).json({ erro: err.message });
    }

    if (row) {
      const sqlAtualizar = "UPDATE avaliacoes SET nota = ? WHERE resposta_id = ?";
      db.run(sqlAtualizar, [nota, resposta_id], function (err) {
        if (err) {
          return res.status(400).json({ erro: err.message });
        }
        res.json({
          message: "Avaliação atualizada com sucesso",
          data: { resposta_id, nota },
        });
      });
    } else {
      const sqlInserir = "INSERT INTO avaliacoes (resposta_id, nota) VALUES (?, ?)";
      db.run(sqlInserir, [resposta_id, nota], function (err) {
        if (err) {
          return res.status(400).json({ erro: err.message });
        }
        res.json({
          message: "Avaliação criada com sucesso",
          data: { id: this.lastID, resposta_id, nota },
        });
      });
    }
  });
};


exports.listarAvaliacoes = (req, res) => {
  const sql = "SELECT * FROM avaliacoes";
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(400).json({ erro: err.message });
    }
    res.json({ data: rows });
  });
};

exports.listarAvaliacaoPorId = (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM avaliacoes WHERE id = ?";

  db.get(sql, [id], (err, row) => {
    if (err) {
      return res.status(400).json({ erro: err.message });
    }
    res.json({ data: row });
  });
};

exports.atualizarAvaliacao = (req, res) => {
  const { id } = req.params;
  const { nota } = req.body;

  if (nota < 0 || nota > 5) {
    return res.status(400).json({ erro: "A nota deve ser entre 0 e 5" });
  }

  const sql = "UPDATE avaliacoes SET nota = ? WHERE id = ?";
  const params = [nota, id];

  db.run(sql, params, function (err) {
    if (err) {
      return res.status(400).json({ erro: err.message });
    }
    res.json({
      message: "Avaliação atualizada com sucesso",
      data: { id, nota },
    });
  });
};

exports.deletarAvaliacao = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM avaliacoes WHERE id = ?";

  db.run(sql, [id], function (err) {
    if (err) {
      return res.status(400).json({ erro: err.message });
    }
    res.json({
      message: "Avaliação deletada com sucesso",
      data: { id },
    });
  });
};

exports.listarEstatisticas = (req, res) => {
  const sqlPostagens = "SELECT COUNT(*) AS total_postagens FROM postagens";
  const sqlRespostas =
    "SELECT postagem_id, COUNT(*) AS total_respostas FROM respostas GROUP BY postagem_id";
  const sqlAvaliacoes =
    "SELECT resposta_id, AVG(nota) AS nota_media FROM avaliacoes GROUP BY resposta_id";

  db.get(sqlPostagens, [], (err, rowPostagens) => {
    if (err) {
      return res.status(400).json({ erro: err.message });
    }
    db.all(sqlRespostas, [], (err, rowsRespostas) => {
      if (err) {
        return res.status(400).json({ erro: err.message });
      }
      db.all(sqlAvaliacoes, [], (err, rowsAvaliacoes) => {
        if (err) {
          return res.status(400).json({ erro: err.message });
        }
        res.json({
          total_postagens: rowPostagens.total_postagens,
          respostas: rowsRespostas,
          avaliacoes: rowsAvaliacoes,
        });
      });
    });
  });
};
