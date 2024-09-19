"use client";

import { useEffect, useState } from "react";
import { getPostagens } from "../services/postagem";

interface Postagem {
  id: number;
  usuario_id: number;
  assunto: string;
  equipamento: string;
  descricao: string;
  data_postagem: string;
}

const PostagensUsuario = () => {
  const [postagens, setPostagens] = useState<Postagem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const usuario_id = Number(localStorage.getItem("userId"));

    if (usuario_id) {
      getPostagens(usuario_id).then((response) => {
        if (response) {
          setPostagens(response.data); // Acessa a propriedade 'data' da resposta
        } else {
          setError("Nenhuma postagem encontrada.");
        }
      });
    } else {
      setError("Usuário não autenticado.");
    }
  }, []);

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "1200px",
        margin: "0 auto",
        backgroundColor: "#121212",
        color: "#e0e0e0",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#e0e0e0" }}>
        Postagens do Usuário
      </h1>
      {error && (
        <p style={{ color: "#ff6b6b", textAlign: "center" }}>{error}</p>
      )}
      {!error && postagens.length > 0 ? (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
            color: "#e0e0e0",
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: "#1f1f1f",
                borderBottom: "2px solid #333",
              }}
            >
              <th
                style={{ padding: "12px", textAlign: "left", color: "#e0e0e0" }}
              >
                Assunto
              </th>
              <th
                style={{ padding: "12px", textAlign: "left", color: "#e0e0e0" }}
              >
                Equipamento
              </th>
              <th
                style={{ padding: "12px", textAlign: "left", color: "#e0e0e0" }}
              >
                Descrição
              </th>
              <th
                style={{ padding: "12px", textAlign: "left", color: "#e0e0e0" }}
              >
                Data da Postagem
              </th>
            </tr>
          </thead>
          <tbody>
            {postagens.map((postagem) => (
              <tr
                key={postagem.id}
                style={{
                  backgroundColor: "#1f1f1f",
                  borderBottom: "1px solid #333",
                }}
              >
                <td style={{ padding: "10px" }}>{postagem.assunto}</td>
                <td style={{ padding: "10px" }}>{postagem.equipamento}</td>
                <td style={{ padding: "10px" }}>{postagem.descricao}</td>
                <td style={{ padding: "10px" }}>
                  {new Date(postagem.data_postagem).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ textAlign: "center", marginTop: "20px" }}>
          Nenhuma postagem encontrada.
        </p>
      )}
    </div>
  );
};

export default PostagensUsuario;
