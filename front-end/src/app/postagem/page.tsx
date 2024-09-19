"use client";

import { useState } from "react";
import { criarPostagem } from "../services/postagem";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { Container, Typography, TextField, Button, Box } from "@mui/material";
import Footer from "@/components/Footer";

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

  return (
    <>
      <Header />
      <Container
        className="min-h-screen bg-zinc-800"
        sx={{
          padding: "20px",
          maxWidth: "1200px",
          margin: "0 auto",
          backgroundColor: "#1f1f1f",
          color: "#e0e0e0",
        }}
      >
        <Typography
          variant="h4"
          sx={{ marginTop: "3%", textAlign: "center" }}
          gutterBottom
        >
          Criar Postagem
        </Typography>

        <form onSubmit={handlePostar}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              maxWidth: "600px",
              margin: "0 auto",
              marginTop: "3%",
            }}
          >
            <TextField
              label="Assunto"
              variant="outlined"
              value={assunto}
              onChange={(e) => setAssunto(e.target.value)}
              required
              sx={{
                backgroundColor: "#2d2d2d",
                borderRadius: "4px",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#555",
                  },
                  "&:hover fieldset": {
                    borderColor: "#e0e0e0",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#2196f3",
                },
                "& .MuiInputBase-input": {
                  color: "#ffffff",
                },
              }}
            />
            <TextField
              label="Equipamento"
              variant="outlined"
              value={equipamento}
              onChange={(e) => setEquipamento(e.target.value)}
              required
              sx={{
                backgroundColor: "#2d2d2d",
                borderRadius: "4px",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#555",
                  },
                  "&:hover fieldset": {
                    borderColor: "#e0e0e0",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#2196f3",
                },
                "& .MuiInputBase-input": {
                  color: "#ffffff",
                },
              }}
            />
            <TextField
              label="Descrição"
              variant="outlined"
              multiline
              rows={4}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
              sx={{
                backgroundColor: "#2d2d2d",
                borderRadius: "4px",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#555",
                  },
                  "&:hover fieldset": {
                    borderColor: "#e0e0e0",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#2196f3",
                },
                "& .MuiInputBase-input": {
                  color: "#ffffff",
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                backgroundColor: "#2196f3",
                "&:hover": {
                  backgroundColor: "#1976d2",
                },
                borderRadius: "4px",
                padding: "10px 20px",
                fontSize: "16px",
                textTransform: "none",
              }}
            >
              Postar
            </Button>
          </Box>
        </form>
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
        {success && (
          <Typography
            variant="body1"
            color="#4caf50"
            align="center"
            sx={{ marginTop: "20px" }}
          >
            {success}
          </Typography>
        )}
      </Container>
      <Footer></Footer>
    </>
  );
};

export default PostagensPage;
