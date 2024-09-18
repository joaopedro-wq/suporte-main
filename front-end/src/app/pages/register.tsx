// pages/register.tsx
import { useState } from "react";
import { register } from "../services/authService"; // ajuste o caminho conforme necessário

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await register(username, password);
    if (result) {
      console.log("Cadastro bem-sucedido:", result);
      // Redirecione ou faça algo após o cadastro bem-sucedido
    } else {
      setError("Erro ao cadastrar usuário");
    }
  };

  return (
    <div>
      <h1>Registrar</h1>
      <form onSubmit={handleRegister}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Registrar</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default RegisterPage;
