const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

// Importar rotas
const usuarioRoutes = require("./routes/usuarios");
const postagemRoutes = require("./routes/postagens");
const respostaRoutes = require("./routes/respostas");
const avaliacaoRoutes = require("./routes/avaliacoes");

// Middleware
app.use(bodyParser.json());

// Usar rotas
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/postagens", postagemRoutes);
app.use("/api/respostas", respostaRoutes);
app.use("/api/avaliacoes", avaliacaoRoutes);

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
