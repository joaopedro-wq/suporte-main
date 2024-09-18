const express = require("express");
const router = express.Router();
const respostaController = require("../controllers/respostaController");


router.post("/", respostaController.criarResposta);


router.get("/:postagem_id", respostaController.listarRespostas);


router.put("/:id", respostaController.atualizarResposta);


router.delete("/:id", respostaController.excluirResposta);


router.post("/:id/avaliar", respostaController.avaliarResposta);

module.exports = router;
