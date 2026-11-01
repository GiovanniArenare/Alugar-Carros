
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cadastrarUsuario } from "../services/api";
import "./Cadastro.css";

function Cadastro() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleCadastro(e) {
    e.preventDefault();
    setErro("");

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    try {
      setCarregando(true);

      await cadastrarUsuario({
        nome,
        email,
        senha
      });

      alert("Conta criada com sucesso! Faça login.");
      navigate("/login");

    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="cadastro-page">
      <section className="cadastro-card">
        <header className="cadastro-header">
          <h1>AlugaCar</h1>
          <p>Crie sua conta</p>
          <span>Preencha os dados para começar.</span>
        </header>

        <form className="cadastro-form" onSubmit={handleCadastro}>
          <div className="form-group">
            <label htmlFor="nome">Nome completo</label>
            <input
              type="text"
              id="nome"
              placeholder="Digite seu nome completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

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
              placeholder="Crie uma senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              minLength={8}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmarSenha">Confirmar senha</label>
            <input
              type="password"
              id="confirmarSenha"
              placeholder="Confirme sua senha"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              required
            />
          </div>

          {erro && <p className="erro-mensagem">{erro}</p>}

          <button type="submit" disabled={carregando}>
            {carregando ? "Criando conta..." : "Criar conta"}
          </button>
        </form>

        <p className="login-link">
          Já possui uma conta? <Link to="/login">Faça login</Link>
        </p>
      </section>
    </main>
  );
}

export default Cadastro;
