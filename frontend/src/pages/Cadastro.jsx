
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cadastrarUsuario } from "../services/api";
import { formatarCPF, somenteDigitos } from "../utils/formatadores";
import EnderecoFields from "../components/EnderecoFields";
import RendimentosFields from "../components/RendimentosFields";
import "./Cadastro.css";
import carro from "../assets/alugar-carro.jpg";

const ENDERECO_INICIAL = {
  cep: "",
  logradouro: "",
  numero: "",
  complemento: "",
  bairro: "",
  cidade: "",
  uf: ""
};

function Cadastro() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [rg, setRg] = useState("");
  const [profissao, setProfissao] = useState("");
  const [endereco, setEndereco] = useState(ENDERECO_INICIAL);
  const [rendimentos, setRendimentos] = useState([
    { entidadeEmpregadora: "", valor: "" }
  ]);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleCadastro(e) {
    e.preventDefault();
    setErro("");

    if (somenteDigitos(cpf).length !== 11) {
      setErro("Informe um CPF válido.");
      return;
    }

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    try {
      setCarregando(true);

      await cadastrarUsuario({
        nome,
        email,
        senha,
        cpf: somenteDigitos(cpf),
        rg,
        profissao,
        endereco: { ...endereco, cep: somenteDigitos(endereco.cep) },
        rendimentos: rendimentos.map((item) => ({
          entidadeEmpregadora: item.entidadeEmpregadora,
          valor: Number(item.valor)
        }))
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
      <div className="cadastro-layout">

        <section className="cadastro-card">
          <header className="cadastro-header">
            <Link to="/login" className="auth-logo">
              Aluga<span>Car</span>
            </Link>

            <div className="auth-heading">
              <span className="auth-tag">FAÇA PARTE DA ALUGACAR</span>
              <h2>Crie sua conta</h2>
              <p>Preencha seus dados e comece sua jornada.</p>
            </div>
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
              <label htmlFor="cpf">CPF</label>
              <input
                type="text"
                id="cpf"
                placeholder="000.000.000-00"
                value={cpf}
                onChange={(e) => setCpf(formatarCPF(e.target.value))}
                inputMode="numeric"
                maxLength={14}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="rg">RG</label>
              <input
                type="text"
                id="rg"
                placeholder="Digite seu RG"
                value={rg}
                onChange={(e) => setRg(e.target.value)}
                maxLength={20}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="profissao">Profissão</label>
              <input
                type="text"
                id="profissao"
                placeholder="Ex.: Engenheiro de software"
                value={profissao}
                onChange={(e) => setProfissao(e.target.value)}
                maxLength={100}
                required
              />
            </div>

            <EnderecoFields endereco={endereco} onChange={setEndereco} />

            <RendimentosFields
              rendimentos={rendimentos}
              onChange={setRendimentos}
            />

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
              {!carregando && <span>→</span>}
            </button>
          </form>

          <p className="login-link">
            Já possui uma conta?
            <Link to="/login"> Faça login</Link>
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
            <span className="visual-tag">SEU CAMINHO, SUAS REGRAS</span>
            <h1>
              Sua próxima experiência começa <span>aqui.</span>
            </h1>

          </div>

          <div className="visual-brand">ALUGACAR</div>
        </aside>

      </div>
    </main>
  );
}

export default Cadastro;
