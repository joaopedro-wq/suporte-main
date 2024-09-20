"use client";

import { useEffect, useState } from "react";
import { getPostagens } from "../services/postagem";
import {
  Typography,
  Container,
  Box,
  Divider,
  List,
  ListItem,
  ListItemIcon,
} from "@mui/material";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { listarRespostas } from "../services/resposta";
import CommentIcon from "@mui/icons-material/Comment";
import Rating from "@mui/material/Rating";
import { criarAvaliacao, listarAvaliacoes } from "../services/avaliacao";

interface Postagem {
  id: number;
  usuario_id: number;
  assunto: string;
  equipamento: string;
  descricao: string;
  data_postagem: string;
}

interface Resposta {
  id: number;
  conteudo: string;
  avaliacao: number;
}

const AvaliacaoPage = () => {
  const [postagem, setPostagem] = useState<Postagem | null>(null);
  const [respostas, setRespostas] = useState<Resposta[]>([]);
  const [avaliacoes, setAvaliacoes] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    const fetchData = async () => {
      const postagensResponse = await getPostagens();
      if (postagensResponse && postagensResponse.data) {
        const postagemIdCache = localStorage.getItem("postagemIdCache");

        if (postagemIdCache) {
          const postagemEncontrada = postagensResponse.data.find(
            (p: Postagem) => p.id === Number(postagemIdCache)
          );

          if (postagemEncontrada) {
            setPostagem(postagemEncontrada);
            await fetchRespostas(postagemEncontrada.id);
            await fetchAvaliacoes();
          }
        }
      }
    };

    fetchData();
  }, []);

  const fetchRespostas = async (postagemId: number) => {
    const respostasApi = await listarRespostas(postagemId);
    if (respostasApi && respostasApi.data) {
      setRespostas(
        respostasApi.data.map((res: any) => ({
          id: res.id,
          conteudo: res.conteudo,
          avaliacao: res.avaliacao || 0,
        }))
      );
    } else {
      setRespostas([]);
    }
  };

  const fetchAvaliacoes = async () => {
    const avaliacoesApi = await listarAvaliacoes();
    if (avaliacoesApi && avaliacoesApi.data) {
      const newAvaliacoes = avaliacoesApi.data.reduce(
        (acc: { [key: number]: number }, avaliacao: any) => {
          acc[avaliacao.resposta_id] = avaliacao.nota;
          return acc;
        },
        {}
      );
      setAvaliacoes(newAvaliacoes);
    }
  };

  const handleRatingChange = async (respostaId: number, newRating: number) => {
    setAvaliacoes((prevAvaliacoes) => ({
      ...prevAvaliacoes,
      [respostaId]: newRating,
    }));

    const response = await criarAvaliacao(respostaId, newRating);
    if (response) {
      console.log("Avaliação criada:", response);
      await fetchAvaliacoes();
    }
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
          Avaliação da Postagem
        </Typography>

        {postagem && (
          <Box
            key={postagem.id}
            sx={{
              marginBottom: "20px",
              backgroundColor: "#1f1f1f",
              padding: "15px",
              borderRadius: "8px",
              boxShadow: 3,
            }}
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
              {respostas.length > 0 ? (
                respostas.map((resposta) => (
                  <ListItem
                    key={resposta.id}
                    sx={{
                      padding: 0,
                      marginBottom: "8px",
                      backgroundColor: "#2c2c2c",
                      borderRadius: "4px",
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 0 }}>
                      <CommentIcon fontSize="small" sx={{ color: "#a0a0a0" }} />
                    </ListItemIcon>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ color: "#e0e0e0" }}>
                        {resposta.conteudo}
                      </Typography>
                      <Rating
                        name={`rating-${resposta.id}`}
                        value={avaliacoes[resposta.id] || resposta.avaliacao}
                        onChange={(event, newValue) => {
                          handleRatingChange(resposta.id, newValue || 0);
                        }}
                        max={5}
                        sx={{ marginTop: "5px" }}
                      />
                    </Box>
                  </ListItem>
                ))
              ) : (
                <Typography variant="body2" sx={{ color: "#a0a0a0" }}>
                  Nenhuma resposta encontrada.
                </Typography>
              )}
            </List>
          </Box>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default AvaliacaoPage;