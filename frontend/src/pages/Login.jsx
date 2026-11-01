
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fazerLogin } from "../services/api";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setErro("");

    try {
      setCarregando(true);

      const usuario = await fazerLogin({ email, senha });

      // Guarda os dados básicos do usuário durante a sessão da aba
      sessionStorage.setItem("usuario", JSON.stringify(usuario));

      // Direciona conforme o tipo de conta
      if (usuario.tipo === "AGENTE") {
        navigate("/agente");
      } else {
        navigate("/cliente");
      }

    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-header">
          <h1>AlugaCar</h1>
          <p>Bem-vindo de volta!</p>
          <span>Entre na sua conta para continuar.</span>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <input
              type="password"
              id="senha"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          {erro && <p className="erro-mensagem">{erro}</p>}

          <button type="submit" disabled={carregando}>
            {carregando ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="register-link">
          Ainda não possui uma conta?{" "}
          <Link to="/cadastro">Cadastre-se</Link>
        </p>
      </section>
    </main>
  );
}

export default Login;
