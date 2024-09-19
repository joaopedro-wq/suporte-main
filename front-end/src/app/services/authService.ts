import axios, { AxiosResponse } from "axios";

const API_URL = "http://localhost:3000/api";

// Interface para a resposta do registro
interface RegisterResponse {
  message: string;
  data: {
    id: number;
    nome: string;
    email: string;
    tipo: string;
  };
}


export const register = async (
  nome: string,
  email: string,
  tipo: string,
  senha: string
): Promise<RegisterResponse | null> => {
  try {
    const response: AxiosResponse<RegisterResponse> = await axios.post(
      `${API_URL}/usuarios`, 
      {
        nome,
        email,
        tipo,
        senha,
      }
    );
    
    return response.data;
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);
    return null;
  }
};

export const login = async (
  email: string,
  senha: string
): Promise<RegisterResponse | null> => {
  try {
    const response: AxiosResponse<RegisterResponse> = await axios.post(
      `${API_URL}/usuarios/login`,
      {
        email,
        senha,
      }
    );
     
    return response.data;
  } catch (error) {
    console.error("Erro ao realizar login:", error);
    return null;
  }
};


interface BuscarUsuariosResponse {
  data: RegisterResponse[]; 
}

// Atualize a função BuscarUsuarios
export const BuscarUsuarios = async (): Promise<RegisterResponse[] | null> => {
  try {
    const response: AxiosResponse<BuscarUsuariosResponse> = await axios.get(
      `${API_URL}/usuarios`
    );

    return response.data.data; // Acessando o array de usuários na resposta
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    return null;
  }
};
