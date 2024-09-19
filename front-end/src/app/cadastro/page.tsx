"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "../services/authService";

const CadastroPage = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [tipo, setTipo] = useState("usuario");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await register(nome, email, tipo, senha);

    if (response) {
      router.push("/login");
    } else {
      setError("Erro ao cadastrar usuário");
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "0 auto",
        padding: "20px",
        border: "1px solid #444",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
        backgroundColor: "#121212", // Fundo escuro
        color: "#e0e0e0", // Cor do texto claro
      }}
    >
      <h1 style={{ textAlign: "center", color: "#e0e0e0" }}>Cadastro</h1>
      <form onSubmit={handleCadastro}>
        <div style={{ marginBottom: "15px" }}>
          <label
            style={{ display: "block", marginBottom: "5px", color: "#e0e0e0" }}
          >
            Nome:
          </label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #555",
              backgroundColor: "#333", // Fundo do input escuro
              color: "#e0e0e0", // Texto claro
              fontSize: "16px",
            }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label
            style={{ display: "block", marginBottom: "5px", color: "#e0e0e0" }}
          >
            Email:
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #555",
              backgroundColor: "#333",
              color: "#e0e0e0",
              fontSize: "16px",
            }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label
            style={{ display: "block", marginBottom: "5px", color: "#e0e0e0" }}
          >
            Tipo de Usuário:
          </label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #555",
              backgroundColor: "#333",
              color: "#e0e0e0",
              fontSize: "16px",
            }}
          >
            <option value="usuario">Usuário</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label
            style={{ display: "block", marginBottom: "5px", color: "#e0e0e0" }}
          >
            Senha:
          </label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #555",
              backgroundColor: "#333",
              color: "#e0e0e0",
              fontSize: "16px",
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#6200ea", 
            color: "#e0e0e0", 
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          Cadastrar
        </button>
      </form>
      {error && (
        <p style={{ color: "red", textAlign: "center", marginTop: "15px" }}>
          {error}
        </p>
      )}
    </div>
  );
};

export default CadastroPage;
