const express = require("express");
const router = express.Router();
const postagemController = require("../controllers/postagemController");


router.post("/", postagemController.criarPostagem);


router.get("/", postagemController.listarPostagens);


router.get("/:id", postagemController.buscarPostagemPorId);


router.delete("/:id", postagemController.excluirPostagem);

module.exports = router;
