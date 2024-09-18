const db = require("../database/database");


exports.criarUsuario = (req, res) => {
  const { nome, email, tipo } = req.body;

  const sql = "INSERT INTO usuarios (nome, email, tipo) VALUES (?, ?, ?)";
  const params = [nome, email, tipo];

  db.run(sql, params, function (err) {
    if (err) {
      return res.status(400).json({ erro: err.message });
    }
    res.json({
      message: "Usuário registrado",
      data: { id: this.lastID, nome, email, tipo },
    });
  });
};


exports.listarUsuarios = (req, res) => {
  const sql = "SELECT * FROM usuarios";

  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(400).json({ erro: err.message });
    }
    res.json({ data: rows });
  });
};


exports.buscarUsuarioPorId = (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM usuarios WHERE id = ?";

  db.get(sql, [id], (err, row) => {
    if (err) {
      return res.status(400).json({ erro: err.message });
    }
    if (!row) {
      return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }
    res.json({ data: row });
  });
};


exports.atualizarUsuario = (req, res) => {
  const { id } = req.params;
  const { nome, email, tipo } = req.body;

  const sql = "UPDATE usuarios SET nome = ?, email = ?, tipo = ? WHERE id = ?";
  const params = [nome, email, tipo, id];

  db.run(sql, params, function (err) {
    if (err) {
      return res.status(400).json({ erro: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }
    res.json({
      message: "Usuário atualizado",
      data: { id, nome, email, tipo },
    });
  });
};
