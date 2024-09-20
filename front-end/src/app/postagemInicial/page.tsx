"use client";

import { useEffect, useState } from "react";
import { getPostagens, selecionarPostagem } from "../services/postagem";
import { criarResposta, listarRespostas } from "../services/resposta";
import { listarAvaliacoes } from "../services/avaliacao";

import {
  Typography,
  Container,
  Box,
  Divider,
  Modal,
  Button,
  TextField,
  Badge,
  Chip,
} from "@mui/material";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BuscarUsuarios } from "../services/authService";
import { Person, DeviceHub, Description, CalendarToday, Star } from "@mui/icons-material";
import InfoIcon from "@mui/icons-material/Info";
import { useRouter } from "next/navigation";
import styled from 'styled-components';

interface Postagem {
  id: number;
  usuario_id: number;
  assunto: string;
  equipamento: string;
  descricao: string;
  data_postagem: string;
}

interface Usuario {
  id: number;
  nome: string;
  email: string;
  tipo: string;
}

interface Avaliacao {
  resposta_id: number;
  nota: number;
}

interface Resposta {
  id: number;
  postagem_id: number;
  conteudo: string;
}

const PostagemInicial = () => {
  const [postagens, setPostagens] = useState<Postagem[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [estatisticas, setEstatisticas] = useState<{ [key: number]: { media: number; total: number } }>({});
  const [respostasMap, setRespostasMap] = useState<Map<number, boolean>>(new Map());
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPostagem, setSelectedPostagem] = useState<Postagem | null>(null);
  const [resposta, setResposta] = useState<string>("");
  const [respostas, setRespostas] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postagensResponse = await getPostagens();
        if (postagensResponse && postagensResponse.data) {
          setPostagens(postagensResponse.data);
        } else {
          setError("Nenhuma postagem encontrada.");
        }

        const usuariosResponse = await BuscarUsuarios();
        if (usuariosResponse) {
          setUsuarios(usuariosResponse);
        } else {
          setError("Nenhum usuário encontrado.");
        }

        const avaliacaoResponse = await listarAvaliacoes();
        if (avaliacaoResponse && avaliacaoResponse.data) {
          const avaliacaoPorResposta: { [respostaId: number]: Avaliacao[] } = {};
          avaliacaoResponse.data.forEach((avaliacao: Avaliacao) => {
            if (!avaliacaoPorResposta[avaliacao.resposta_id]) {
              avaliacaoPorResposta[avaliacao.resposta_id] = [];
            }
            avaliacaoPorResposta[avaliacao.resposta_id].push(avaliacao);
          });

          const newEstatisticas: { [key: number]: { media: number; total: number } } = {};
          for (const postagem of postagensResponse.data) {
            const respostas = await listarRespostas(postagem.id);
            if (respostas && respostas.data.length > 0) {
              let totalNotas = 0;
              let totalAvaliacoes = 0;
              respostas.data.forEach((resposta: Resposta) => {
                const avaliacoes = avaliacaoPorResposta[resposta.id] || [];
                if (avaliacoes.length > 0) {
                  const somaNotas = avaliacoes.reduce((acc, curr) => acc + curr.nota, 0);
                  totalNotas += somaNotas;
                  totalAvaliacoes += avaliacoes.length;
                }
              });

              if (totalAvaliacoes > 0) {
                newEstatisticas[postagem.id] = {
                  media: totalNotas / totalAvaliacoes,
                  total: totalAvaliacoes,
                };
              }
            }
          }

          setEstatisticas(newEstatisticas);
        } else {
          setError("Nenhuma avaliação encontrada.");
        }
      } catch (err) {
        setError("Erro ao carregar dados.");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const loadRespostas = async () => {
      const newRespostasMap = new Map<number, boolean>();

      for (const postagem of postagens) {
        const respostas = await listarRespostas(postagem.id);
        if (respostas && respostas.data.length > 0) {
          newRespostasMap.set(postagem.id, true);
        } else {
          newRespostasMap.set(postagem.id, false);
        }
      }

      setRespostasMap(newRespostasMap);
    };

    loadRespostas();
  }, [postagens]);

  const handleOpenModal = async (postagem: Postagem) => {
    const success = await selecionarPostagem(postagem.id);
    if (success) {
      setSelectedPostagem(postagem);

      // Carregar respostas
      const respostasApi = await listarRespostas(postagem.id);
      if (respostasApi && respostasApi.data.length > 0) {
        const conteudoRespostas = respostasApi.data.map((resposta) => resposta.conteudo);
        setRespostas(conteudoRespostas);
      } else {
        setRespostas([]);
      }

      setModalOpen(true);
    } else {
      console.error("Erro ao selecionar a postagem.");
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedPostagem(null);
    setResposta("");
  };

  const redirectToAvaliacao = async (postagem: Postagem) => {
    const success = await selecionarPostagem(postagem.id);
    if (success) {
      localStorage.setItem("postagemIdCache", postagem.id.toString());

      const respostasApi = await listarRespostas(postagem.id);
      if (respostasApi && respostasApi.data.length > 0) {
        const conteudoRespostas = respostasApi.data.map((resposta) => resposta.conteudo);
        setRespostas(conteudoRespostas);
      } else {
        setRespostas([]);
      }

      router.push("/avaliacao");
    } else {
      console.error("Erro ao selecionar a postagem.");
    }
  };

  const handleSaveResposta = async () => {
    if (selectedPostagem) {
      const response = await criarResposta(selectedPostagem.id, resposta);
      if (response) {
        setRespostas((prevRespostas) => [...prevRespostas, resposta]);
        setRespostasMap((prevMap) => new Map(prevMap).set(selectedPostagem.id, true));
        handleCloseModal();
      } else {
        console.error("Erro ao criar a resposta.");
      }
    }
  };

  const usuariosMap = new Map(usuarios.map((usuario) => [usuario.id, usuario.nome]));

  return (
    <>
      <Header />
      <Container
        sx={{
          padding: "20px",
          maxWidth: "1200px",
          margin: "0 auto",
          backgroundColor: "#121212",
          color: "#e0e0e0",
        }}
      >
        <Typography
          variant="h5"
          align="center"
          color="#2196f3"
          gutterBottom
          sx={{
            fontWeight: "bold",
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            mb: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          Feed de Postagens
        </Typography>

        {error && (
          <Typography variant="body1" color="#ff6b6b" align="center" sx={{ marginTop: "20px" }}>
            {error}
          </Typography>
        )}

        {!error && postagens.length > 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            {postagens.map((postagem) => (
              <Box
                key={postagem.id}
                sx={{
                  backgroundColor: "#1f1f1f",
                  padding: "20px",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.5)",
                  border: "1px solid #333",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  "&:hover": {
                    transform: "scale(1.02)",
                    boxShadow: "0 8px 16px rgba(0,0,0,0.6)",
                  },
                  cursor: "pointer",
                  position: "relative",
                }}
                onClick={() => handleOpenModal(postagem)}
              >
                <Badge
                  badgeContent="Respondido"
                  color="primary"
                  invisible={!respostasMap.get(postagem.id)}
                  sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    backgroundColor: "#3b82f6",
                    color: "#fff",
                    "& .MuiBadge-dot": {
                      backgroundColor: "#3b82f6",
                    },
                  }}
                />
                {estatisticas[postagem.id]?.total > 0 && (
                  <Chip
                    label="Avaliada"
                    color="success"
                    sx={{
                      position: "center",
                      top: 10,
                      left: 10,
                      backgroundColor: "#b38917",
                      color: "#fff",
                    }}
                  />
                )}

                <Typography
                  variant="h6"
                  color="#e0e0e0"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <Star sx={{ color: "#ffeb3b" }} /> Média de Avaliação: {estatisticas[postagem.id]?.media.toFixed(2)}
                  <Person sx={{ color: "#64b5f6" }} />
                  {usuariosMap.get(postagem.usuario_id) || "Desconhecido"}
                </Typography>
                <Divider sx={{ borderColor: "#333", marginBottom: "10px" }} />
                <Typography
                  variant="h6"
                  color="#e0e0e0"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <DeviceHub sx={{ color: "#4db6ac" }} />
                  {postagem.equipamento}
                </Typography>
                <Typography
                  variant="body1"
                  color="#e0e0e0"
                  paragraph
                  sx={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <Description sx={{ color: "#ffb74d" }} />
                  {postagem.descricao}
                </Typography>
                <Typography
                  variant="body2"
                  color="#e0e0e0"
                  sx={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <CalendarToday sx={{ color: "#e57373" }} />
                  {new Date(postagem.data_postagem).toLocaleDateString()}
                </Typography>

                {estatisticas[postagem.id] && (
                  <Box sx={{ display: "flex", alignItems: "center", marginTop: "10px", gap: "5px" }}>
                    <Star sx={{ color: "#ffd700" }} />
                    <Typography variant="body2" color="#e0e0e0">
                      {estatisticas[postagem.id].media.toFixed(1)} / 5 ({estatisticas[postagem.id].total} avaliações)
                    </Typography>
                  </Box>
                )}

                <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      redirectToAvaliacao(postagem);
                    }}
                    startIcon={<InfoIcon />}
                    sx={{
                      textTransform: "none",
                      fontWeight: "bold",
                      backgroundColor: "#3b82f6",
                      "&:hover": {
                        backgroundColor: "#2563eb",
                      },
                    }}
                  >
                    Ver Detalhes
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>
        ) : (
          <Typography variant="body1" align="center" sx={{ marginTop: "20px" }}>
            Nenhuma postagem encontrada.
          </Typography>
        )}

        {/* Modal para Exibir Respostas */}
        <Modal open={modalOpen} onClose={handleCloseModal} aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description">
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 600,
              bgcolor: "#18181b",
              boxShadow: 24,
              p: 4,
              color: "#e0e0e0",
            }}
          >
            <Typography id="simple-modal-title" variant="h6" component="h2" sx={{ color: "#3b82f6" }}>
              Modal de Postagem
            </Typography>

            <TextField
              fullWidth
              label="Usuário"
              variant="outlined"
              value={usuariosMap.get(selectedPostagem?.usuario_id) || ""}
              sx={{
                mt: 2,
                "& input": { color: "#e0e0e0" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#555" },
                  "&:hover fieldset": { borderColor: "#3b82f6" },
                  "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
                },
                "& label": { color: "#aaa" },
                "& label.Mui-focused": { color: "#3b82f6" },
              }}
              InputProps={{ readOnly: true }}
            />

            <TextField
              fullWidth
              label="Assunto"
              variant="outlined"
              value={selectedPostagem?.assunto || ""}
              sx={{
                mt: 2,
                "& input": { color: "#e0e0e0" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#555" },
                  "&:hover fieldset": { borderColor: "#3b82f6" },
                  "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
                },
                "& label": { color: "#aaa" },
                "& label.Mui-focused": { color: "#3b82f6" },
              }}
              InputProps={{ readOnly: true }}
            />

            <TextField
              fullWidth
              label="Equipamento"
              variant="outlined"
              value={selectedPostagem?.equipamento || ""}
              sx={{
                mt: 2,
                "& input": { color: "#e0e0e0" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#555" },
                  "&:hover fieldset": { borderColor: "#3b82f6" },
                  "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
                },
                "& label": { color: "#aaa" },
                "& label.Mui-focused": { color: "#3b82f6" },
              }}
              InputProps={{ readOnly: true }}
            />

            <TextField
              fullWidth
              label="Descrição"
              variant="outlined"
              multiline
              rows={4}
              value={selectedPostagem?.descricao || ""}
              sx={{
                mt: 2,
                "& input, & textarea": { color: "#e0e0e0" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#555" },
                  "&:hover fieldset": { borderColor: "#3b82f6" },
                  "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
                },
                "& label": { color: "#aaa" },
                "& label.Mui-focused": { color: "#3b82f6" },
              }}
              InputProps={{ readOnly: true }}
            />

            <Box sx={{ maxHeight: "200px", overflowY: "auto", mt: 2 }}>
              {respostas.map((resposta, index) => (
                <TextField
                  key={index}
                  fullWidth
                  label={`Resposta ${index + 1}`}
                  variant="outlined"
                  multiline
                  rows={4}
                  value={resposta}
                  onChange={(e) => {
                    const newRespostas = [...respostas];
                    newRespostas[index] = e.target.value;
                    setRespostas(newRespostas);
                  }}
                  sx={{
                    mt: 2,
                    "& input, & textarea": { color: "#e0e0e0" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#555" },
                      "&:hover fieldset": { borderColor: "#3b82f6" },
                      "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
                    },
                    "& label": { color: "#aaa" },
                    "& label.Mui-focused": { color: "#3b82f6" },
                  }}
                />
              ))}
              <TextField
                fullWidth
                label="Nova Resposta"
                variant="outlined"
                value={resposta}
                onChange={(e) => setResposta(e.target.value)}
                sx={{
                  mt: 2,
                  "& input": { color: "#e0e0e0" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#555" },
                    "&:hover fieldset": { borderColor: "#3b82f6" },
                    "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
                  },
                  "& label": { color: "#aaa" },
                  "& label.Mui-focused": { color: "#3b82f6" },
                }}
              />
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
              <Button variant="contained" color="primary" onClick={handleSaveResposta}>
                Salvar Resposta
              </Button>
              <Button variant="outlined" color="secondary" onClick={handleCloseModal}>
                Fechar
              </Button>
            </Box>
          </Box>
        </Modal>
      </Container>
      <div style={{ marginBottom: "10%" }}></div>
      <Footer />
    </>
  );
};

export default PostagemInicial;
