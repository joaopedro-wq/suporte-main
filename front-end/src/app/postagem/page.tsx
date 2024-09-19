"use client";

import { useState } from "react";
import { criarPostagem } from "../services/postagem";
import { useRouter } from "next/navigation";
const PostagensPage = () => {
  const [assunto, setAssunto] = useState("");
  const [equipamento, setEquipamento] = useState("");
  const [descricao, setDescricao] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const router = useRouter();
  const handlePostar = async (e: React.FormEvent) => {
    e.preventDefault();

    const usuario_id = Number(localStorage.getItem("userId"));

    if (!usuario_id) {
      setError("Usuário não autenticado.");
      return;
    }

    const response = await criarPostagem(
      usuario_id,
      assunto,
      equipamento,
      descricao
    );

    if (response) {
      setSuccess("Postagem criada com sucesso!");
      setError(null);

      router.push("/postagensUsuario");
    } else {
      setError("Erro ao criar a postagem.");
      setSuccess(null);
    }
  };

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#121212",
    color: "#e0e0e0",
    fontFamily: "Arial, sans-serif",
  };

  const formStyle = {
    backgroundColor: "#1e1e1e",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
    width: "400px",
  };

  const inputStyle = {
    display: "block",
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "4px",
    border: "1px solid #333",
    backgroundColor: "#2c2c2c",
    color: "#e0e0e0",
  };

  const textAreaStyle = {
    display: "block",
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "4px",
    border: "1px solid #333",
    backgroundColor: "#2c2c2c",
    color: "#e0e0e0",
    height: "100px",
  };

  const buttonStyle = {
    backgroundColor: "#6200ea",
    color: "#ffffff",
    padding: "10px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    width: "100%",
    fontSize: "16px",
  };

  const successMessageStyle = {
    color: "green",
    marginTop: "10px",
  };

  const errorMessageStyle = {
    color: "red",
    marginTop: "10px",
  };

  return (
    <div style={containerStyle}>
      <h1>Criar Postagem</h1>
      <form onSubmit={handlePostar} style={formStyle}>
        <div>
          <label>Assunto:</label>
          <input
            type="text"
            value={assunto}
            onChange={(e) => setAssunto(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <div>
          <label>Equipamento:</label>
          <input
            type="text"
            value={equipamento}
            onChange={(e) => setEquipamento(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <div>
          <label>Descrição:</label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
            style={textAreaStyle}
          />
        </div>
        <button type="submit" style={buttonStyle}>
          Postar
        </button>
      </form>
      {error && <p style={errorMessageStyle}>{error}</p>}
      {success && <p style={successMessageStyle}>{success}</p>}
    </div>
  );
};

export default PostagensPage;
