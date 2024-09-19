"use client";

import { useEffect, useState } from "react";
import { getPostagens } from "../services/postagem";
import { Typography, Container, Box, Divider } from "@mui/material";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { listarRespostas } from "../services/resposta";
import { List, ListItem, ListItemIcon } from "@mui/material";
import CommentIcon from "@mui/icons-material/Comment";

interface Postagem {
  id: number;
  usuario_id: number;
  assunto: string;
  equipamento: string;
  descricao: string;
  data_postagem: string;
}

const AvaliacaoPage = () => {
  const [postagens, setPostagens] = useState<Postagem[]>([]);
  const [respostasMap, setRespostasMap] = useState<Map<number, string[]>>(
    new Map()
  );
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedPostagem, setSelectedPostagem] = useState<Postagem | null>(
    null
  );
  const [respostas, setRespostas] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const postagensResponse = await getPostagens();
      if (postagensResponse && postagensResponse.data) {
        setPostagens(postagensResponse.data);
        loadRespostas(postagensResponse.data);
      }
    };

    const loadRespostas = async (postagens: Postagem[]) => {
      const newRespostasMap = new Map<number, string[]>();
      for (const postagem of postagens) {
        const respostas = await listarRespostas(postagem.id);
        newRespostasMap.set(
          postagem.id,
          respostas ? respostas.data.map((res) => res.conteudo) : []
        );
      }
      setRespostasMap(newRespostasMap);
    };

    fetchData();
  }, []);

  const handleOpenModal = (postagem: Postagem) => {
    setSelectedPostagem(postagem);
    setRespostas(respostasMap.get(postagem.id) || []);
    setModalOpen(true);
  };

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
          gutterBottom
          sx={{ fontWeight: "bold", color: "#2196f3" }}
        >
          Avaliação das Postagens
        </Typography>
        {postagens.map((postagem) => (
          <Box
            key={postagem.id}
            sx={{
              marginBottom: "20px",
              backgroundColor: "#1f1f1f",
              padding: "15px",
              borderRadius: "8px",
              boxShadow: 3,
              transition: "background-color 0.3s",
              "&:hover": {
                backgroundColor: "#2c2c2c",
                cursor: "pointer",
              },
            }}
            onClick={() => handleOpenModal(postagem)}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "#ffffff" }}
            >
              {postagem.assunto}
            </Typography>
            <Divider sx={{ marginY: 1 }} />
            <Typography variant="body1" sx={{ color: "#e0e0e0" }}>
              {postagem.descricao}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#a0a0a0", marginTop: "5px" }}
            >
              {new Date(postagem.data_postagem).toLocaleDateString()}
            </Typography>
            <Divider sx={{ marginY: 1 }} />
            <Typography
              variant="h6"
              sx={{ display: "flex", alignItems: "center", color: "#ffffff" }}
            >
              <CommentIcon sx={{ marginRight: 1 }} />
              Respostas:
            </Typography>
            <List sx={{ paddingLeft: 2, marginTop: "10px" }}>
              {respostasMap.get(postagem.id)?.length > 0 ? (
                respostasMap.get(postagem.id).map((resposta, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      padding: 0,
                      marginBottom: "8px",
                      backgroundColor: "#2c2c2c",
                      borderRadius: "4px",
                      padding: "10px",
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 0 }}>
                      <CommentIcon fontSize="small" sx={{ color: "#a0a0a0" }} />
                    </ListItemIcon>
                    <Typography variant="body2" sx={{ color: "#e0e0e0" }}>
                      {resposta}
                    </Typography>
                  </ListItem>
                ))
              ) : (
                <Typography variant="body2" sx={{ color: "#a0a0a0" }}>
                  Nenhuma resposta encontrada.
                </Typography>
              )}
            </List>
          </Box>
        ))}
      </Container>
      <Footer />
    </>
  );
};

export default AvaliacaoPage;
