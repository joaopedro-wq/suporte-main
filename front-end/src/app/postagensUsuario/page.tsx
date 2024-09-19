"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getPostagens, excluirPostagem } from "../services/postagem";
import { Button, Typography, Container, Box } from "@mui/material";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [postagemToDelete, setPostagemToDelete] = useState<number | null>(null);
  const router = useRouter(); 

  useEffect(() => {
    const usuario_id = Number(localStorage.getItem("userId"));

    if (usuario_id) {
      getPostagens().then((response) => {
        if (response) {
          // Filtra as postagens para o usuário logado
          const postagensFiltradas = response.data.filter(
            (postagem) => postagem.usuario_id === usuario_id
          );
          setPostagens(postagensFiltradas);
        } else {
          setError("Nenhuma postagem encontrada.");
        }
      });
    } else {
      setError("Usuário não autenticado.");
    }
  }, []);

  const handleExcluirPostagem = async () => {
    if (postagemToDelete !== null) {
      const sucesso = await excluirPostagem(postagemToDelete);
      if (sucesso) {
        // Remove a postagem da lista após a exclusão
        setPostagens(
          postagens.filter((postagem) => postagem.id !== postagemToDelete)
        );
        setShowConfirmModal(false);
      } else {
        setError("Erro ao excluir a postagem.");
      }
    }
  };

  const openConfirmModal = (postagemId: number) => {
    setPostagemToDelete(postagemId);
    setShowConfirmModal(true);
  };

  const openCreatePostPage = () => {
    router.push("/postagem");
  };

    return (
      <>
        <>
          <Header></Header>
          <Container
            className="min-h-screen bg-zinc-800"
            sx={{
              padding: "20px",
              maxWidth: "1200px",
              margin: "0 auto",
              backgroundColor: "#121212",
              color: "#e0e0e0",
            }}
          >
            <Typography
              variant="h4"
              align="center"
              color="#e0e0e0"
              gutterBottom
            >
              Postagens do Usuário
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: "20px",
              }}
            >
              <Button
                variant="contained"
                color="secondary"
                onClick={openCreatePostPage}
                sx={{
                  padding: "4px 8px", // Dimensões menores
                  borderRadius: "4px",
                  fontSize: "12px", // Fonte menor
                }}
              >
                Nova Postagem
              </Button>
            </Box>

            {error && (
              <Typography
                variant="body1"
                color="#ff6b6b"
                align="center"
                sx={{ marginTop: "20px" }}
              >
                {error}
              </Typography>
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
                      style={{
                        padding: "12px",
                        textAlign: "left",
                        color: "#e0e0e0",
                      }}
                    >
                      Assunto
                    </th>
                    <th
                      style={{
                        padding: "12px",
                        textAlign: "left",
                        color: "#e0e0e0",
                      }}
                    >
                      Equipamento
                    </th>
                    <th
                      style={{
                        padding: "12px",
                        textAlign: "left",
                        color: "#e0e0e0",
                      }}
                    >
                      Descrição
                    </th>
                    <th
                      style={{
                        padding: "12px",
                        textAlign: "left",
                        color: "#e0e0e0",
                      }}
                    >
                      Data da Postagem
                    </th>
                    <th
                      style={{
                        padding: "12px",
                        textAlign: "left",
                        color: "#e0e0e0",
                      }}
                    >
                      Ações
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
                      <td style={{ padding: "10px" }}>
                        {postagem.equipamento}
                      </td>
                      <td style={{ padding: "10px" }}>{postagem.descricao}</td>
                      <td style={{ padding: "10px" }}>
                        {new Date(postagem.data_postagem).toLocaleDateString()}
                      </td>
                      <td style={{ padding: "10px" }}>
                        <Button
                          onClick={() => openConfirmModal(postagem.id)}
                          variant="contained"
                          color="error"
                          sx={{
                            padding: "6px 12px",
                            borderRadius: "4px",
                            fontSize: "14px",
                          }}
                        >
                          🗑️
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <Typography
                variant="body1"
                align="center"
                sx={{ marginTop: "20px" }}
              >
                Nenhuma postagem encontrada.
              </Typography>
            )}

            {showConfirmModal && (
              <Box
                sx={{
                  position: "fixed",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  padding: "20px",
                  backgroundColor: "#1f1f1f",
                  color: "#e0e0e0",
                  borderRadius: "8px",
                  boxShadow: "0 0 10px rgba(0,0,0,0.5)",
                  zIndex: 1000,
                  width: "300px",
                  textAlign: "center",
                }}
              >
                <Typography variant="body1">
                  Deseja realmente excluir esta postagem?
                </Typography>
                <Box
                  sx={{
                    marginTop: "20px",
                    display: "flex",
                    justifyContent: "center",
                    gap: "10px",
                  }}
                >
                  <Button
                    onClick={handleExcluirPostagem}
                    variant="contained"
                    color="error"
                    sx={{
                      padding: "10px 20px",
                      borderRadius: "4px",
                      fontSize: "16px",
                    }}
                  >
                    Sim
                  </Button>
                  <Button
                    onClick={() => setShowConfirmModal(false)}
                    variant="contained"
                    color="success"
                    sx={{
                      padding: "10px 20px",
                      borderRadius: "4px",
                      fontSize: "16px",
                    }}
                  >
                    Não
                  </Button>
                </Box>
              </Box>
            )}
          </Container>
        </>
        <Footer></Footer>
      </>
    );
};

export default PostagensUsuario;
