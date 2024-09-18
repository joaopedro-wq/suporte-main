import axios, { AxiosResponse } from "axios";

const API_URL = "http://localhost:3000/api"; 

// Interface para a resposta do login
interface LoginResponse {
  token: string; 
}


export const login = async (
  username: string,
  password: string
): Promise<LoginResponse | null> => {
  try {
    const response: AxiosResponse<LoginResponse> = await axios.post(
      `${API_URL}/usuarios`,
      {
        username,
        password,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    return null;
  }
};


interface RegisterResponse {
  message: string;
  data: {
    id: number;
    username: string;
  };
}

export const register = async (
  username: string,
  password: string
): Promise<RegisterResponse | null> => {
  try {
    const response: AxiosResponse<RegisterResponse> = await axios.post(
      `${API_URL}/usuarios`,
      {
        username,
        password,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);
    return null;
  }
};
