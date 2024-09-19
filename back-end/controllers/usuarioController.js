const db = require("../database/database.js");
const bcrypt = require("bcrypt");

exports.criarUsuario = async (req, res) => {
  const { nome, email, senha, tipo } = req.body;

  try {
    // Gerar o hash da senha
    const senhaHash = await bcrypt.hash(senha, 10);

    const sql =
      "INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)";
    const params = [nome, email, senhaHash, tipo];

    db.run(sql, params, function (err) {
      if (err) {
        return res.status(400).json({ erro: err.message });
      }
      res.json({
        message: "Usuário registrado",
        data: { id: this.lastID, nome, email, senha, tipo },
      });
    });
  } catch (err) {
    return res.status(500).json({ erro: "Erro ao criar usuário" });
  }
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

exports.loginUsuario = (req, res) => {
  const { email, senha } = req.body;
  const sql = "SELECT * FROM usuarios WHERE email = ?";

  db.get(sql, [email], async (err, row) => {
    if (err) {
      return res.status(400).json({ erro: err.message });
    }
    if (!row) {
      return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }

    // Comparar a senha fornecida com o hash armazenado
    const isMatch = await bcrypt.compare(senha, row.senha);
    if (!isMatch) {
      return res.status(401).json({ mensagem: "Senha incorreta" });
    }

    res.json({ mensagem: "Login bem-sucedido", data: row });
  });
};
