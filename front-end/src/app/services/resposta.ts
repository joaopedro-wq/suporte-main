import axios, { AxiosResponse } from "axios";

const API_URL = "http://localhost:3000/api";

// Interface para a resposta da criação de uma resposta
interface CriarRespostaResponse {
  message: string;
  data: {
    id: number;
    postagem_id: number;
    conteudo: string;
    data_resposta: string;
  };
}

// Interface para a resposta da busca de respostas
interface GetRespostasResponse {
  data: {
    id: number;
    postagem_id: number;
    conteudo: string;
    data_resposta: string;
  }[];
}

// Interface para a resposta da atualização de uma resposta
interface AtualizarRespostaResponse {
  message: string;
}

// Função para criar uma resposta
export const criarResposta = async (
  postagem_id: number,
  conteudo: string
): Promise<CriarRespostaResponse | null> => {
  try {
    const response: AxiosResponse<CriarRespostaResponse> = await axios.post(
      `${API_URL}/respostas`,
      { postagem_id, conteudo }
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao criar a resposta:", error);
    return null;
  }
};

// Função para listar todas as respostas de uma postagem
export const listarRespostas = async (
  postagem_id: number
): Promise<GetRespostasResponse | null> => {
  try {
    const response: AxiosResponse<GetRespostasResponse> = await axios.get(
      `${API_URL}/respostas/${postagem_id}`
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao listar respostas:", error);
    return null;
  }
};

// Função para atualizar uma resposta
export const atualizarResposta = async (
  id: number,
  conteudo: string
): Promise<AtualizarRespostaResponse | null> => {
  try {
    const response: AxiosResponse<AtualizarRespostaResponse> = await axios.put(
      `${API_URL}/respostas/${id}`,
      { conteudo }
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar a resposta:", error);
    return null;
  }
};

// Função para excluir uma resposta
export const excluirResposta = async (id: number): Promise<boolean> => {
  try {
    await axios.delete(`${API_URL}/respostas/${id}`);
    return true;
  } catch (error) {
    console.error("Erro ao excluir a resposta:", error);
    return false;
  }
};

// Função para avaliar uma resposta
export const avaliarResposta = async (
  id: number,
  nota: number
): Promise<AtualizarRespostaResponse | null> => {
  try {
    const response: AxiosResponse<AtualizarRespostaResponse> = await axios.post(
      `${API_URL}/respostas/${id}/avaliar`,
      { nota }
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao avaliar a resposta:", error);
    return null;
  }
};
