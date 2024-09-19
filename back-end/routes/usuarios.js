const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");

router.post("/", usuarioController.criarUsuario);

router.get("/", usuarioController.listarUsuarios);

router.get("/:id", usuarioController.buscarUsuarioPorId);

router.put("/:id", usuarioController.atualizarUsuario);

router.post("/login", usuarioController.loginUsuario);

module.exports = router;
