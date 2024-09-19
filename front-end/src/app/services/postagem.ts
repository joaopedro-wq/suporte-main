import axios, { AxiosResponse } from "axios";

const API_URL = "http://localhost:3000/api";

// Interface para a resposta da criação de postagem
interface CriarPostagemResponse {
  message: string;
  data: {
    id: number;
    usuario_id: number;
    assunto: string;
    equipamento: string;
    descricao: string;
    data_postagem: string;
  };
}

// Interface para a resposta da busca de postagens
interface GetPostagensResponse {
  data: {
    id: number;
    usuario_id: number;
    assunto: string;
    equipamento: string;
    descricao: string;
    data_postagem: string;
  }[];
}

// Função para criar uma postagem
export const criarPostagem = async (
  usuario_id: number,
  assunto: string,
  equipamento: string,
  descricao: string
): Promise<CriarPostagemResponse | null> => {
  try {
    const response: AxiosResponse<CriarPostagemResponse> = await axios.post(
      `${API_URL}/postagens`,
      {
        usuario_id,
        assunto,
        equipamento,
        descricao,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Erro ao criar a postagem:", error);
    return null;
  }
};

// Função para buscar todas as postagens de um usuário
export const getPostagens = async (
  /* usuario_id: number */
): Promise<GetPostagensResponse | null> => {
  try {
    const response: AxiosResponse<GetPostagensResponse> = await axios.get(
      `${API_URL}/postagens/`
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar postagens:", error);
    return null;
  }
};
