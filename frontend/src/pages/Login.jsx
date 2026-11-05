
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fazerLogin } from "../services/api";
import "./Login.css";
import carro from "../assets/alugar-carro.jpg";

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

      sessionStorage.setItem("usuario", JSON.stringify(usuario));

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
      <div className="login-layout">

        <section className="login-card">
          <header className="login-header">
            <Link to="/login" className="auth-logo">
              Aluga<span>Car</span>
            </Link>

            <div className="auth-heading">
              <span className="auth-tag">BEM-VINDO DE VOLTA</span>
              <h2>Entre na sua conta</h2>
              <p>Acesse sua conta para continuar sua jornada.</p>
            </div>
          </header>

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
              {!carregando && <span>→</span>}
            </button>
          </form>

          <p className="register-link">
            Ainda não possui uma conta?
            <Link to="/cadastro"> Cadastre-se</Link>
          </p>

          <div className="auth-footer">
            ALUGACAR · ALUGUEL DE AUTOMÓVEIS
          </div>
        </section>

        <aside className="auth-visual">
          <img
            src={carro}
            alt="Carro moderno em ambiente noturno"
          />

          <div className="auth-visual-overlay"></div>

          <div className="auth-visual-content">
            <span className="visual-tag">SUA PRÓXIMA VIAGEM COMEÇA AQUI</span>
            <h1>
              Alugue o carro ideal para a sua <span>jornada.</span>
            </h1>
          </div>

          <div className="visual-brand">ALUGACAR</div>
        </aside>

      </div>
    </main>
  );
}

export default Login;
