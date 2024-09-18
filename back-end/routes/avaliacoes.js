const express = require("express");
const router = express.Router();
const avaliacaoController = require("../controllers/avaliacaoController");


router.post("/", avaliacaoController.criarAvaliacao);


router.get("/", avaliacaoController.listarAvaliacoes);


router.get("/:id", avaliacaoController.listarAvaliacaoPorId);


router.put("/:id", avaliacaoController.atualizarAvaliacao);


router.delete("/:id", avaliacaoController.deletarAvaliacao);


router.get("/estatisticas", avaliacaoController.listarEstatisticas);

module.exports = router;
