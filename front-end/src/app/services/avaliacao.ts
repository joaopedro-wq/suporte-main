import axios, { AxiosResponse } from "axios";

const API_URL = "http://localhost:3000/api";


interface CriarAvaliacaoResponse {
  message: string;
  data: {
    id: number;
    resposta_id: number;
    nota: number;
  };
}


interface ListarAvaliacoesResponse {
  data: {
    id: number;
    resposta_id: number;
    nota: number;
  }[];
}


interface AtualizarAvaliacaoResponse {
  message: string;
  data: {
    id: number;
    nota: number;
  };
}


export const criarAvaliacao = async (
  resposta_id: number,
  nota: number
): Promise<CriarAvaliacaoResponse | null> => {
  try {
    const response: AxiosResponse<CriarAvaliacaoResponse> = await axios.post(
      `${API_URL}/avaliacoes`,
      { resposta_id, nota }
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao criar a avaliação:", error);
    return null;
  }
};

// Função para listar todas as avaliações
export const listarAvaliacoes =
  async (): Promise<ListarAvaliacoesResponse | null> => {
    try {
      const response: AxiosResponse<ListarAvaliacoesResponse> = await axios.get(
        `${API_URL}/avaliacoes`
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao listar avaliações:", error);
      return null;
    }
  };

// Função para listar uma avaliação por ID
export const listarAvaliacaoPorId = async (
  id: number
): Promise<CriarAvaliacaoResponse | null> => {
  try {
    const response: AxiosResponse<CriarAvaliacaoResponse> = await axios.get(
      `${API_URL}/avaliacoes/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar a avaliação:", error);
    return null;
  }
};

// Função para atualizar uma avaliação
export const atualizarAvaliacao = async (
  id: number,
  nota: number
): Promise<AtualizarAvaliacaoResponse | null> => {
  try {
    const response: AxiosResponse<AtualizarAvaliacaoResponse> = await axios.put(
      `${API_URL}/avaliacoes/${id}`,
      { nota }
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar a avaliação:", error);
    return null;
  }
};

// Função para deletar uma avaliação
export const deletarAvaliacao = async (id: number): Promise<boolean> => {
  try {
    await axios.delete(`${API_URL}/avaliacoes/${id}`);
    return true;
  } catch (error) {
    console.error("Erro ao deletar a avaliação:", error);
    return false;
  }
};
