"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../services/authService";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await login(username, password);

    if (response) {
      // Armazenar o ID do usuário no localStorage para uso posterior
        localStorage.setItem("userId", String(response.data.id)); 
        console.log("response", response);
        
      // Redirecionar para a página de postagens
      router.push("/postagem");
    } else {
      setError("Credenciais inválidas");
    }
  };

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#121212", // Dark background
    color: "#e0e0e0", // Light text color
    fontFamily: "Arial, sans-serif",
  };

  const formStyle = {
    backgroundColor: "#1e1e1e", // Darker form background
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
    width: "300px",
  };

  const inputStyle = {
    display: "block",
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "4px",
    border: "1px solid #333",
    backgroundColor: "#2c2c2c", // Dark input background
    color: "#e0e0e0",
  };

  const buttonStyle = {
    backgroundColor: "#6200ea", // Primary color for button
    color: "#ffffff",
    padding: "10px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    width: "100%",
    fontSize: "16px",
  };

  const errorStyle = {
    color: "#ff3b30", // Red color for error messages
    marginTop: "10px",
  };

  return (
    <div style={containerStyle}>
      <h1>Login</h1>
      <form onSubmit={handleLogin} style={formStyle}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <button type="submit" style={buttonStyle}>
          Login
        </button>
      </form>
      {error && <p style={errorStyle}>{error}</p>}
    </div>
  );
};

export default LoginPage;
